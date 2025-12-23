
import React from 'react';
import { TrendItem, PainPointItem } from '../types';

interface ReportSectionProps {
  trends: TrendItem[];
  painPoints: PainPointItem[];
}

const ReportSection: React.FC<ReportSectionProps> = ({ trends, painPoints }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Industry Trends */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <i className="fas fa-chart-line text-emerald-400"></i>
          </div>
          <h2 className="text-xl font-bold">產業趨勢</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {trends.map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-xl border-l-4 border-l-emerald-500 hover:translate-x-1 transition-transform">
              <h3 className="text-lg font-bold mb-3 text-slate-100">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Pain Points */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-500/10 p-2 rounded-lg">
            <i className="fas fa-exclamation-triangle text-amber-400"></i>
          </div>
          <h2 className="text-xl font-bold">客戶痛點</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {painPoints.map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-xl border-l-4 border-l-amber-500 hover:translate-x-1 transition-transform">
              <h3 className="text-lg font-bold mb-3 text-slate-100">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportSection;
