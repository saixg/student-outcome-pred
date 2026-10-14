import os
import json
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

app = FastAPI(
    title="EduPredict AI - Student Outcome Prediction API",
    version="1.0.0",
    description="Production-grade ML decision support service using official UCI Dataset 697 and trained Scikit-learn Pipeline."
)

# Enable CORS for local React dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join("models", "best_model.joblib")
METRICS_PATH = os.path.join("outputs", "metrics.json")
SUMMARY_PATH = os.path.join("outputs", "dataset_summary.json")
DATA_PATH = os.path.join("data", "raw", "data.csv")

pipeline = None
features_list = []
classes_list = []
metrics_data = {}
summary_data = {}

def load_resources():
    global pipeline, features_list, classes_list, metrics_data, summary_data
    if os.path.exists(MODEL_PATH):
        pipeline = joblib.load(MODEL_PATH)
        print(f"Loaded ML pipeline from {MODEL_PATH}")
    else:
        print(f"Warning: Model file not found at {MODEL_PATH}")

    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r", encoding="utf-8") as f:
            metrics_data = json.load(f)
            features_list = metrics_data.get("metadata", {}).get("features", [])
            classes_list = metrics_data.get("metadata", {}).get("target_classes", [])
            
    if os.path.exists(SUMMARY_PATH):
        with open(SUMMARY_PATH, "r", encoding="utf-8") as f:
            summary_data = json.load(f)

load_resources()

class PredictionRequest(BaseModel):
    features: Dict[str, Any]

class BatchPredictionRequest(BaseModel):
    students: List[Dict[str, Any]]

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": pipeline is not None,
        "features_count": len(features_list),
        "target_classes": classes_list
    }

@app.get("/api/metrics")
def get_metrics():
    if not metrics_data:
        raise HTTPException(status_code=404, detail="Metrics artifact not found. Please run train.py first.")
    return metrics_data

@app.get("/api/dataset/summary")
def get_dataset_summary():
    if not summary_data:
        raise HTTPException(status_code=404, detail="Dataset summary artifact not found.")
    return summary_data

@app.get("/api/dataset/sample")
def get_sample_students(limit: int = 10):
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=404, detail="Raw dataset not found.")
    
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        first_line = f.readline()
    sep = ";" if ";" in first_line else ","
    df = pd.read_csv(DATA_PATH, sep=sep)
    df.columns = df.columns.str.strip()
    
    sample_rows = df.head(limit).to_dict(orient="records")
    return {"samples": sample_rows, "total_records": len(df)}

def analyze_student_factors(student_dict: Dict[str, Any]):
    risk_factors = []
    protective_factors = []
    interventions = []

    tuition = student_dict.get("Tuition fees up to date", 1)
    debtor = student_dict.get("Debtor", 0)
    scholarship = student_dict.get("Scholarship holder", 0)
    
    sem1_enrolled = student_dict.get("Curricular units 1st sem (enrolled)", 0)
    sem1_approved = student_dict.get("Curricular units 1st sem (approved)", 0)
    sem1_grade = student_dict.get("Curricular units 1st sem (grade)", 0.0)

    sem2_enrolled = student_dict.get("Curricular units 2nd sem (enrolled)", 0)
    sem2_approved = student_dict.get("Curricular units 2nd sem (approved)", 0)
    sem2_grade = student_dict.get("Curricular units 2nd sem (grade)", 0.0)

    # Financial analysis
    if tuition == 0:
        risk_factors.append("Tuition fees are overdue")
        interventions.append("Urgent: Contact student bursar to setup tuition installment relief plan")
    if debtor == 1:
        risk_factors.append("Outstanding debt recorded on student account")
        interventions.append("Financial aid advisory consultation and emergency hardship grant review")
    if scholarship == 1:
        protective_factors.append("Active scholarship holder")

    # Academic analysis
    if sem1_enrolled > 0 and sem1_approved / max(sem1_enrolled, 1) < 0.5:
        risk_factors.append(f"1st Sem low pass rate ({sem1_approved}/{sem1_enrolled} units approved)")
        interventions.append("Assign 1-on-1 subject peer tutor for foundational course concepts")
    elif sem1_approved > 0 and sem1_approved == sem1_enrolled:
        protective_factors.append(f"1st Sem perfect pass rate ({sem1_approved}/{sem1_enrolled} units)")

    if sem2_enrolled > 0 and sem2_approved / max(sem2_enrolled, 1) < 0.5:
        risk_factors.append(f"2nd Sem critical pass rate ({sem2_approved}/{sem2_enrolled} units approved)")
        interventions.append("Academic probation counseling & schedule load adjustment")
    elif sem2_approved > 0 and sem2_approved == sem2_enrolled:
        protective_factors.append(f"2nd Sem complete course completion ({sem2_approved}/{sem2_enrolled} units)")

    if sem1_grade > 0 and sem1_grade < 10.0:
        risk_factors.append(f"1st Sem average grade below passing threshold ({sem1_grade:.1f}/20)")
    if sem2_grade > 0 and sem2_grade < 10.0:
        risk_factors.append(f"2nd Sem average grade below passing threshold ({sem2_grade:.1f}/20)")

    if not risk_factors:
        risk_factors.append("No immediate academic or financial jeopardy indicators detected")
    if not interventions:
        interventions.append("Maintain routine academic progress check-in at end of semester")

    return risk_factors, protective_factors, interventions

@app.post("/api/predict")
def predict_outcome(req: PredictionRequest):
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Model pipeline is not loaded on server.")

    # Convert incoming feature dictionary to single-row DataFrame
    input_data = req.features
    
    # Verify required features
    missing_feats = [f for f in features_list if f not in input_data]
    if missing_feats:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required features: {missing_feats[:5]} (total missing: {len(missing_feats)})"
        )

    # Create ordered DataFrame matching training feature columns
    row_df = pd.DataFrame([{f: input_data[f] for f in features_list}])
    
    # Generate prediction & probabilities
    pred = pipeline.predict(row_df)[0]
    probs = {}
    if hasattr(pipeline, "predict_proba"):
        prob_array = pipeline.predict_proba(row_df)[0]
        probs = {cls: round(float(p), 4) for cls, p in zip(pipeline.classes_, prob_array)}

    # Risk level determination based on Dropout probability
    dropout_prob = probs.get("Dropout", 0.0)
    if dropout_prob >= 0.60:
        risk_level = "High"
    elif dropout_prob >= 0.30:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    risk_factors, protective_factors, interventions = analyze_student_factors(input_data)

    return {
        "prediction": pred,
        "probabilities": probs,
        "risk_level": risk_level,
        "risk_score_percent": round(dropout_prob * 100, 1),
        "risk_factors": risk_factors,
        "protective_factors": protective_factors,
        "actionable_interventions": interventions,
        "disclaimer": "This prediction is generated as decision-support guidance for academic advisors. It is not an absolute judgment or deterministic forecast."
    }

@app.post("/api/batch-predict")
def batch_predict_outcomes(req: BatchPredictionRequest):
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Model pipeline is not loaded on server.")

    results = []
    cohort_counts = {"Dropout": 0, "Enrolled": 0, "Graduate": 0}
    high_risk_count = 0

    for idx, student in enumerate(req.students):
        clean_student = {f: student.get(f, 0) for f in features_list}
        row_df = pd.DataFrame([clean_student])
        pred = pipeline.predict(row_df)[0]
        cohort_counts[pred] = cohort_counts.get(pred, 0) + 1
        
        probs = {}
        if hasattr(pipeline, "predict_proba"):
            p_arr = pipeline.predict_proba(row_df)[0]
            probs = {cls: round(float(p), 4) for cls, p in zip(pipeline.classes_, p_arr)}

        dropout_p = probs.get("Dropout", 0.0)
        if dropout_p >= 0.60:
            risk = "High"
            high_risk_count += 1
        elif dropout_p >= 0.30:
            risk = "Moderate"
        else:
            risk = "Low"

        results.append({
            "index": idx + 1,
            "prediction": pred,
            "dropout_probability": round(dropout_p * 100, 1),
            "graduate_probability": round(probs.get("Graduate", 0.0) * 100, 1),
            "risk_level": risk
        })

    return {
        "total_analyzed": len(req.students),
        "cohort_breakdown": cohort_counts,
        "high_risk_students": high_risk_count,
        "results": results
    }

# Mount frontend static distribution if built
FRONTEND_DIST = os.path.join("frontend", "dist")
if os.path.exists(FRONTEND_DIST):
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse

    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.api:app", host="127.0.0.1", port=8008, reload=True)

