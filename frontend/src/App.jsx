import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ExecutiveOverview from './components/ExecutiveOverview';
import PredictorForm from './components/PredictorForm';
import ThreeStudentUniverse from './components/ThreeStudentUniverse';
import ModelPerformance from './components/ModelPerformance';
import CohortBatchAuditor from './components/CohortBatchAuditor';
import { 
  GraduationCap, 
  ShieldCheck, 
  ExternalLink, 
  Database,
  BookOpen
} from 'lucide-react';

import { FALLBACK_METRICS, FALLBACK_SUMMARY } from './data/fallbackData';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [apiOnline, setApiOnline] = useState(false);
  const [metrics, setMetrics] = useState(FALLBACK_METRICS);
  const [summary, setSummary] = useState(FALLBACK_SUMMARY);

  useEffect(() => {
    checkHealth();
    fetchMetrics();
    fetchSummary();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setApiOnline(data.status === 'healthy' && data.model_loaded);
      } else {
        setApiOnline(false);
      }
    } catch {
      setApiOnline(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.warn("Using verified fallback metrics for Vercel static deployment.");
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/dataset/summary');
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.warn("Using verified fallback summary for Vercel static deployment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f4] text-[#000000] flex flex-col font-sans selection:bg-[#e6f3fe] selection:text-[#0075de]">
      {/* Top Fixed Nav */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        apiOnline={apiOnline} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ExecutiveOverview 
                metrics={metrics} 
                summary={summary} 
                onNavigateToPredictor={() => setActiveTab('predictor')}
              />
            </motion.div>
          )}

          {activeTab === 'predictor' && (
            <motion.div
              key="predictor"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <PredictorForm />
            </motion.div>
          )}

          {activeTab === 'universe' && (
            <motion.div
              key="universe"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6 py-4"
            >
              <ThreeStudentUniverse />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="notion-card p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0075de]">
                    <span className="w-2 h-2 rounded-full bg-[#0075de]" />
                    Graduate Density Zone (49.9%)
                  </div>
                  <p className="text-xs text-[#615d59]">
                    Stable curricular velocity, completed tuition commitments, and high prerequisite admission grades.
                  </p>
                </div>

                <div className="notion-card p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#b87c00]">
                    <span className="w-2 h-2 rounded-full bg-[#ffb110]" />
                    Enrolled Equilibrium Zone (18.0%)
                  </div>
                  <p className="text-xs text-[#615d59]">
                    Students persisting with partial course completion (2–4 units/term) requiring credit acceleration support.
                  </p>
                </div>

                <div className="notion-card p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#f64932]">
                    <span className="w-2 h-2 rounded-full bg-[#f64932]" />
                    Dropout Risk Well (32.1%)
                  </div>
                  <p className="text-xs text-[#615d59]">
                    High density of unpaid tuition liabilities, account debtor status, and zero approved units in 2nd semester.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'models' && (
            <motion.div
              key="models"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ModelPerformance metrics={metrics} />
            </motion.div>
          )}

          {activeTab === 'batch' && (
            <motion.div
              key="batch"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <CohortBatchAuditor />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Notion Minimal Footer */}
      <footer className="border-t border-black/8 py-8 mt-12 text-xs text-[#757575]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#0075de]" />
            <span className="font-semibold text-[#000000]">EduPredict AI</span>
            <span>— Notion-Inspired Decision Support System</span>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://archive.ics.uci.edu/dataset/697/predict+students+dropout+and+academic+success" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#615d59] hover:text-[#0075de] transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>UCI Dataset 697</span>
              <ExternalLink className="w-3 h-3 text-[#757575]" />
            </a>

            <div className="flex items-center gap-1.5 text-[#615d59]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0075de]" />
              <span>Decision Support Prototype</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
