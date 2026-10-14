import os
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    classification_report,
    confusion_matrix,
)

# Configuration & Reproducibility Constants
RANDOM_STATE = 42
TEST_SIZE = 0.20
DATA_PATH = os.path.join("data", "raw", "data.csv")
MODELS_DIR = "models"
OUTPUTS_DIR = "outputs"


def load_and_clean_data(data_path: str):
    """Loads raw dataset and cleans column names."""
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}. Run download_data.py first.")

    # Read separator
    with open(data_path, "r", encoding="utf-8") as f:
        first_line = f.readline()
    sep = ";" if ";" in first_line else ","

    df = pd.read_csv(data_path, sep=sep)
    # Strip any trailing whitespace/tabs from column names
    df.columns = df.columns.str.strip()
    return df


def plot_outcome_distribution(df: pd.DataFrame, output_path: str):
    """Generates and saves the target class distribution plot."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    counts = df["Target"].value_counts()
    percentages = df["Target"].value_counts(normalize=True) * 100

    plt.figure(figsize=(7, 5))
    colors = ["#2b5c8f", "#d95f02", "#7570b3"]
    bars = plt.bar(counts.index, counts.values, color=colors, edgecolor="black", alpha=0.85)

    plt.title("Student Academic Outcome Distribution (UCI Dataset 697)", fontsize=13, fontweight="bold", pad=12)
    plt.xlabel("Outcome Class", fontsize=11, labelpad=8)
    plt.ylabel("Number of Students", fontsize=11, labelpad=8)
    plt.grid(axis="y", linestyle="--", alpha=0.5)

    for bar, pct in zip(bars, percentages.values):
        height = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2.0,
            height + 25,
            f"{int(height)}\n({pct:.1f}%)",
            ha="center",
            va="bottom",
            fontsize=10,
            fontweight="bold",
        )

    plt.ylim(0, max(counts.values) * 1.15)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Saved outcome distribution chart to {output_path}")


def train_and_evaluate():
    """Trains, compares 3 classifiers, saves best pipeline and metrics."""
    os.makedirs(MODELS_DIR, exist_ok=True)
    os.makedirs(OUTPUTS_DIR, exist_ok=True)

    print("Loading raw dataset...")
    df = load_and_clean_data(DATA_PATH)
    print(f"Loaded dataset with shape {df.shape}")

    # Generate outcome distribution chart
    outcome_plot_path = os.path.join(OUTPUTS_DIR, "outcome_distribution.png")
    plot_outcome_distribution(df, outcome_plot_path)

    X = df.drop(columns=["Target"])
    y = df["Target"]
    classes = sorted(y.unique().tolist())
    feature_names = X.columns.tolist()

    print(f"Features count: {len(feature_names)}")
    print(f"Target classes: {classes}")

    # Stratified train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    print(f"Training instances: {len(X_train)}, Held-out test instances: {len(X_test)}")

    # Define candidate pipelines
    # StandardScaler fitted ONLY on training data via Pipeline
    models = {
        "Logistic Regression": Pipeline([
            ("scaler", StandardScaler()),
            ("classifier", LogisticRegression(max_iter=1000, random_state=RANDOM_STATE)),
        ]),
        "Decision Tree": Pipeline([
            ("scaler", StandardScaler()),
            ("classifier", DecisionTreeClassifier(max_depth=6, random_state=RANDOM_STATE)),
        ]),
        "Random Forest": Pipeline([
            ("scaler", StandardScaler()),
            ("classifier", RandomForestClassifier(n_estimators=100, random_state=RANDOM_STATE)),
        ]),
    }

    results = []
    trained_pipelines = {}
    detailed_metrics = {
        "metadata": {
            "dataset": "Predict Students' Dropout and Academic Success (UCI ID 697)",
            "random_state": RANDOM_STATE,
            "test_size": TEST_SIZE,
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "target_classes": classes,
            "features": feature_names,
        },
        "models": {},
    }

    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    plot_idx = 0

    best_macro_f1 = -1.0
    best_model_name = None

    for name, pipeline in models.items():
        print(f"\n--- Training {name} ---")
        pipeline.fit(X_train, y_train)
        trained_pipelines[name] = pipeline

        y_pred = pipeline.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        macro_f1 = f1_score(y_test, y_pred, average="macro")
        weighted_f1 = f1_score(y_test, y_pred, average="weighted")
        macro_prec = precision_score(y_test, y_pred, average="macro", zero_division=0)
        macro_rec = recall_score(y_test, y_pred, average="macro", zero_division=0)

        # Per-class metrics
        report = classification_report(y_test, y_pred, target_names=classes, output_dict=True, zero_division=0)
        cm = confusion_matrix(y_test, y_pred, labels=classes)

        print(f"Accuracy:    {acc:.4f}")
        print(f"Macro F1:    {macro_f1:.4f}")
        print(f"Weighted F1: {weighted_f1:.4f}")

        results.append({
            "Model": name,
            "Accuracy": round(acc, 4),
            "Macro F1": round(macro_f1, 4),
            "Weighted F1": round(weighted_f1, 4),
            "Macro Precision": round(macro_prec, 4),
            "Macro Recall": round(macro_rec, 4),
        })

        detailed_metrics["models"][name] = {
            "accuracy": float(acc),
            "macro_f1": float(macro_f1),
            "weighted_f1": float(weighted_f1),
            "macro_precision": float(macro_prec),
            "macro_recall": float(macro_rec),
            "per_class": {
                cls: {
                    "precision": float(report[cls]["precision"]),
                    "recall": float(report[cls]["recall"]),
                    "f1-score": float(report[cls]["f1-score"]),
                    "support": int(report[cls]["support"]),
                }
                for cls in classes
            },
            "confusion_matrix": cm.tolist(),
        }

        # Plot confusion matrix
        sns.heatmap(
            cm,
            annot=True,
            fmt="d",
            cmap="Blues",
            xticklabels=classes,
            yticklabels=classes,
            ax=axes[plot_idx],
            cbar=False,
        )
        axes[plot_idx].set_title(f"{name}\nMacro F1: {macro_f1:.3f} | Acc: {acc:.3f}", fontsize=11, fontweight="bold")
        axes[plot_idx].set_xlabel("Predicted Label", fontsize=10)
        axes[plot_idx].set_ylabel("True Label", fontsize=10)
        plot_idx += 1

        # Model selection: use macro F1 to account for multi-class imbalance
        if macro_f1 > best_macro_f1:
            best_macro_f1 = macro_f1
            best_model_name = name

    plt.tight_layout()
    cm_path = os.path.join(OUTPUTS_DIR, "confusion_matrix.png")
    plt.savefig(cm_path, dpi=300)
    plt.close()
    print(f"\nSaved confusion matrix plot to {cm_path}")

    # Save comparison dataframe
    comparison_df = pd.DataFrame(results)
    comparison_csv_path = os.path.join(OUTPUTS_DIR, "model_comparison.csv")
    comparison_df.to_csv(comparison_csv_path, index=False)
    print(f"Saved model comparison table to {comparison_csv_path}")

    # Best model selection record
    print(f"\nSelected Best Model: {best_model_name} (Macro F1 = {best_macro_f1:.4f})")
    detailed_metrics["best_model"] = {
        "name": best_model_name,
        "selection_metric": "Macro F1",
        "macro_f1": float(best_macro_f1),
    }

    metrics_json_path = os.path.join(OUTPUTS_DIR, "metrics.json")
    with open(metrics_json_path, "w", encoding="utf-8") as f:
        json.dump(detailed_metrics, f, indent=2)
    print(f"Saved detailed metrics to {metrics_json_path}")

    # Save the complete pipeline for the best model
    best_pipeline = trained_pipelines[best_model_name]
    pipeline_save_path = os.path.join(MODELS_DIR, "best_model.joblib")
    joblib.dump(best_pipeline, pipeline_save_path)
    print(f"Saved complete best pipeline to {pipeline_save_path}")

    return best_model_name, best_pipeline, X_test, y_test


if __name__ == "__main__":
    train_and_evaluate()
