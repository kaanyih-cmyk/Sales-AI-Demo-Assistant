"use client"; // 這是 Next.js 部署成功的關鍵，必須放在第一行

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ChevronRight, 
  BarChart3, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Loader2, 
  Building2, 
  Factory 
} from 'lucide-react';

/**
 * SalesAI Demo 完整修正版
 * 1. 修正 Vercel 部署所需的 "use client" 指令
 * 2. 修正下拉選單選取後不自動關閉的問題
 * 3. 修正選取公司後產業領域未連動的問題
 * 4. 優化 Next.js 環境相容性
 */

export default function App() {
  const [step, setStep] = useState('input'); 
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [memo, setMemo] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  
  // 記錄選取狀態，防止選單重複彈出
  const isSelectionMade = useRef(false);

  // 模擬公司與產業對應資料庫
  const companyDb = [
    { name: "寶雅", industry: "百貨零售業" },
    { name: "寶島眼鏡", industry: "醫療器材零售業" },
    { name: "寶成工業", industry: "鞋業製造業" },
    { name: "寶齡爵諾", industry: "生技製藥業" },
    { name: "寶元實業", industry: "土地開發與建築業" },
    { name: "仁寶電腦", industry: "電腦及週邊設備業" }
  ];

  // 搜尋建議邏輯
  useEffect(() => {
    if (isSelectionMade.current) {
      isSelectionMade.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (companyName.length >= 1 && step === 'input') {
        const filtered = companyDb.filter(item => item.name.includes(companyName));
        
        // 若輸入內容與建議項完全符合，則隱藏選單
        if (filtered.length === 1 && filtered[0].name === companyName) {
            setSuggestions([]);
        } else {
            setSuggestions(filtered);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [companyName, step]);

  // 處理選取：同時更新名稱與產業
  const selectCompany = (item) => {
    isSelectionMade.current = true;
    setCompanyName(item.name);
    setIndustry(item.industry); 
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
    if (!companyName) return;
    setLoading(true);
    setTimeout(() => {
      setReportData({
        trends: "目前的零售與科技產業環境正受到生成式 AI 與大數據的深刻影響。企業積極追求 OMO 虛實整合，利用數據中台進行精準行銷，以因應消費習慣的快速變遷。數位轉型已從「選擇」變為企業生存的「必需品」。",
        painPoints: "現有的營運流程中，資訊孤島現象嚴重，導致決策時效性不足。客戶資料分散在各個子系統中，無法建立完整的 360 度視圖，進而影響了行銷的投資報酬率 (ROI) 與客戶忠誠度的維護。"
      });
      setStep('report');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans p-4 md:p-10 flex justify-center">
      <div className="w-full max-w-3xl">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tighter text-white mb-3 italic">
            Sales<span className="text-blue-500">AI</span>
          </h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto mb-4 rounded-full"></div>
          <p className="text-slate-400 font-medium tracking-wide">SYSTEX 智慧提案 Demo 系統</p>
        </div>

        {/* Input Phase */}
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
                      isSelectionMade.current = false;
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
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-[10px] bg-slate-900/50 px-2 py-1 rounded text-slate-400 font-bold border border-slate-700">{item.industry}</span>
                          </div>
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
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 block">補充資料 (50字以內)</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value.slice(0, 50))}
                placeholder="輸入更多細節輔助分析..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 px-6 h-32 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none shadow-xl"
              />
              <div className="text-right text-[10px] font-bold text-slate-600 mt-2 tracking-widest uppercase">{memo.length} / 50</div>
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

        {/* Report Phase */}
        {step === 'report' && reportData && (
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-slate-900/50 rounded-[2rem] border border-slate-800/50 overflow-hidden shadow-2xl">
              <div className="bg-[#0ea5e9] px-8 py-4 flex items-center gap-3 shadow-lg">
                <BarChart3 size={20} className="text-white" />
                <h2 className="text-lg font-black text-white tracking-wider">產業趨勢</h2>
              </div>
              <div className="p-8">
                <p className="text-slate-300 leading-relaxed text-lg font-medium">{reportData.trends}</p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-[2rem] border border-slate-800/50 overflow-hidden shadow-2xl">
              <div className="bg-[#f59e0b] px-8 py-4 flex items-center gap-3 shadow-lg">
                <AlertCircle size={20} className="text-white" />
                <h2 className="text-lg font-black text-white tracking-wider">客戶痛點分析</h2>
              </div>
              <div className="p-8">
                <p className="text-slate-300 leading-relaxed text-lg font-medium">{reportData.painPoints}</p>
              </div>
            </div>

            <button
              onClick={() => setStep('solution')}
              className="w-full bg-white text-[#0f172a] font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all"
            >
              產出精誠推薦解決方案 <ChevronRight size={22} className="text-blue-600" />
            </button>
          </div>
        )}

        {/* Solution Phase */}
        {step === 'solution' && (
          <div className="animate-in zoom-in-95 duration-500 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-900 px-10 py-12">
            <div className="flex justify-between items-center mb-10 border-b-2 border-slate-50 pb-6">
              <div>
                <h2 className="text-3xl font-black text-[#1e3a8a] tracking-tight mb-2">精誠推薦解決方案</h2>
                <div className="h-1.5 w-12 bg-blue-600 rounded-full"></div>
              </div>
              <div className="hidden sm:block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border border-blue-100">
                SYSTEX Strategy
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
}
