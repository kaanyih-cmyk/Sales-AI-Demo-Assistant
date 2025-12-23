
import React from 'react';
import { SystexSolution } from '../types';

interface SolutionViewProps {
  solution: SystexSolution;
}

const SolutionView: React.FC<SolutionViewProps> = ({ solution }) => {
  return (
    <div className="mt-12 animate-in zoom-in-95 duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-500/20 p-2 rounded-lg">
          <i className="fas fa-bolt text-indigo-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold">精誠推薦解決方案</h2>
          <p className="text-xs text-slate-500 mt-0.5">依據客戶痛點，自動比對精誠集團既有解決方案供業務提案參考。</p>
        </div>
      </div>

      <div className="gradient-border glass-card p-1 rounded-xl">
        <div className="bg-[#0f172a] rounded-xl p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-4 mb-8">
             <div className="bg-indigo-900/40 border border-indigo-700/50 px-4 py-1.5 rounded-full flex items-center gap-2">
                <i className="fas fa-building-columns text-indigo-300 text-sm"></i>
                <span className="text-indigo-200 text-sm font-medium">{solution.department}</span>
             </div>
             <div className="bg-red-900/20 border border-red-700/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                <i className="fas fa-check-circle text-red-400 text-sm"></i>
                <span className="text-red-200 text-sm font-medium">{solution.targetPainPoint}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                {solution.title}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                {solution.description}
              </p>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
               <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                     <i className="far fa-lightbulb text-indigo-400 text-xl"></i>
                     <h4 className="text-lg font-bold text-white">推薦理由</h4>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {solution.reason}
                  </p>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-3xl rounded-full"></div>
               </div>

               <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                     <i className="fas fa-bolt text-amber-400 text-xl"></i>
                     <h4 className="text-lg font-bold text-white">業務話術</h4>
                  </div>
                  <p className="text-slate-300 italic leading-relaxed">
                    {solution.salesPitch}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionView;
