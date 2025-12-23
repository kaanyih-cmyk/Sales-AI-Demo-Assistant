import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronRight, BarChart3, AlertCircle, Lightbulb, CheckCircle2, Send, Loader2 } from 'lucide-react';

// --- 模擬 API 與 輔助功能 ---
const apiKey = ""; // 實際執行時環境會提供

const App = () => {
  const [step, setStep] = useState('home'); // 'home' | 'searching' | 'report' | 'solution'
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [memo, setMemo] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // 模擬公司搜尋建議
  const handleCompanyChange = async (val) => {
    setCompanyName(val);
    if (val.length > 0) {
      // 這裡模擬從 API 抓取數據，實際可用 Gemini Search 工具
      const mockData = ["寶雅", "寶島眼鏡", "寶成工業", "寶齡爵諾", "寶滬深"].filter(item => item.includes(val));
      setSuggestions(mockData);
    } else {
      setSuggestions([]);
    }
  };

  // 鍵盤導航
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      selectCompany(suggestions[selectedIndex]);
    }
  };

  const selectCompany = (name) => {
    setCompanyName(name);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const generateReport = async () => {
    setLoading(true);
    // 模擬 AI 生成過程
    setTimeout(() => {
      setReportData({
        trends: {
          title: "2024 產業轉型趨勢",
          content: `${companyName} 所屬的 ${industry} 領域目前正處於數位轉型關鍵期。隨著消費行為全面線上化，數據驅動的精準行銷已成為標配。企業正積極導入 AI 預測模型以優化庫存管理並提升客戶生命週期價值，預計未來三年內自動化流程將佔據 40% 的運營重心。`
        },
        painPoints: {
          title: "核心客戶痛點分析",
          content: "目前的關鍵挑戰在於線上與線下數據無法有效整合，導致無法描繪精確的客戶輪廓。此外，現有系統反應速度緩慢，無法應對高併發的節慶流量。客戶對於個人化體驗的期待提升，傳統的統一推播模式已導致轉換率持續下滑，亟需一套高彈性的中台系統來支撐多變的業務需求。"
        }
      });
      setStep('report');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 flex flex-col items-center">
      {/* 標題欄 */}
      <div className="w-full max-w-4xl mb-12 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          SalesAI 智慧提案助手
        </h1>
        <p className="text-slate-400 mt-2 text-sm">根據您的企業需求，自然生成深度產業洞察與精誠專屬解決方案</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        
        {/* Step 1: 輸入區域 */}
        {step === 'home' && (
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-400 mb-2">公司名稱</label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyName}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    placeholder="輸入關鍵字，例如：寶"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-slate-800 border border-slate-700 mt-1 rounded-lg shadow-2xl overflow-hidden">
                      {suggestions.map((item, idx) => (
                        <li
                          key={item}
                          onClick={() => selectCompany(item)}
                          className={`px-4 py-2 cursor-pointer hover:bg-blue-600 transition-colors ${selectedIndex === idx ? 'bg-blue-600' : ''}`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">產業領域</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="例如：連鎖零售、電子製造"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-400 mb-2">補充資料 (50字以內)</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value.slice(0, 50))}
                placeholder="輸入更多細節輔助 AI 生成..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              />
              <p className="text-right text-xs text-slate-500 mt-1">{memo.length}/50</p>
            </div>

            <button
              onClick={generateReport}
              disabled={loading || !companyName}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              自然生成分析報告
            </button>
          </div>
        )}

        {/* Step 2: 報告畫面 (產業趨勢 + 客戶痛點) */}
        {step === 'report' && reportData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 產業趨勢 */}
            <div className="bg-slate-900 border-l-4 border-blue-500 p-8 rounded-r-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="text-blue-400" />
                <h2 className="text-xl font-bold text-white">{reportData.trends.title}</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                {reportData.trends.content}
              </p>
            </div>

            {/* 客戶痛點 */}
            <div className="bg-slate-900 border-l-4 border-emerald-500 p-8 rounded-r-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-emerald-400" />
                <h2 className="text-xl font-bold text-white">{reportData.painPoints.title}</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                {reportData.painPoints.content}
              </p>
            </div>

            <button
              onClick={() => setStep('solution')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Lightbulb size={18} />
              產出 精誠推薦解決方案
            </button>
          </div>
        )}

        {/* Step 3: 精誠解決方案 (對比第四張截圖) */}
        {step === 'solution' && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-black text-blue-900 tracking-tight">精誠推薦解決方案</h2>
                <div className="px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
                  Custom Strategy
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: "全通路零售整合平台 (Omni-Channel)", desc: "串接 POS 與 E-commerce 數據，實現 360 度會員視野。" },
                  { title: "AI 客戶分群分析引擎", desc: "運用機器學習自動分類高價值客戶，提升廣告精準度。" },
                  { title: "雲端彈性架構優化服務", desc: "基於微服務架構，確保節慶大促期間系統穩定運行。" },
                  { title: "數位人才轉型工作坊", desc: "不僅提供工具，更協助團隊建立數據導向的決策文化。" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors group">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 className="text-blue-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep('home')}
                className="mt-10 w-full text-slate-400 hover:text-blue-600 text-sm font-medium flex items-center justify-center gap-1 transition-colors"
              >
                返回重新分析
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-20 text-slate-600 text-xs text-center border-t border-slate-900 pt-8 w-full">
        Powered by Vibe Coding & SYSTEX AI Team
      </footer>
    </div>
  );
};

export default App;
