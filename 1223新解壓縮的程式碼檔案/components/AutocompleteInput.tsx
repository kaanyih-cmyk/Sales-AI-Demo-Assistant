import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, BarChart3, AlertCircle, CheckCircle2, Send, Loader2, Building2, Factory } from 'lucide-react';

// --- 這裡是主要的 Demo 網頁程式碼 ---
const apiKey = ""; 

const App = () => {
  const [step, setStep] = useState('input'); 
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [memo, setMemo] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  
  // 使用 useRef 來記錄是否剛完成選取動作，避免重複觸發下拉選單
  const isSelectionMade = useRef(false);

  // 模擬搜尋建議功能
  useEffect(() => {
    // 如果剛選取完，則不執行搜尋建議
    if (isSelectionMade.current) {
      isSelectionMade.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (companyName.length >= 1 && step === 'input') {
        const mockSuggestions = ["寶雅", "寶島眼鏡", "寶成工業", "寶齡爵諾", "寶元實業", "仁寶電腦"].filter(s => s.includes(companyName));
        // 如果輸入的內容完全等於其中一個選項，且目前沒顯示選單，就不再顯示（代表已選取）
        if (mockSuggestions.length === 1 && mockSuggestions[0] === companyName) {
            setSuggestions([]);
        } else {
            setSuggestions(mockSuggestions);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [companyName, step]);

  const selectCompany = (name) => {
    isSelectionMade.current = true;
    setCompanyName(name);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      selectCompany(suggestions[selectedIndex]);
    }
  };

  const generateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setReportData({
        trends: "目前零售與科技產業正迎來 AI 驅動的轉型浪潮，企業紛紛投入 OMO (線上線下整合) 以及數據中台的建設。隨著生成式 AI 普及，如何利用數據精準預測消費行為並提供個性化服務，已成為維持競爭力的核心關鍵。",
        painPoints: "現有系統架構老舊，導致線上與實體店鋪的數據無法即時同步，造成會員體驗斷層。此外，行銷人員缺乏自動化工具來處理巨量數據，導致無法針對不同客群進行精準投遞，進而造成轉換率持續低迷。"
      });
      setStep('report');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans p-4 md:p-10 flex justify-center">
      <div className="w-full max-w-3xl">
        
        {/* 標題區 */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tighter text-white mb-3 italic">
            Sales<span className="text-blue-500">AI</span>
          </h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto mb-4 rounded-full"></div>
          <p className="text-slate-400 font-medium">SYSTEX 智慧提案 Demo 系統</p>
        </div>

        {/* 第一階段：輸入畫面 */}
        {step === 'input' && (
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="relative">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 block">公司名稱</label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => {
                      isSelectionMade.current = false; // 使用者手動輸入時，重置選取狀態
                      setCompanyName(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="搜尋公司，例如：寶"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-xl"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-20 w-full bg-slate-800 border border-slate-700 mt-2 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1">
                      {suggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectCompany(item)}
                          className={`px-6 py-4 cursor-pointer transition-colors ${selectedIndex === idx ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 block">產業領域</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="例如：連鎖零售"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-xl"
                />
              </div>
            </div>

            <div className="mb-10">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 block">補充資料 (50字內)</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value.slice(0, 50))}
                placeholder="輸入更多細節..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 px-6 h-32 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none shadow-xl"
              />
              <div className="text-right text-[10px] font-bold text-slate-600 mt-2 tracking-widest">{memo.length} / 50</div>
            </div>

            <button
              onClick={generateReport}
              disabled={loading || !companyName}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-30"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              自然生成報告
            </button>
          </div>
        )}

        {/* 第二階段：報告畫面 (比照截圖配色) */}
        {step === 'report' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-slate-900/50 rounded-[2rem] border border-slate-800/50 overflow-hidden shadow-2xl">
              <div className="bg-[#0ea5e9] px-8 py-4 flex items-center gap-3">
                <BarChart3 size={20} className="text-white" />
                <h2 className="text-lg font-black text-white tracking-wider">產業趨勢</h2>
              </div>
              <div className="p-8">
                <p className="text-slate-300 leading-relaxed text-lg font-medium">
                  {reportData.trends}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-[2rem] border border-slate-800/50 overflow-hidden shadow-2xl">
              <div className="bg-[#f59e0b] px-8 py-4 flex items-center gap-3">
                <AlertCircle size={20} className="text-white" />
                <h2 className="text-lg font-black text-white tracking-wider">客戶痛點分析</h2>
              </div>
              <div className="p-8">
                <p className="text-slate-300 leading-relaxed text-lg font-medium">
                  {reportData.painPoints}
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('solution')}
              className="w-full bg-white text-[#0f172a] font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
            >
              產出精誠推薦解決方案 <ChevronRight size={22} className="text-blue-600" />
            </button>
          </div>
        )}

        {/* 第三階段：解決方案 (截圖 4 白底卡片) */}
        {step === 'solution' && (
          <div className="animate-in zoom-in-95 duration-500 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-900 px-10 py-12">
            <div className="flex justify-between items-center mb-10 border-b-2 border-slate-50 pb-6">
                <div>
                    <h2 className="text-3xl font-black text-[#1e3a8a] tracking-tight mb-2">精誠推薦解決方案</h2>
                    <div className="h-1.5 w-12 bg-blue-600 rounded-full"></div>
                </div>
            </div>
            
            <div className="space-y-6">
              {[
                { t: "全通路零售數據中台", d: "整合線上與線下數據，建立 360 度會員畫像。" },
                { t: "AI 智慧自動化客服系統", d: "導入 LLM 技術自動處理常見諮詢。" },
                { t: "雲端安全防護架構", d: "提供端到端的資安監控，確保個資安全。" },
                { t: "ESG 智慧能源管理", d: "透過物聯網監測門市能耗。" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-6 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
                  <div className="bg-blue-600 text-white p-2 rounded-xl self-start group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800">{item.t}</h4>
                    <p className="text-slate-500 mt-2 font-medium">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setStep('input')} 
              className="mt-12 w-full text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors tracking-widest uppercase"
            >
              ← 返回重新生成
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
