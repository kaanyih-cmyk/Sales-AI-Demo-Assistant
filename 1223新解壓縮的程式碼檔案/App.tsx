
import React, { useState } from 'react';
import { Industry, ReportData, SystexSolution } from './types';
import AutocompleteInput from './components/AutocompleteInput';
import ReportSection from './components/ReportSection';
import SolutionView from './components/SolutionView';
import { generateReport, generateSystexSolution, fetchCompanyBackground } from './services/geminiService';

const App: React.FC = () => {
  const [industry, setIndustry] = useState<string>(Industry.RETAIL);
  const [company, setCompany] = useState<string>('');
  const [extraInfo, setExtraInfo] = useState<string>('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [solution, setSolution] = useState<SystexSolution | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSolution, setLoadingSolution] = useState<boolean>(false);
  const [loadingBackground, setLoadingBackground] = useState<boolean>(false);

  // 當用戶從下拉選單選擇公司後觸發
  const handleCompanySelect = async (selectedName: string) => {
    setCompany(selectedName);
    setLoadingBackground(true);
    setExtraInfo('正在分析客戶背景...');
    try {
      const background = await fetchCompanyBackground(selectedName);
      // 確保字數不超過 50 字
      setExtraInfo(background.slice(0, 50));
    } catch (err) {
      console.error(err);
      setExtraInfo('無法取得背景，請手動輸入。');
    } finally {
      setLoadingBackground(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!company) return alert('請先輸入或選擇公司名稱');
    setLoading(true);
    setReport(null);
    setSolution(null);
    try {
      const data = await generateReport(company, industry, extraInfo);
      setReport(data);
    } catch (err) {
      console.error(err);
      alert('生成報告時發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSolution = async () => {
    if (!report) return;
    setLoadingSolution(true);
    try {
      const painPointsStr = report.painPoints.map(p => p.title).join(', ');
      const data = await generateSystexSolution(company, industry, painPointsStr);
      setSolution(data);
    } catch (err) {
      console.error(err);
      alert('生成解決方案失敗。');
    } finally {
      setLoadingSolution(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header Area */}
      <header className="py-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-6">
          <i className="fas fa-rocket text-white text-3xl"></i>
        </div>
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Sales AI Demo Assistant</h1>
        <p className="mt-3 text-lg text-slate-400 max-w-2xl">
          由精誠集團 AI 驅動，即時分析產業動察與對應解決方案。
        </p>
      </header>

      {/* Input Section */}
      <section className="glass-card p-6 md:p-10 rounded-3xl shadow-2xl border border-white/5 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">產業領域</label>
            <div className="relative">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white appearance-none cursor-pointer transition-all hover:bg-slate-800"
              >
                {Object.values(Industry).map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <i className="fas fa-chevron-down text-slate-500"></i>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">公司名稱關鍵字</label>
            <AutocompleteInput
              value={company}
              onChange={setCompany}
              onSelect={handleCompanySelect}
              placeholder="搜尋公司 (如：寶雅, 聯發科)"
            />
          </div>
        </div>

        <div className="space-y-3 mb-10">
          <div className="flex justify-between items-end">
            <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              補充資料 (AI 自動獲取)
              {loadingBackground && <i className="fas fa-circle-notch fa-spin text-indigo-400 text-xs"></i>}
            </label>
            <span className={`text-[10px] font-mono ${extraInfo.length > 45 ? 'text-amber-400' : 'text-slate-500'}`}>
              {extraInfo.length} / 50
            </span>
          </div>
          <textarea
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value.slice(0, 50))}
            placeholder="點選公司後，AI 將自動生成背景簡介..."
            className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-28 text-white placeholder-slate-600 resize-none transition-all hover:bg-slate-800"
          ></textarea>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loading || !company || loadingBackground}
          className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
            loading || !company || loadingBackground
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/30'
          }`}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>正在生成深度分析報告...</span>
            </>
          ) : (
            <>
              <i className="fas fa-magic"></i>
              <span>自然生成報告</span>
            </>
          )}
        </button>
      </section>

      {/* Analysis Results */}
      {report && (
        <div className="space-y-12 pb-12 border-b border-white/5">
          <ReportSection trends={report.trends} painPoints={report.painPoints} />

          {!solution && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="w-px h-12 bg-gradient-to-b from-indigo-500/50 to-transparent"></div>
              <button
                onClick={handleGenerateSolution}
                disabled={loadingSolution}
                className="group bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-12 py-5 rounded-full font-bold text-lg shadow-2xl shadow-indigo-500/20 flex items-center gap-4 transition-all hover:scale-105 active:scale-95"
              >
                {loadingSolution ? (
                  <>
                    <i className="fas fa-cog fa-spin"></i>
                    <span>媒合精誠解決方案中...</span>
                  </>
                ) : (
                  <>
                    <span>產出精誠推薦解決方案</span>
                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* SYSTEX Solution Display */}
      {solution && <SolutionView solution={solution} />}

      {/* Footer Info */}
      <footer className="mt-20 text-center text-slate-600 text-xs">
        <p>© 2024 SYSTEX Sales AI Demo. All Rights Reserved.</p>
        <p className="mt-1">Powered by Gemini 3 Pro with Google Search Grounding.</p>
      </footer>
    </div>
  );
};

export default App;
