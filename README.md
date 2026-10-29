# EduPredict AI — Student Academic Outcome Decision Engine

> **Mini-Project Overview**: EduPredict AI is a machine learning decision-support platform designed for higher education institutions. Trained and evaluated on the official **UCI Predict Students' Dropout and Academic Success dataset (ID 697)**, it analyzes student academic velocity, demographics, and socio-economic factors to identify at-risk students and recommend timely advising interventions.

---

## 🌟 Key Features & Uplifted Architecture

1. **Empirical ML Foundation**:
   - Compares **Logistic Regression**, **Decision Tree**, and **Random Forest** on an identical stratified 80/20 train/test split.
   - Evaluates multiclass outcomes (`Graduate`, `Dropout`, `Enrolled`) using **Macro F1** to respect class imbalance.
   - Complete preprocessing (`StandardScaler`) encapsulated inside a scikit-learn `Pipeline`, fit strictly on training data.
2. **Interactive What-If Academic Simulator**:
   - Adjust academic parameters (e.g., 2nd-semester approved units) and socio-economic indicators (debtor status, tuition payment) to observe real-time shift in class probabilities.
   - One-click presets for common student archetypes + instant loading of real samples from the 4,424 UCI records.
   - Tailored advisor intervention plans based on identified vulnerability and protective factors.
3. **3D Student Risk Manifold (Three.js)**:
   - Interactive 3D particle universe mapping 4,424 student coordinate vectors into distinct outcome clusters (`Graduate` in emerald, `Enrolled` in amber, and `Dropout` in crimson).
   - Mouse-driven orbital camera navigation and halo density zones.
4. **Interactive Model Performance Studio**:
   - Real held-out evaluation metrics loaded directly from `outputs/metrics.json`.
   - Interactive 3-model benchmark table and Confusion Matrix analyzer.
5. **Cohort Batch Auditor**:
   - Audit entire student cohorts simultaneously to identify high-risk students and export structured CSV audit reports.

---

## 📊 Measured Model Performance (885 Held-Out Test Students)

| Model Architecture | Accuracy | Macro F1 (Primary Metric) | Weighted F1 | Macro Precision | Macro Recall | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest** | **76.38%** | **0.6847** | **74.93%** | **71.50%** | **67.43%** | **Selected Best** |
| Logistic Regression | 76.84% | 0.6826 | 75.31% | 70.70% | 67.54% | Baseline |
| Decision Tree | 73.22% | 0.6530 | 72.07% | 67.06% | 64.53% | Comparison |

### Selected Random Forest Per-Class Breakdown

- **Graduate** (442 instances): **84.7% F1** (78.4% Precision, 92.1% Recall)
- **Dropout** (284 instances): **77.5% F1** (80.1% Precision, 75.0% Recall)
- **Enrolled** (159 instances): **43.2% F1** (56.0% Precision, 35.2% Recall)

---

## 🚀 Quickstart & Reproduction Commands

### 1. Prerequisites
- Python 3.12+
- Node.js 18+ (tested on Node v24)
- npm 9+

### 2. Setup Virtual Environment & Dependencies
```powershell
# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Install Python requirements
pip install -r requirements.txt
pip install fastapi uvicorn
```

### 3. Step 1: Run ML Pipeline & Tests
```powershell
# Download official UCI dataset
python src/download_data.py

# Inspect schema, clean whitespace, and verify class distribution
python src/inspect_data.py

# Train 3 models, evaluate on held-out split, and save models/best_model.joblib
python src/train.py

# Run Step 1 acceptance test suite
python tests/test_pipeline.py
```

### 4. Step 2: Build Frontend & Launch Web App
```powershell
# Install frontend dependencies and build production distribution
cd frontend
npm install
npm run build
cd ..

# Launch unified server (Serves both API and React Web App on Port 8008)
python -m uvicorn src.api:app --host 127.0.0.1 --port 8008
```

Open your browser at **`http://localhost:8008`**.

*(Optional) For Frontend Hot-Reload Development:*
```powershell
# In terminal 1 (Backend API)
python -m uvicorn src.api:app --host 127.0.0.1 --port 8008 --reload

# In terminal 2 (Vite React Dev Server)
cd frontend
npm run dev
# Vite runs on http://localhost:3000 and proxies /api to port 8008
```


```

---

## 🛡️ Ethical Decision-Support Notice
EduPredict AI is explicitly designed as an **academic advising decision-support system**. Predictions and risk scores reflect statistical patterns in historical educational cohorts and must never be used to make automated or punitive decisions regarding a student's academic standing.
