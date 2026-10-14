import os
import json
import joblib
import pandas as pd
import numpy as np


def test_artifacts_exist():
    required_files = [
        os.path.join("data", "raw", "data.csv"),
        os.path.join("models", "best_model.joblib"),
        os.path.join("outputs", "model_comparison.csv"),
        os.path.join("outputs", "metrics.json"),
        os.path.join("outputs", "confusion_matrix.png"),
        os.path.join("outputs", "outcome_distribution.png"),
    ]
    for file_path in required_files:
        assert os.path.exists(file_path), f"Required file missing: {file_path}"
    print("[PASS] All required artifacts exist.")


def test_metrics_integrity():
    metrics_path = os.path.join("outputs", "metrics.json")
    with open(metrics_path, "r", encoding="utf-8") as f:
        metrics = json.load(f)

    assert "metadata" in metrics
    assert "models" in metrics
    assert "best_model" in metrics
    assert len(metrics["models"]) == 3

    for model_name, m in metrics["models"].items():
        assert 0.0 <= m["accuracy"] <= 1.0
        assert 0.0 <= m["macro_f1"] <= 1.0
        assert 0.0 <= m["weighted_f1"] <= 1.0
        assert len(m["per_class"]) == 3
        for cls, scores in m["per_class"].items():
            assert 0.0 <= scores["precision"] <= 1.0
            assert 0.0 <= scores["recall"] <= 1.0
            assert 0.0 <= scores["f1-score"] <= 1.0

    print("[PASS] Metrics file passes all structural and numerical integrity checks.")


def test_pipeline_reload_and_prediction():
    model_path = os.path.join("models", "best_model.joblib")
    pipeline = joblib.load(model_path)
    assert hasattr(pipeline, "predict"), "Loaded pipeline must have predict method"

    # Load raw dataset sample
    data_path = os.path.join("data", "raw", "data.csv")
    with open(data_path, "r", encoding="utf-8") as f:
        first_line = f.readline()
    sep = ";" if ";" in first_line else ","
    df = pd.read_csv(data_path, sep=sep)
    df.columns = df.columns.str.strip()

    X = df.drop(columns=["Target"])
    sample = X.iloc[:5]

    predictions = pipeline.predict(sample)
    assert len(predictions) == 5, f"Expected 5 predictions, got {len(predictions)}"

    valid_classes = {"Dropout", "Enrolled", "Graduate"}
    for pred in predictions:
        assert pred in valid_classes, f"Prediction {pred} not in valid classes {valid_classes}"

    if hasattr(pipeline, "predict_proba"):
        probabilities = pipeline.predict_proba(sample)
        assert probabilities.shape == (5, 3), f"Probabilities shape mismatch: {probabilities.shape}"
        assert np.allclose(probabilities.sum(axis=1), 1.0), "Probabilities must sum to 1.0"
        print("[PASS] Predict_proba verified: returns 3 valid probabilities summing to 1.0.")

    print(f"[PASS] Successfully reloaded pipeline and generated predictions on sample data:")
    for i, (pred, prob) in enumerate(zip(predictions, probabilities)):
        prob_dict = {cls: round(float(p), 4) for cls, p in zip(pipeline.classes_, prob)}
        print(f"  Sample {i+1}: Predicted = {pred} | Probabilities = {prob_dict}")


if __name__ == "__main__":
    print("Running Step 1 Verification Tests...")
    test_artifacts_exist()
    test_metrics_integrity()
    test_pipeline_reload_and_prediction()
    print("\nALL STEP 1 ACCEPTANCE CHECKS PASSED SUCCESSFULLY.")
