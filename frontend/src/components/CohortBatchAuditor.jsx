import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Download, 
  Filter, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  Search
} from 'lucide-react';

export default function CohortBatchAuditor() {
  const [loading, setLoading] = useState(false);
  const [cohortData, setCohortData] = useState([]);
  const [batchResults, setBatchResults] = useState(null);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCohortSample(15);
  }, []);

  const fetchCohortSample = async (limit = 15) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dataset/sample?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch cohort sample");
      const data = await res.json();
      setCohortData(data.samples);
      runBatchAudit(data.samples);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runBatchAudit = async (students) => {
    setLoading(true);
    try {
      const res = await fetch('/api/batch-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students })
      });
      if (!res.ok) throw new Error("Batch audit failed");
      const results = await res.json();
      setBatchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = (batchResults?.results || []).filter(student => {
    if (riskFilter !== 'ALL' && student.risk_level !== riskFilter) return false;
    if (searchQuery && !`Student #${student.index}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    if (!batchResults?.results) return;
    const headers = ["Student_ID,Predicted_Outcome,Risk_Level,Dropout_Probability_Pct,Graduate_Probability_Pct\n"];
    const rows = batchResults.results.map(r => 
      `Student #${r.index},${r.prediction},${r.risk_level},${r.dropout_probability}%,${r.graduate_probability}%\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EduPredict_Cohort_Audit_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 py-4 animate-fadeIn">
      {/* Header & Controls */}
      <section className="notion-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#000000] tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0075de]" />
              Cohort Batch Risk Auditor
            </h2>
            <p className="text-xs text-[#615d59] mt-1">
              Screen an entire student class roster to identify high-risk students and dispatch targeted counseling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchCohortSample(25)}
              disabled={loading}
              className="btn-notion-secondary text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#0075de]" />
              Sample 25 UCI Students
            </button>

            <button
              onClick={exportCSV}
              disabled={!batchResults}
              className="btn-notion-primary"
            >
              <Download className="w-3.5 h-3.5" />
              Export Audit CSV
            </button>
          </div>
        </div>

        {/* Cohort Summary KPIs */}
        {batchResults && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-black/8">
            <div className="p-4 rounded-lg bg-[#f6f5f4] border border-black/8">
              <div className="text-[11px] text-[#757575] uppercase font-semibold">Total Audited</div>
              <div className="text-2xl font-bold text-[#000000] mt-1">{batchResults.total_analyzed}</div>
            </div>

            <div className="p-4 rounded-lg bg-[#fdeeed] border border-[#f64932]/20">
              <div className="text-[11px] text-[#f64932] uppercase font-semibold">High Attrition Risk</div>
              <div className="text-2xl font-bold text-[#f64932] mt-1">{batchResults.high_risk_students} Students</div>
            </div>

            <div className="p-4 rounded-lg bg-[#e6f3fe] border border-[#0075de]/20">
              <div className="text-[11px] text-[#0075de] uppercase font-semibold">Projected Graduates</div>
              <div className="text-2xl font-bold text-[#0075de] mt-1">
                {batchResults.cohort_breakdown?.Graduate || 0}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#fff7e6] border border-[#ffb110]/30">
              <div className="text-[11px] text-[#b87c00] uppercase font-semibold">Delayed / Enrolled</div>
              <div className="text-2xl font-bold text-[#b87c00] mt-1">
                {batchResults.cohort_breakdown?.Enrolled || 0}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Filter and Search Bar */}
      <section className="notion-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#757575] shrink-0" />
          <span className="text-xs text-[#757575] font-medium">Risk Filter:</span>
          <div className="flex gap-1">
            {['ALL', 'High', 'Moderate', 'Low'].map((level) => (
              <button
                key={level}
                onClick={() => setRiskFilter(level)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  riskFilter === level 
                    ? 'bg-[#000000] text-white font-semibold' 
                    : 'text-[#615d59] hover:bg-black/5'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#757575] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Student ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full notion-input pl-8 pr-3 py-1.5 text-xs"
          />
        </div>
      </section>

      {/* Cohort Table */}
      <section className="notion-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/8 text-[#757575]">
                <th className="py-3 px-4 font-semibold">Cohort Student</th>
                <th className="py-3 px-4 font-semibold">Predicted Outcome</th>
                <th className="py-3 px-4 font-semibold">Risk Classification</th>
                <th className="py-3 px-4 font-semibold">Dropout Probability</th>
                <th className="py-3 px-4 font-semibold">Graduation Probability</th>
                <th className="py-3 px-4 font-semibold">Advisor Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {filteredResults.map((s) => (
                <tr key={s.index} className="text-[#111111] hover:bg-black/2 transition-colors">
                  <td className="py-3 px-4 font-semibold">Student #{s.index}</td>
                  <td className="py-3 px-4">
                    <span className={`notion-pill text-[11px] font-semibold ${
                      s.prediction === 'Graduate' ? 'bg-[#e6f3fe] text-[#0075de]' :
                      s.prediction === 'Dropout' ? 'bg-[#fdeeed] text-[#f64932]' :
                      'bg-[#fff7e6] text-[#b87c00]'
                    }`}>
                      {s.prediction === 'Graduate' && <CheckCircle className="w-3 h-3" />}
                      {s.prediction === 'Dropout' && <ShieldAlert className="w-3 h-3" />}
                      {s.prediction === 'Enrolled' && <AlertTriangle className="w-3 h-3" />}
                      {s.prediction}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    <span className={
                      s.risk_level === 'High' ? 'text-[#f64932] font-semibold' :
                      s.risk_level === 'Moderate' ? 'text-[#b87c00] font-semibold' :
                      'text-[#0e7039]'
                    }>
                      {s.risk_level} Risk
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{s.dropout_probability}%</td>
                  <td className="py-3 px-4 font-mono">{s.graduate_probability}%</td>
                  <td className="py-3 px-4">
                    {s.risk_level === 'High' ? (
                      <span className="notion-pill bg-[#fdeeed] text-[#f64932] text-[11px] font-semibold">
                        Urgent Outreach
                      </span>
                    ) : s.risk_level === 'Moderate' ? (
                      <span className="notion-pill bg-[#fff7e6] text-[#b87c00] text-[11px] font-semibold">
                        Mid-Term Check
                      </span>
                    ) : (
                      <span className="text-[#757575] text-[11px]">Routine</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
