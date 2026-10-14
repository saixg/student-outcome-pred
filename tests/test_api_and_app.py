import os
import requests
import json

BASE_URL = "http://127.0.0.1:8008"

def test_api_health():
    r = requests.get(f"{BASE_URL}/api/health", timeout=5)
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    data = r.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    print("[PASS] API health endpoint verified.")

def test_metrics_endpoint():
    r = requests.get(f"{BASE_URL}/api/metrics", timeout=5)
    assert r.status_code == 200, f"Metrics failed: {r.status_code}"
    data = r.json()
    assert "models" in data
    assert "best_model" in data
    assert data["best_model"]["name"] == "Random Forest"
    print("[PASS] Metrics endpoint verified (Random Forest selected).")

def test_dataset_sample():
    r = requests.get(f"{BASE_URL}/api/dataset/sample?limit=5", timeout=5)
    assert r.status_code == 200
    data = r.json()
    assert len(data["samples"]) == 5
    assert data["total_records"] == 4424
    print("[PASS] Dataset sample endpoint verified (4424 records).")

def test_predict_endpoint():
    # Load 1 real sample
    samples = requests.get(f"{BASE_URL}/api/dataset/sample?limit=1").json()["samples"]
    feat = {k: v for k, v in samples[0].items() if k != "Target"}

    r = requests.post(f"{BASE_URL}/api/predict", json={"features": feat}, timeout=5)
    assert r.status_code == 200
    res = r.json()
    assert "prediction" in res
    assert res["prediction"] in {"Dropout", "Enrolled", "Graduate"}
    assert "probabilities" in res
    assert abs(sum(res["probabilities"].values()) - 1.0) < 1e-3
    assert "risk_level" in res
    assert "actionable_interventions" in res
    print(f"[PASS] Single prediction verified: Predicted = {res['prediction']}, Probabilities = {res['probabilities']}")

def test_batch_predict_endpoint():
    samples = requests.get(f"{BASE_URL}/api/dataset/sample?limit=10").json()["samples"]
    students = [{k: v for k, v in s.items() if k != "Target"} for s in samples]

    r = requests.post(f"{BASE_URL}/api/batch-predict", json={"students": students}, timeout=5)
    assert r.status_code == 200
    data = r.json()
    assert data["total_analyzed"] == 10
    assert len(data["results"]) == 10
    assert "cohort_breakdown" in data
    print(f"[PASS] Batch predict verified: Analyzed = {data['total_analyzed']}, Breakdown = {data['cohort_breakdown']}")

def test_frontend_serving():
    r = requests.get(f"{BASE_URL}/", timeout=5)
    assert r.status_code == 200
    assert "<!doctype html>" in r.text.lower()
    print("[PASS] Static frontend serving verified.")

if __name__ == "__main__":
    print("Running End-to-End API and Web Application Tests...")
    test_api_health()
    test_metrics_endpoint()
    test_dataset_sample()
    test_predict_endpoint()
    test_batch_predict_endpoint()
    test_frontend_serving()
    print("\nALL END-TO-END APPLICATION CHECKS PASSED.")
