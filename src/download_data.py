import os
import zipfile
import requests

DATA_URL = "https://archive.ics.uci.edu/static/public/697/predict+students+dropout+and+academic+success.zip"
RAW_DIR = os.path.join("data", "raw")
ZIP_PATH = os.path.join(RAW_DIR, "predict_students_dropout_and_academic_success.zip")
CSV_PATH = os.path.join(RAW_DIR, "data.csv")

def download_and_extract():
    os.makedirs(RAW_DIR, exist_ok=True)
    if not os.path.exists(ZIP_PATH):
        print(f"Downloading dataset from {DATA_URL}...")
        response = requests.get(DATA_URL, timeout=60)
        response.raise_for_status()
        with open(ZIP_PATH, "wb") as f:
            f.write(response.content)
        print(f"Saved raw zip archive to {ZIP_PATH} ({len(response.content)} bytes).")
    else:
        print(f"Zip archive already exists at {ZIP_PATH}.")

    if not os.path.exists(CSV_PATH):
        print(f"Extracting zip archive...")
        with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
            zip_ref.extractall(RAW_DIR)
        print(f"Extracted contents to {RAW_DIR}.")
    else:
        print(f"Raw data file already exists at {CSV_PATH}.")

if __name__ == "__main__":
    download_and_extract()
