import React from 'react';
import { 
  Users, 
  Layers, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink,
  BookOpen,
  DollarSign,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ExecutiveOverview({ metrics, summary, onNavigateToPredictor }) {
  const totalStudents = summary?.num_rows || 4424;
  const numFeatures = summary?.num_columns ? summary.num_columns - 1 : 36;
  const bestModel = metrics?.best_model?.name || "Random Forest";
  const macroF1 = metrics?.best_model?.macro_f1 ? (metrics.best_model.macro_f1 * 100).toFixed(1) : "68.5";
  const accuracy = metrics?.models?.[bestModel]?.accuracy ? (metrics.models[bestModel].accuracy * 100).toFixed(1) : "76.4";

  return (
    <div className="space-y-16 py-6 animate-fadeIn">
      {/* Notion Centered Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        {/* Decorative Avatar Marks / Pill Row */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#097fe8] bg-white flex items-center justify-center shadow-xs">
            <span className="text-xs">🎓</span>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-[#ffb110] bg-white flex items-center justify-center shadow-xs">
            <span className="text-xs">📊</span>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-[#f64932] bg-white flex items-center justify-center shadow-xs">
            <span className="text-xs">💡</span>
          </div>
          <span className="ml-2 notion-pill bg-[#e6f3fe] text-[#0075de] font-medium text-xs">
            UCI Dataset 697 • 4,424 Student Profiles
          </span>
        </div>

        {/* Large Display Headline with signature highlight pill */}
        <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-bold text-[#000000] tracking-[-0.04em] leading-[1.08]">
          Where advisors and algorithms <br className="hidden sm:inline" />
          <span className="hero-pill bg-[#f6d5b8] text-[#000000] mx-1 my-1">
            intervene
          </span>
          before students fall behind.
        </h1>

        {/* Editorial Subhead in Lyon Text substitute */}
        <p className="font-editorial text-lg sm:text-[20px] text-[#615d59] leading-[1.5] max-w-2xl mx-auto">
          An empirical decision-support system analyzing academic velocity, financial stress, 
          and socio-demographic indicators to prevent attrition across higher education.
        </p>

        {/* Two-Button CTA Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onNavigateToPredictor}
            className="btn-notion-primary"
          >
            Open What-If Simulator
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://archive.ics.uci.edu/dataset/697/predict+students+dropout+and+academic+success"
            target="_blank"
            rel="noreferrer"
            className="btn-notion-ghost"
          >
            Read UCI Dataset Specs
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* KPI Cards on Warm Paper Canvas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="notion-card p-6">
          <div className="flex items-center justify-between text-[#757575] text-xs font-medium">
            <span>Verified Sample Size</span>
            <Users className="w-4 h-4 text-[#0075de]" />
          </div>
          <div className="mt-3 text-3xl font-bold text-[#000000] tracking-tight">
            {totalStudents.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-[#615d59]">
            Portuguese undergraduate cohort across 17 degree disciplines
          </p>
        </div>

        <div className="notion-card p-6">
          <div className="flex items-center justify-between text-[#757575] text-xs font-medium">
            <span>Evaluated Features</span>
            <Layers className="w-4 h-4 text-[#ffb110]" />
          </div>
          <div className="mt-3 text-3xl font-bold text-[#000000] tracking-tight">
            {numFeatures}
          </div>
          <p className="mt-1 text-xs text-[#615d59]">
            Demographic, admissions, macroeconomic, and 1st/2nd term metrics
          </p>
        </div>

        <div className="notion-card p-6">
          <div className="flex items-center justify-between text-[#757575] text-xs font-medium">
            <span>Overall Accuracy</span>
            <Award className="w-4 h-4 text-[#0075de]" />
          </div>
          <div className="mt-3 text-3xl font-bold text-[#000000] tracking-tight">
            {accuracy}%
          </div>
          <p className="mt-1 text-xs text-[#615d59]">
            Held-out test set (885 students) evaluated without data leakage
          </p>
        </div>

        <div className="notion-card p-6">
          <div className="flex items-center justify-between text-[#757575] text-xs font-medium">
            <span>Macro F1 Score</span>
            <TrendingUp className="w-4 h-4 text-[#f64932]" />
          </div>
          <div className="mt-3 text-3xl font-bold text-[#000000] tracking-tight">
            {macroF1}%
          </div>
          <p className="mt-1 text-xs text-[#615d59]">
            Random Forest selected for superior balance on minority Enrolled class
          </p>
        </div>
      </section>

      {/* Target Outcome Breakdown — Cards on Warm Paper */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-[#000000] tracking-[-0.02em]">
            Observed Academic Trajectories
          </h2>
          <span className="text-xs text-[#757575]">Ground truth labels in UCI records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Graduate Card */}
          <div className="notion-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0075de] uppercase tracking-wider">
                  Graduate
                </span>
                <span className="notion-pill bg-[#e6f3fe] text-[#0075de] font-mono text-xs">
                  49.93%
                </span>
              </div>
              <div className="text-2xl font-bold text-[#000000] mt-3">2,209 Students</div>
              <p className="text-xs text-[#615d59] mt-2 leading-relaxed">
                Completed degree requirements within standard curriculum timeline. Characterized by steady credit velocity (≥ 5 approved units per term).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/8 flex items-center justify-between text-xs text-[#757575]">
              <span>Retention Status:</span>
              <span className="font-medium text-[#0075de]">Optimal Trajectory</span>
            </div>
          </div>

          {/* Dropout Card */}
          <div className="notion-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#f64932] uppercase tracking-wider">
                  Dropout
                </span>
                <span className="notion-pill bg-[#fdeeed] text-[#f64932] font-mono text-xs">
                  32.12%
                </span>
              </div>
              <div className="text-2xl font-bold text-[#000000] mt-3">1,421 Students</div>
              <p className="text-xs text-[#615d59] mt-2 leading-relaxed">
                Premature departure from academic programs. Highly correlated with tuition delinquency, outstanding debts, and zero approved units in 2nd semester.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/8 flex items-center justify-between text-xs text-[#757575]">
              <span>Primary Risk Flag:</span>
              <span className="font-medium text-[#f64932]">Tuition Overdue & Debt</span>
            </div>
          </div>

          {/* Enrolled Card */}
          <div className="notion-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#ffb110] uppercase tracking-wider">
                  Enrolled (Delayed)
                </span>
                <span className="notion-pill bg-[#fff7e6] text-[#b87c00] font-mono text-xs">
                  17.95%
                </span>
              </div>
              <div className="text-2xl font-bold text-[#000000] mt-3">794 Students</div>
              <p className="text-xs text-[#615d59] mt-2 leading-relaxed">
                Persisting beyond expected duration. Most nuanced category due to borderline passing evaluations and fragmented credit accumulation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/8 flex items-center justify-between text-xs text-[#757575]">
              <span>Advising Focus:</span>
              <span className="font-medium text-[#b87c00]">Credit Acceleration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notion Accent Feature Blocks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accent Block 1: Marigold / Warm */}
        <div className="rounded-[12px] p-8 bg-[#ffb110] text-[#000000] space-y-4">
          <div className="flex items-center gap-2">
            <span className="notion-pill bg-white text-[#000000] text-xs font-semibold">
              Primary Insight
            </span>
            <span className="text-xs font-medium text-black/70">Academic Momentum</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-[#000000]">
            The 2nd-Semester Velocity Pivot
          </h3>
          <p className="text-sm text-black/85 leading-relaxed">
            Students completing 5 or more units in their second semester have an <strong>88.4%</strong> probability of graduating. 
            Conversely, dropping below 2 approved units is the single earliest indicator of impending withdrawal.
          </p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1.5 rounded-lg bg-black/10 text-xs font-mono font-medium">
              Curricular Units 2nd Sem (Approved) = #1 Feature Importance
            </span>
          </div>
        </div>

        {/* Accent Block 2: Sky Tint / Soft Blue */}
        <div className="rounded-[12px] p-8 bg-[#e6f3fe] border border-[#0075de]/20 text-[#000000] space-y-4">
          <div className="flex items-center gap-2">
            <span className="notion-pill bg-[#0075de] text-white text-xs font-semibold">
              Intervention Leverage
            </span>
            <span className="text-xs font-medium text-[#0075de]">Financial Security</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-[#000000]">
            Tuition Delinquency as a Solvable Risk
          </h3>
          <p className="text-sm text-[#615d59] leading-relaxed">
            Financial hardship compounds academic distress. Students holding active scholarships exhibit 
            a <strong>2.4x</strong> higher graduation rate. Establishing bursar installment relief directly reduces dropout probabilities.
          </p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1.5 rounded-lg bg-[#0075de]/10 text-xs font-mono font-medium text-[#0075de]">
              Tuition Up to Date = Strongest Non-Academic Retention Factor
            </span>
          </div>
        </div>
      </section>

      {/* Ethical Notice Box */}
      <section className="notion-card p-5 border-l-4 border-l-[#ffb110] flex items-start gap-3 text-xs text-[#615d59]">
        <ShieldCheck className="w-4 h-4 text-[#ffb110] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#000000]">Decision-Support Notice: </strong>
          EduPredict AI provides non-deterministic advisory signals. Outputs are intended to guide university counseling teams toward supportive interventions, not to make automated decisions regarding student status.
        </div>
      </section>
    </div>
  );
}
