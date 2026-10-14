import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Sliders, 
  BookOpen, 
  GraduationCap, 
  FileText,
  ArrowRight
} from 'lucide-react';
import { clientPredictFallback, FALLBACK_SAMPLES } from '../data/fallbackData';

const COURSES = [
  { id: 9119, name: 'Informatics Engineering' },
  { id: 9500, name: 'Nursing' },
  { id: 9147, name: 'Management' },
  { id: 9238, name: 'Social Service' },
  { id: 9003, name: 'Agronomy' },
  { id: 9070, name: 'Communication Design' },
  { id: 9085, name: 'Veterinary Nursing' },
  { id: 9254, name: 'Tourism' },
  { id: 9556, name: 'Oral Hygiene' },
  { id: 9670, name: 'Advertising & Marketing Management' },
  { id: 9773, name: 'Journalism and Communication' },
  { id: 9853, name: 'Basic Education' },
  { id: 171, name: 'Animation and Multimedia Design' },
  { id: 8014, name: 'Social Service (Evening)' },
  { id: 9991, name: 'Management (Evening)' },
];

const DEFAULT_FEATURES = {
  "Marital status": 1,
  "Application mode": 1,
  "Application order": 1,
  "Course": 9500,
  "Daytime/evening attendance": 1,
  "Previous qualification": 1,
  "Previous qualification (grade)": 130.0,
  "Nacionality": 1,
  "Mother's qualification": 1,
  "Father's qualification": 1,
  "Mother's occupation": 5,
  "Father's occupation": 5,
  "Admission grade": 135.0,
  "Displaced": 1,
  "Educational special needs": 0,
  "Debtor": 0,
  "Tuition fees up to date": 1,
  "Gender": 0,
  "Scholarship holder": 1,
  "Age at enrollment": 20,
  "International": 0,
  "Curricular units 1st sem (credited)": 0,
  "Curricular units 1st sem (enrolled)": 6,
  "Curricular units 1st sem (evaluations)": 6,
  "Curricular units 1st sem (approved)": 6,
  "Curricular units 1st sem (grade)": 14.5,
  "Curricular units 1st sem (without evaluations)": 0,
  "Curricular units 2nd sem (credited)": 0,
  "Curricular units 2nd sem (enrolled)": 6,
  "Curricular units 2nd sem (evaluations)": 6,
  "Curricular units 2nd sem (approved)": 6,
  "Curricular units 2nd sem (grade)": 14.8,
  "Curricular units 2nd sem (without evaluations)": 0,
  "Unemployment rate": 10.8,
  "Inflation rate": 1.4,
  "GDP": 1.74
};

const PRESETS = {
  highAchiever: {
    label: "High-Achieving Student",
    description: "Scholarship, fees paid, 6/6 units passed with 15.5+ grade",
    badge: "Graduate Archetype",
    data: {
      ...DEFAULT_FEATURES,
      "Age at enrollment": 19,
      "Admission grade": 155.0,
      "Debtor": 0,
      "Tuition fees up to date": 1,
      "Scholarship holder": 1,
      "Curricular units 1st sem (approved)": 6,
      "Curricular units 1st sem (grade)": 15.5,
      "Curricular units 2nd sem (approved)": 6,
      "Curricular units 2nd sem (grade)": 15.8,
    }
  },
  atRisk: {
    label: "At-Risk In-Debt Student",
    description: "Tuition overdue, debtor, 0 approved units in 2nd term",
    badge: "Dropout Risk Archetype",
    data: {
      ...DEFAULT_FEATURES,
      "Age at enrollment": 24,
      "Admission grade": 115.0,
      "Debtor": 1,
      "Tuition fees up to date": 0,
      "Scholarship holder": 0,
      "Curricular units 1st sem (approved)": 1,
      "Curricular units 1st sem (grade)": 9.5,
      "Curricular units 2nd sem (approved)": 0,
      "Curricular units 2nd sem (grade)": 0.0,
    }
  },
  borderline: {
    label: "Borderline Delayed Student",
    description: "Passing 2-3 units per term, borderline passing grades",
    badge: "Enrolled Archetype",
    data: {
      ...DEFAULT_FEATURES,
      "Age at enrollment": 22,
      "Admission grade": 122.0,
      "Debtor": 0,
      "Tuition fees up to date": 1,
      "Scholarship holder": 0,
      "Curricular units 1st sem (approved)": 3,
      "Curricular units 1st sem (grade)": 10.8,
      "Curricular units 2nd sem (approved)": 2,
      "Curricular units 2nd sem (grade)": 10.5,
    }
  }
};

export default function PredictorForm() {
  const [formData, setFormData] = useState(DEFAULT_FEATURES);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('academic');

  useEffect(() => {
    handlePredict(DEFAULT_FEATURES);
  }, []);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
  };

  const handlePresetSelect = (presetKey) => {
    const preset = PRESETS[presetKey].data;
    setFormData(preset);
    handlePredict(preset);
  };

  const loadRandomDatasetSample = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dataset/sample?limit=10');
      let randomRow;
      if (res.ok) {
        const data = await res.json();
        randomRow = data.samples[Math.floor(Math.random() * data.samples.length)];
      } else {
        randomRow = FALLBACK_SAMPLES[Math.floor(Math.random() * FALLBACK_SAMPLES.length)];
      }
      
      const cleanData = {};
      Object.keys(DEFAULT_FEATURES).forEach(k => {
        cleanData[k] = randomRow[k] !== undefined ? randomRow[k] : DEFAULT_FEATURES[k];
      });
      setFormData(cleanData);
      handlePredict(cleanData);
    } catch {
      const randomRow = FALLBACK_SAMPLES[Math.floor(Math.random() * FALLBACK_SAMPLES.length)];
      const cleanData = {};
      Object.keys(DEFAULT_FEATURES).forEach(k => {
        cleanData[k] = randomRow[k] !== undefined ? randomRow[k] : DEFAULT_FEATURES[k];
      });
      setFormData(cleanData);
      handlePredict(cleanData);
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (dataToPredict = formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: dataToPredict })
      });

      if (!response.ok) {
        throw new Error("API offline; falling back to verified model decision engine");
      }

      const resData = await response.json();
      setResult(resData);

      if (resData.prediction === 'Graduate') {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    } catch {
      // Graceful fallback for static Vercel preview
      const fallbackResult = clientPredictFallback(dataToPredict);
      setResult(fallbackResult);
      if (fallbackResult.prediction === 'Graduate') {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      {/* Header & Archetype Presets */}
      <section className="notion-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#000000] tracking-tight">
                Prediction & What-If Academic Simulator
              </h2>
              <span className="notion-pill bg-[#e6f3fe] text-[#0075de] text-xs">
                Interactive Model
              </span>
            </div>
            <p className="text-xs text-[#615d59] mt-1">
              Select an archetype profile or adjust curricular and financial sliders to test the model's decision boundaries.
            </p>
          </div>

          <button
            onClick={loadRandomDatasetSample}
            disabled={loading}
            className="btn-notion-secondary text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0075de]" />
            Load Sample from UCI Dataset
          </button>
        </div>

        {/* Archetype Quick Cards */}
        <div className="pt-3 border-t border-black/8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.keys(PRESETS).map((key) => {
              const preset = PRESETS[key];
              return (
                <button
                  key={key}
                  onClick={() => handlePresetSelect(key)}
                  className="p-3.5 rounded-lg text-left bg-[#f6f5f4] hover:bg-[#eae8e5] border border-black/8 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#000000] group-hover:text-[#0075de] transition-colors">
                      {preset.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#615d59] mt-1 line-clamp-1">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Grid: Form Inputs (Left) and Results / What-If (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="notion-card p-6 space-y-5">
            
            {/* Sub-Tabs */}
            <div className="flex border-b border-black/8 gap-1 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveSubTab('academic')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeSubTab === 'academic' 
                    ? 'bg-[#000000] text-white font-semibold' 
                    : 'text-[#615d59] hover:text-[#000000] hover:bg-black/4'
                }`}
              >
                1. Academic & Course
              </button>
              <button
                onClick={() => setActiveSubTab('financial')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeSubTab === 'financial' 
                    ? 'bg-[#000000] text-white font-semibold' 
                    : 'text-[#615d59] hover:text-[#000000] hover:bg-black/4'
                }`}
              >
                2. Financial & Social
              </button>
              <button
                onClick={() => setActiveSubTab('sem1')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeSubTab === 'sem1' 
                    ? 'bg-[#000000] text-white font-semibold' 
                    : 'text-[#615d59] hover:text-[#000000] hover:bg-black/4'
                }`}
              >
                3. 1st Sem Performance
              </button>
              <button
                onClick={() => setActiveSubTab('sem2')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeSubTab === 'sem2' 
                    ? 'bg-[#000000] text-white font-semibold' 
                    : 'text-[#615d59] hover:text-[#000000] hover:bg-black/4'
                }`}
              >
                4. 2nd Sem Performance
              </button>
            </div>

            {/* SubTab 1: Academic & Course */}
            {activeSubTab === 'academic' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#111111] block mb-1">
                    Enrolled Degree Course
                  </label>
                  <select
                    value={formData["Course"]}
                    onChange={(e) => handleChange("Course", parseInt(e.target.value))}
                    className="w-full notion-input px-3 py-2 text-xs"
                  >
                    {COURSES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      Age at Enrollment ({formData["Age at enrollment"]} years)
                    </label>
                    <input
                      type="range"
                      min="17"
                      max="65"
                      value={formData["Age at enrollment"]}
                      onChange={(e) => handleChange("Age at enrollment", parseInt(e.target.value))}
                      className="w-full accent-[#0075de]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      Gender
                    </label>
                    <select
                      value={formData["Gender"]}
                      onChange={(e) => handleChange("Gender", parseInt(e.target.value))}
                      className="w-full notion-input px-3 py-2 text-xs"
                    >
                      <option value={0}>Female</option>
                      <option value={1}>Male</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      Admission Grade (0 – 200)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="200"
                      value={formData["Admission grade"]}
                      onChange={(e) => handleChange("Admission grade", parseFloat(e.target.value) || 0)}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      Previous Qualification Grade (0 – 200)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="200"
                      value={formData["Previous qualification (grade)"]}
                      onChange={(e) => handleChange("Previous qualification (grade)", parseFloat(e.target.value) || 0)}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      Attendance Mode
                    </label>
                    <select
                      value={formData["Daytime/evening attendance"]}
                      onChange={(e) => handleChange("Daytime/evening attendance", parseInt(e.target.value))}
                      className="w-full notion-input px-3 py-2 text-xs"
                    >
                      <option value={1}>Daytime Attendance</option>
                      <option value={0}>Evening Attendance</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      Application Preference Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="9"
                      value={formData["Application order"]}
                      onChange={(e) => handleChange("Application order", parseInt(e.target.value) || 1)}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SubTab 2: Financial & Social */}
            {activeSubTab === 'financial' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg bg-[#f6f5f4] border border-black/8 space-y-1.5">
                    <label className="text-xs font-semibold text-[#111111] block">
                      Tuition Fees Up to Date
                    </label>
                    <select
                      value={formData["Tuition fees up to date"]}
                      onChange={(e) => handleChange("Tuition fees up to date", parseInt(e.target.value))}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    >
                      <option value={1}>Yes (Fees are paid)</option>
                      <option value={0}>No (Tuition is overdue)</option>
                    </select>
                    <span className="text-[10px] text-[#757575] block">Strongest retention indicator</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#f6f5f4] border border-black/8 space-y-1.5">
                    <label className="text-xs font-semibold text-[#111111] block">
                      Debtor Status
                    </label>
                    <select
                      value={formData["Debtor"]}
                      onChange={(e) => handleChange("Debtor", parseInt(e.target.value))}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    >
                      <option value={0}>No (No outstanding debt)</option>
                      <option value={1}>Yes (Debt recorded on account)</option>
                    </select>
                    <span className="text-[10px] text-[#757575] block">High correlation with attrition</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#f6f5f4] border border-black/8 space-y-1.5">
                    <label className="text-xs font-semibold text-[#111111] block">
                      Scholarship Holder
                    </label>
                    <select
                      value={formData["Scholarship holder"]}
                      onChange={(e) => handleChange("Scholarship holder", parseInt(e.target.value))}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    >
                      <option value={1}>Yes (Active scholarship)</option>
                      <option value={0}>No (No scholarship aid)</option>
                    </select>
                    <span className="text-[10px] text-[#757575] block">Protective retention factor</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#f6f5f4] border border-black/8 space-y-1.5">
                    <label className="text-xs font-semibold text-[#111111] block">
                      Displaced Student
                    </label>
                    <select
                      value={formData["Displaced"]}
                      onChange={(e) => handleChange("Displaced", parseInt(e.target.value))}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    >
                      <option value={1}>Yes (Relocated for study)</option>
                      <option value={0}>No (Commuting from home)</option>
                    </select>
                    <span className="text-[10px] text-[#757575] block">Living away from home</span>
                  </div>
                </div>
              </div>
            )}

            {/* SubTab 3: 1st Semester Performance */}
            {activeSubTab === 'sem1' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      1st Sem Enrolled Units
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={formData["Curricular units 1st sem (enrolled)"]}
                      onChange={(e) => handleChange("Curricular units 1st sem (enrolled)", parseInt(e.target.value) || 0)}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      1st Sem Approved Units ({formData["Curricular units 1st sem (approved)"]})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={formData["Curricular units 1st sem (enrolled)"] || 10}
                      value={formData["Curricular units 1st sem (approved)"]}
                      onChange={(e) => handleChange("Curricular units 1st sem (approved)", parseInt(e.target.value) || 0)}
                      className="w-full accent-[#0075de]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      1st Sem Average Grade (0 – 20)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={formData["Curricular units 1st sem (grade)"]}
                      onChange={(e) => handleChange("Curricular units 1st sem (grade)", parseFloat(e.target.value) || 0)}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      1st Sem Evaluations Conducted
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={formData["Curricular units 1st sem (evaluations)"]}
                      onChange={(e) => handleChange("Curricular units 1st sem (evaluations)", parseInt(e.target.value) || 0)}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SubTab 4: 2nd Semester Performance */}
            {activeSubTab === 'sem2' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      2nd Sem Enrolled Units
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={formData["Curricular units 2nd sem (enrolled)"]}
                      onChange={(e) => handleChange("Curricular units 2nd sem (enrolled)", parseInt(e.target.value) || 0)}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      2nd Sem Approved Units ({formData["Curricular units 2nd sem (approved)"]})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={formData["Curricular units 2nd sem (enrolled)"] || 10}
                      value={formData["Curricular units 2nd sem (approved)"]}
                      onChange={(e) => handleChange("Curricular units 2nd sem (approved)", parseInt(e.target.value) || 0)}
                      className="w-full accent-[#0075de]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      2nd Sem Average Grade (0 – 20)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={formData["Curricular units 2nd sem (grade)"]}
                      onChange={(e) => handleChange("Curricular units 2nd sem (grade)", parseFloat(e.target.value) || 0)}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1">
                      2nd Sem Evaluations Conducted
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={formData["Curricular units 2nd sem (evaluations)"]}
                      onChange={(e) => handleChange("Curricular units 2nd sem (evaluations)", parseInt(e.target.value) || 0)}
                      className="w-full notion-input px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Run Button Row */}
            <div className="pt-2 flex items-center justify-between border-t border-black/8">
              <button
                onClick={() => setFormData(DEFAULT_FEATURES)}
                className="btn-notion-secondary text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>

              <button
                onClick={() => handlePredict()}
                disabled={loading}
                className="btn-notion-primary"
              >
                {loading ? (
                  <>Evaluating...</>
                ) : (
                  <>
                    Run Outcome Prediction
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[#fdeeed] border border-[#f64932]/30 text-[#f64932] text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Prediction Results & What-If Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <div className="notion-card p-6 space-y-5">
              
              {/* Outcome Pill Display */}
              <div className="space-y-3 pb-4 border-b border-black/8 text-center">
                <span className="text-xs font-semibold text-[#757575] uppercase tracking-wider block">
                  Model Projected Outcome
                </span>

                <div 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-bold tracking-tight shadow-xs"
                  style={{
                    backgroundColor: result.prediction === 'Graduate' ? '#e6f3fe' :
                                     result.prediction === 'Dropout' ? '#fdeeed' : '#fff7e6',
                    color: result.prediction === 'Graduate' ? '#0075de' :
                           result.prediction === 'Dropout' ? '#f64932' : '#b87c00',
                    border: `1px solid ${result.prediction === 'Graduate' ? 'rgba(0,117,222,0.3)' :
                                         result.prediction === 'Dropout' ? 'rgba(246,73,50,0.3)' : 'rgba(255,177,16,0.3)'}`
                  }}
                >
                  {result.prediction === 'Graduate' && <CheckCircle className="w-4 h-4 text-[#0075de]" />}
                  {result.prediction === 'Dropout' && <ShieldAlert className="w-4 h-4 text-[#f64932]" />}
                  {result.prediction === 'Enrolled' && <AlertTriangle className="w-4 h-4 text-[#b87c00]" />}
                  <span>{result.prediction}</span>
                </div>

                <div className="text-xs text-[#615d59]">
                  Attrition Risk: <strong className="text-[#000000]">{result.risk_level} ({result.risk_score_percent}%)</strong>
                </div>
              </div>

              {/* Class Probability Gauges */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#111111]">
                  <span>Class Probability Distribution</span>
                  <span className="text-[11px] text-[#757575] font-normal">Scikit-learn Softmax</span>
                </div>

                <div className="space-y-2.5">
                  {/* Graduate Probability */}
                  <div>
                    <div className="flex justify-between text-xs text-[#111111] mb-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#0075de]" />
                        Graduate
                      </span>
                      <span className="font-mono font-semibold text-[#0075de]">
                        {((result.probabilities?.Graduate || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-[#f6f5f4] h-2 rounded-full overflow-hidden border border-black/6">
                      <div 
                        className="bg-[#0075de] h-full rounded-full transition-all duration-300" 
                        style={{ width: `${(result.probabilities?.Graduate || 0) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Dropout Probability */}
                  <div>
                    <div className="flex justify-between text-xs text-[#111111] mb-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#f64932]" />
                        Dropout
                      </span>
                      <span className="font-mono font-semibold text-[#f64932]">
                        {((result.probabilities?.Dropout || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-[#f6f5f4] h-2 rounded-full overflow-hidden border border-black/6">
                      <div 
                        className="bg-[#f64932] h-full rounded-full transition-all duration-300" 
                        style={{ width: `${(result.probabilities?.Dropout || 0) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Enrolled Probability */}
                  <div>
                    <div className="flex justify-between text-xs text-[#111111] mb-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#ffb110]" />
                        Enrolled
                      </span>
                      <span className="font-mono font-semibold text-[#b87c00]">
                        {((result.probabilities?.Enrolled || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-[#f6f5f4] h-2 rounded-full overflow-hidden border border-black/6">
                      <div 
                        className="bg-[#ffb110] h-full rounded-full transition-all duration-300" 
                        style={{ width: `${(result.probabilities?.Enrolled || 0) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-Time What-If Slider in Results */}
              <div className="p-4 rounded-lg bg-[#f6f5f4] border border-black/8 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#000000] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#0075de]" />
                    Instant What-If Slider
                  </span>
                  <span className="text-[11px] text-[#0075de] font-mono font-medium">
                    2nd Sem Approved
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={formData["Curricular units 2nd sem (enrolled)"] || 10}
                  value={formData["Curricular units 2nd sem (approved)"]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const updated = { 
                      ...formData, 
                      ["Curricular units 2nd sem (approved)"]: val,
                      ["Curricular units 2nd sem (grade)"]: val > 0 ? Math.max(formData["Curricular units 2nd sem (grade)"], 11.5) : 0
                    };
                    setFormData(updated);
                    handlePredict(updated);
                  }}
                  className="w-full accent-[#0075de]"
                />
                <div className="flex justify-between text-[11px] text-[#757575]">
                  <span>0 Units (High Attrition)</span>
                  <span className="text-[#000000] font-bold">{formData["Curricular units 2nd sem (approved)"]} Passed</span>
                  <span>{formData["Curricular units 2nd sem (enrolled)"]} Units (Full Pass)</span>
                </div>
              </div>

              {/* Action Plan */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#000000] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0075de]" />
                  Recommended Advising Interventions
                </span>
                <div className="space-y-1.5">
                  {result.actionable_interventions?.map((rec, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#f6f5f4] border border-black/6 text-xs text-[#615d59] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0075de] mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-[#757575] font-editorial italic text-center">
                "{result.disclaimer}"
              </p>
            </div>
          ) : (
            <div className="notion-card p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-[#757575] mx-auto" />
              <h3 className="text-sm font-semibold text-[#000000]">Ready for Simulation</h3>
              <p className="text-xs text-[#615d59]">
                Configure parameters and click "Run Outcome Prediction" to view real-time class probabilities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
