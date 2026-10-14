import React from 'react';
import { 
  GraduationCap, 
  BarChart3, 
  Sparkles, 
  Cpu, 
  Users, 
  Orbit
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, apiOnline }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'predictor', label: 'Simulator', icon: Sparkles },
    { id: 'universe', label: '3D Space', icon: Orbit },
    { id: 'models', label: 'Benchmarks', icon: Cpu },
    { id: 'batch', label: 'Cohort Audit', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full notion-nav">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ffffff] border border-black/10 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4 text-[#0075de]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-semibold text-[#000000] tracking-tight">
                EduPredict AI
              </span>
              <span className="notion-pill bg-[#e6f3fe] text-[#0075de] text-[11px] font-medium">
                Decision Support
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#ffffff] text-[#000000] shadow-xs border border-black/8 font-semibold'
                      : 'text-[#000000]/60 hover:text-[#000000] hover:bg-black/4'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0075de]' : 'text-[#757575]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Status */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
              apiOnline 
                ? 'bg-[#e7f7ed] text-[#0e7039] border border-[#0e7039]/20' 
                : 'bg-[#fdeeed] text-[#c5281b] border border-[#c5281b]/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${apiOnline ? 'bg-[#0e7039]' : 'bg-[#c5281b]'}`} />
              <span>{apiOnline ? 'Pipeline Active' : 'API Offline'}</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#757575]">
              <span>Model:</span>
              <span className="text-[#000000] font-medium">Random Forest</span>
              <span className="text-[#0075de] font-mono font-medium">(Macro F1: 68.5%)</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-black/8 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isActive ? 'text-[#0075de] font-semibold' : 'text-[#000000]/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
