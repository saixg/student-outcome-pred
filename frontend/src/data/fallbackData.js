export const FALLBACK_METRICS = {
  "metadata": {
    "dataset": "Predict Students' Dropout and Academic Success (UCI ID 697)",
    "random_state": 42,
    "test_size": 0.2,
    "train_samples": 3539,
    "test_samples": 885,
    "target_classes": ["Dropout", "Enrolled", "Graduate"]
  },
  "models": {
    "Logistic Regression": {
      "accuracy": 0.7684,
      "macro_f1": 0.6826,
      "weighted_f1": 0.7531,
      "macro_precision": 0.7070,
      "macro_recall": 0.6754,
      "per_class": {
        "Dropout": { "precision": 0.7927, "recall": 0.7676, "f1-score": 0.7800, "support": 284 },
        "Enrolled": { "precision": 0.5248, "recall": 0.3333, "f1-score": 0.4077, "support": 159 },
        "Graduate": { "precision": 0.8035, "recall": 0.9253, "f1-score": 0.8601, "support": 442 }
      },
      "confusion_matrix": [[218, 29, 37], [43, 53, 63], [14, 19, 409]]
    },
    "Decision Tree": {
      "accuracy": 0.7322,
      "macro_f1": 0.6530,
      "weighted_f1": 0.7207,
      "macro_precision": 0.6706,
      "macro_recall": 0.6453,
      "per_class": {
        "Dropout": { "precision": 0.7610, "recall": 0.6725, "f1-score": 0.7140, "support": 284 },
        "Enrolled": { "precision": 0.4711, "recall": 0.3585, "f1-score": 0.4071, "support": 159 },
        "Graduate": { "precision": 0.7797, "recall": 0.9050, "f1-score": 0.8377, "support": 442 }
      },
      "confusion_matrix": [[191, 43, 50], [39, 57, 63], [21, 21, 400]]
    },
    "Random Forest": {
      "accuracy": 0.7638,
      "macro_f1": 0.6847,
      "weighted_f1": 0.7493,
      "macro_precision": 0.7150,
      "macro_recall": 0.6743,
      "per_class": {
        "Dropout": { "precision": 0.8008, "recall": 0.7500, "f1-score": 0.7745, "support": 284 },
        "Enrolled": { "precision": 0.5600, "recall": 0.3522, "f1-score": 0.4324, "support": 159 },
        "Graduate": { "precision": 0.7842, "recall": 0.9208, "f1-score": 0.8470, "support": 442 }
      },
      "confusion_matrix": [[213, 22, 49], [40, 56, 63], [13, 22, 407]]
    }
  },
  "best_model": {
    "name": "Random Forest",
    "selection_metric": "Macro F1",
    "macro_f1": 0.6847
  }
};

export const FALLBACK_SUMMARY = {
  "num_rows": 4424,
  "num_columns": 37,
  "target_column": "Target",
  "target_classes": {
    "Graduate": 2209,
    "Dropout": 1421,
    "Enrolled": 794
  },
  "missing_values_total": 0,
  "duplicate_rows": 0
};

export const FALLBACK_SAMPLES = [
  {
    "Marital status": 1, "Application mode": 17, "Application order": 2, "Course": 9500,
    "Daytime/evening attendance": 1, "Previous qualification": 1, "Previous qualification (grade)": 140.0,
    "Nacionality": 1, "Mother's qualification": 1, "Father's qualification": 1, "Mother's occupation": 4,
    "Father's occupation": 4, "Admission grade": 138.5, "Displaced": 1, "Educational special needs": 0,
    "Debtor": 0, "Tuition fees up to date": 1, "Gender": 0, "Scholarship holder": 1, "Age at enrollment": 19,
    "International": 0, "Curricular units 1st sem (credited)": 0, "Curricular units 1st sem (enrolled)": 6,
    "Curricular units 1st sem (evaluations)": 6, "Curricular units 1st sem (approved)": 6,
    "Curricular units 1st sem (grade)": 15.2, "Curricular units 1st sem (without evaluations)": 0,
    "Curricular units 2nd sem (credited)": 0, "Curricular units 2nd sem (enrolled)": 6,
    "Curricular units 2nd sem (evaluations)": 6, "Curricular units 2nd sem (approved)": 6,
    "Curricular units 2nd sem (grade)": 15.6, "Curricular units 2nd sem (without evaluations)": 0,
    "Unemployment rate": 10.8, "Inflation rate": 1.4, "GDP": 1.74, "Target": "Graduate"
  },
  {
    "Marital status": 1, "Application mode": 1, "Application order": 1, "Course": 9147,
    "Daytime/evening attendance": 1, "Previous qualification": 1, "Previous qualification (grade)": 120.0,
    "Nacionality": 1, "Mother's qualification": 19, "Father's qualification": 19, "Mother's occupation": 8,
    "Father's occupation": 8, "Admission grade": 118.0, "Displaced": 0, "Educational special needs": 0,
    "Debtor": 1, "Tuition fees up to date": 0, "Gender": 1, "Scholarship holder": 0, "Age at enrollment": 24,
    "International": 0, "Curricular units 1st sem (credited)": 0, "Curricular units 1st sem (enrolled)": 5,
    "Curricular units 1st sem (evaluations)": 4, "Curricular units 1st sem (approved)": 0,
    "Curricular units 1st sem (grade)": 0.0, "Curricular units 1st sem (without evaluations)": 0,
    "Curricular units 2nd sem (credited)": 0, "Curricular units 2nd sem (enrolled)": 5,
    "Curricular units 2nd sem (evaluations)": 0, "Curricular units 2nd sem (approved)": 0,
    "Curricular units 2nd sem (grade)": 0.0, "Curricular units 2nd sem (without evaluations)": 0,
    "Unemployment rate": 13.9, "Inflation rate": -0.3, "GDP": 0.79, "Target": "Dropout"
  },
  {
    "Marital status": 1, "Application mode": 1, "Application order": 2, "Course": 9238,
    "Daytime/evening attendance": 1, "Previous qualification": 1, "Previous qualification (grade)": 125.0,
    "Nacionality": 1, "Mother's qualification": 1, "Father's qualification": 1, "Mother's occupation": 5,
    "Father's occupation": 7, "Admission grade": 122.0, "Displaced": 1, "Educational special needs": 0,
    "Debtor": 0, "Tuition fees up to date": 1, "Gender": 0, "Scholarship holder": 0, "Age at enrollment": 21,
    "International": 0, "Curricular units 1st sem (credited)": 0, "Curricular units 1st sem (enrolled)": 6,
    "Curricular units 1st sem (evaluations)": 8, "Curricular units 1st sem (approved)": 3,
    "Curricular units 1st sem (grade)": 11.2, "Curricular units 1st sem (without evaluations)": 0,
    "Curricular units 2nd sem (credited)": 0, "Curricular units 2nd sem (enrolled)": 6,
    "Curricular units 2nd sem (evaluations)": 7, "Curricular units 2nd sem (approved)": 3,
    "Curricular units 2nd sem (grade)": 11.0, "Curricular units 2nd sem (without evaluations)": 0,
    "Unemployment rate": 12.4, "Inflation rate": 0.5, "GDP": 1.79, "Target": "Enrolled"
  }
];

export function clientPredictFallback(features) {
  const sem2Approved = features["Curricular units 2nd sem (approved)"] ?? 6;
  const sem1Approved = features["Curricular units 1st sem (approved)"] ?? 6;
  const tuition = features["Tuition fees up to date"] ?? 1;
  const debtor = features["Debtor"] ?? 0;
  const scholarship = features["Scholarship holder"] ?? 0;
  const sem2Grade = features["Curricular units 2nd sem (grade)"] ?? 14.0;

  let dropoutProb = 0.10;
  let enrolledProb = 0.15;
  let gradProb = 0.75;

  if (tuition === 0) {
    dropoutProb += 0.40;
    gradProb -= 0.35;
  }
  if (debtor === 1) {
    dropoutProb += 0.25;
    gradProb -= 0.20;
  }
  if (sem2Approved === 0) {
    dropoutProb += 0.35;
    gradProb -= 0.30;
  } else if (sem2Approved < 3) {
    dropoutProb += 0.15;
    enrolledProb += 0.25;
    gradProb -= 0.30;
  } else if (sem2Approved >= 5) {
    gradProb += 0.20;
    dropoutProb -= 0.15;
  }

  if (scholarship === 1) {
    gradProb += 0.15;
    dropoutProb -= 0.10;
  }

  // Normalize
  dropoutProb = Math.max(0.01, Math.min(0.98, dropoutProb));
  enrolledProb = Math.max(0.01, Math.min(0.80, enrolledProb));
  gradProb = Math.max(0.01, Math.min(0.98, gradProb));
  const sum = dropoutProb + enrolledProb + gradProb;

  dropoutProb = parseFloat((dropoutProb / sum).toFixed(2));
  enrolledProb = parseFloat((enrolledProb / sum).toFixed(2));
  gradProb = parseFloat((1.0 - dropoutProb - enrolledProb).toFixed(2));

  let pred = "Graduate";
  if (dropoutProb > gradProb && dropoutProb > enrolledProb) {
    pred = "Dropout";
  } else if (enrolledProb > gradProb) {
    pred = "Enrolled";
  }

  const riskLevel = dropoutProb >= 0.60 ? "High" : dropoutProb >= 0.30 ? "Moderate" : "Low";

  const riskFactors = [];
  const interventions = [];
  if (tuition === 0) {
    riskFactors.push("Tuition fees are overdue");
    interventions.push("Contact bursar to establish tuition installment payment plan");
  }
  if (debtor === 1) {
    riskFactors.push("Outstanding debt recorded on student account");
    interventions.push("Financial aid advisory consultation and emergency hardship grant review");
  }
  if (sem2Approved < 3) {
    riskFactors.push(`Critical 2nd semester completion rate (${sem2Approved} units approved)`);
    interventions.push("Academic probation counseling & schedule load adjustment");
  }
  if (riskFactors.length === 0) {
    riskFactors.push("No immediate critical risk triggers detected");
    interventions.push("Maintain standard semester-end advisor check-in");
  }

  return {
    prediction: pred,
    probabilities: {
      "Dropout": dropoutProb,
      "Enrolled": enrolledProb,
      "Graduate": gradProb
    },
    risk_level: riskLevel,
    risk_score_percent: (dropoutProb * 100).toFixed(1),
    risk_factors: riskFactors,
    protective_factors: scholarship === 1 ? ["Active scholarship recipient"] : [],
    actionable_interventions: interventions,
    disclaimer: "This prediction is generated as decision-support guidance for academic advisors. It is not an absolute judgment or deterministic forecast."
  };
}
