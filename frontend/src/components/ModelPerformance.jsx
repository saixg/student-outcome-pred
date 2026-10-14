import React, { useState } from 'react';
import { 
  Cpu, 
  Award, 
  BarChart2, 
  CheckCircle2, 
  Table as TableIcon
} from 'lucide-react';

export default function ModelPerformance({ metrics }) {
  const [selectedModel, setSelectedModel] = useState("Random Forest");

  const modelsData = metrics?.models || {
    "Logistic Regression": {
      accuracy: 0.7684,
      macro_f1: 0.6826,
      weighted_f1: 0.7531,
      macro_precision: 0.7070,
      macro_recall: 0.6754,
      per_class: {
        "Dropout": { precision: 0.7927, recall: 0.7676, "f1-score": 0.7800, support: 284 },
        "Enrolled": { precision: 0.5248, recall: 0.3333, "f1-score": 0.4077, support: 159 },
        "Graduate": { precision: 0.8035, recall: 0.9253, "f1-score": 0.8601, support: 442 }
      },
      confusion_matrix: [[218, 29, 37], [43, 53, 63], [14, 19, 409]]
    },
    "Decision Tree": {
      accuracy: 0.7322,
      macro_f1: 0.6530,
      weighted_f1: 0.7207,
      macro_precision: 0.6706,
      macro_recall: 0.6453,
      per_class: {
        "Dropout": { precision: 0.7610, recall: 0.6725, "f1-score": 0.7140, support: 284 },
        "Enrolled": { precision: 0.4711, recall: 0.3585, "f1-score": 0.4071, support: 159 },
        "Graduate": { precision: 0.7797, recall: 0.9050, "f1-score": 0.8377, support: 442 }
      },
      confusion_matrix: [[191, 43, 50], [39, 57, 63], [21, 21, 400]]
    },
    "Random Forest": {
      accuracy: 0.7638,
      macro_f1: 0.6847,
      weighted_f1: 0.7493,
      macro_precision: 0.7150,
      macro_recall: 0.6743,
      per_class: {
        "Dropout": { precision: 0.8008, recall: 0.7500, "f1-score": 0.7745, support: 284 },
        "Enrolled": { precision: 0.5600, recall: 0.3522, "f1-score": 0.4324, support: 159 },
        "Graduate": { precision: 0.7842, recall: 0.9208, "f1-score": 0.8470, support: 442 }
      },
      confusion_matrix: [[213, 22, 49], [40, 56, 63], [13, 22, 407]]
    }
  };

  const currentStats = modelsData[selectedModel] || modelsData["Random Forest"];
  const classes = ["Dropout", "Enrolled", "Graduate"];

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      {/* Header */}
      <section className="notion-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#000000] tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#0075de]" />
              Model Performance Benchmarks
            </h2>
            <p className="text-xs text-[#615d59] mt-1">
              Empirical evaluation on held-out test data (885 students) comparing candidate architectures on identical stratified splits.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e6f3fe] text-[#0075de] text-xs font-semibold">
            <Award className="w-4 h-4" />
            Selected Pipeline: Random Forest (Macro F1 = 68.47%)
          </div>
        </div>
      </section>

      {/* Model Comparison Table */}
      <section className="notion-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#000000] flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-[#0075de]" />
            Classifier Performance Comparison
          </h3>
          <span className="text-xs text-[#757575]">885 instances, stratified 80/20 holdout</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/8 text-[#757575]">
                <th className="py-3 px-4 font-semibold">Model</th>
                <th className="py-3 px-4 font-semibold">Accuracy</th>
                <th className="py-3 px-4 font-semibold text-[#0075de]">Macro F1 (Key)</th>
                <th className="py-3 px-4 font-semibold">Weighted F1</th>
                <th className="py-3 px-4 font-semibold">Macro Precision</th>
                <th className="py-3 px-4 font-semibold">Macro Recall</th>
                <th className="py-3 px-4 font-semibold">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {Object.keys(modelsData).map((modelName) => {
                const m = modelsData[modelName];
                const isSelected = selectedModel === modelName;
                const isBest = modelName === "Random Forest";

                return (
                  <tr 
                    key={modelName} 
                    className={`transition-colors ${isSelected ? 'bg-[#e6f3fe]/40' : 'hover:bg-black/2'}`}
                  >
                    <td className="py-3.5 px-4 font-semibold flex items-center gap-2 text-[#000000]">
                      <span>{modelName}</span>
                      {isBest && (
                        <span className="notion-pill bg-[#e6f3fe] text-[#0075de] text-[10px] font-bold">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{(m.accuracy * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0075de]">
                      {(m.macro_f1 * 100).toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-4 font-mono">{(m.weighted_f1 * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-4 font-mono">{(m.macro_precision * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-4 font-mono">{(m.macro_recall * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedModel(modelName)}
                        className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#0075de] text-white' 
                            : 'bg-black/6 text-[#000000] hover:bg-black/10'
                        }`}
                      >
                        {isSelected ? 'Viewing' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Per-Class Breakdown & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Per Class Breakdown (6 cols) */}
        <div className="lg:col-span-6 notion-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#000000] flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#0075de]" />
              Per-Class Breakdown ({selectedModel})
            </h3>
            <span className="text-xs text-[#757575] font-mono">Support: 885</span>
          </div>

          <div className="space-y-3">
            {classes.map((cls) => {
              const classStats = currentStats.per_class?.[cls] || { precision: 0, recall: 0, 'f1-score': 0, support: 0 };
              const badgeColor = cls === 'Graduate' ? 'text-[#0075de] bg-[#e6f3fe]' :
                                 cls === 'Dropout' ? 'text-[#f64932] bg-[#fdeeed]' :
                                 'text-[#b87c00] bg-[#fff7e6]';

              return (
                <div key={cls} className="p-4 rounded-lg bg-[#f6f5f4] border border-black/8 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`notion-pill text-xs font-semibold ${badgeColor}`}>
                      {cls}
                    </span>
                    <span className="text-xs text-[#757575] font-mono">
                      {classStats.support} test students
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2 rounded-md bg-white border border-black/6">
                      <div className="text-[10px] text-[#757575] uppercase">Precision</div>
                      <div className="text-xs font-bold font-mono text-[#000000] mt-0.5">
                        {(classStats.precision * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="p-2 rounded-md bg-white border border-black/6">
                      <div className="text-[10px] text-[#757575] uppercase">Recall</div>
                      <div className="text-xs font-bold font-mono text-[#000000] mt-0.5">
                        {(classStats.recall * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="p-2 rounded-md bg-white border border-black/6">
                      <div className="text-[10px] text-[#757575] uppercase">F1-Score</div>
                      <div className="text-xs font-bold font-mono text-[#0075de] mt-0.5">
                        {(classStats['f1-score'] * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confusion Matrix (6 cols) */}
        <div className="lg:col-span-6 notion-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#000000]">Confusion Matrix ({selectedModel})</h3>
            <p className="text-xs text-[#615d59] mt-0.5">Rows: True Ground-Truth Label | Columns: Predicted Outcome</p>
          </div>

          <div className="p-4 rounded-lg bg-[#f6f5f4] border border-black/8 space-y-3">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold text-[#757575] pb-2 border-b border-black/8">
              <span className="text-left text-[#615d59]">True \ Pred</span>
              <span className="text-[#f64932]">Dropout</span>
              <span className="text-[#b87c00]">Enrolled</span>
              <span className="text-[#0075de]">Graduate</span>
            </div>

            {classes.map((trueLabel, rIdx) => (
              <div key={trueLabel} className="grid grid-cols-4 gap-2 items-center text-xs">
                <span className="font-semibold text-[#000000] text-left truncate">{trueLabel}</span>
                {classes.map((predLabel, cIdx) => {
                  const val = currentStats.confusion_matrix?.[rIdx]?.[cIdx] || 0;
                  const isDiagonal = rIdx === cIdx;
                  return (
                    <div 
                      key={predLabel} 
                      className={`p-3 rounded-md text-center font-mono font-bold transition-all ${
                        isDiagonal 
                          ? 'bg-[#e6f3fe] border border-[#0075de]/30 text-[#0075de]' 
                          : val > 20 
                          ? 'bg-[#fdeeed] border border-[#f64932]/20 text-[#f64932]' 
                          : 'bg-white border border-black/8 text-[#615d59]'
                      }`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-lg bg-[#f6f5f4] border border-black/8 text-xs text-[#615d59] space-y-1">
            <span className="font-semibold text-[#000000] block">Rationale for Model Selection:</span>
            <p className="leading-relaxed">
              Random Forest achieves a Macro F1 of <strong>68.47%</strong> (vs. 68.26% for Logistic Regression). 
              Crucially, it demonstrates higher sensitivity and precision on the challenging minority <strong>Enrolled</strong> class (56.0% precision vs 52.5%) 
              and higher precision on <strong>Dropout</strong> identification (80.1% vs 79.3%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
