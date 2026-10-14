import os
import pandas as pd
import json

def inspect():
    raw_path = os.path.join("data", "raw", "data.csv")
    with open(raw_path, "r", encoding="utf-8") as f:
        first_line = f.readline()
    sep = ";" if ";" in first_line else ","
    print(f"Detected separator: '{sep}'")
    
    df = pd.read_csv(raw_path, sep=sep)
    print("Dataset Shape:", df.shape)
    print("\nColumns and Dtypes:")
    for col, dtype in zip(df.columns, df.dtypes):
        print(f"  - {col}: {dtype}")
        
    print("\nTarget Class Distribution:")
    target_counts = df['Target'].value_counts()
    target_pct = df['Target'].value_counts(normalize=True) * 100
    for cls in target_counts.index:
        print(f"  {cls}: {target_counts[cls]} ({target_pct[cls]:.2f}%)")
        
    missing = df.isnull().sum()
    print("\nMissing values total:", missing.sum())
    duplicates = df.duplicated().sum()
    print("Duplicate rows count:", duplicates)
    
    # Save inspection summary
    os.makedirs("outputs", exist_ok=True)
    summary = {
        "num_rows": int(df.shape[0]),
        "num_columns": int(df.shape[1]),
        "features": [c for c in df.columns if c != "Target"],
        "target_column": "Target",
        "target_classes": target_counts.to_dict(),
        "missing_values_total": int(missing.sum()),
        "duplicate_rows": int(duplicates),
        "separator": sep
    }
    with open(os.path.join("outputs", "dataset_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    print("\nInspection summary saved to outputs/dataset_summary.json")

if __name__ == "__main__":
    inspect()
