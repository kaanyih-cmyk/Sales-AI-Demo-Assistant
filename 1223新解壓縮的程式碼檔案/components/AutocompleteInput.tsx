"use client";

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
 * SalesAI Demo - 整合部署優化版
 * 功能重點：
 * 1. 支援 Next.js/Vercel 部署 (use client)
 * 2. 公司選取後自動帶入產業領域
 * 3. 修正下拉選單重複顯示邏輯
 * 4. 完美復刻截圖 UI 配色
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
  
  // 核心控制：標記是否剛完成選取動作
  const isSelectionMade = useRef(false);

  // 模擬公司資料庫：包含正確的產業對應
  const companyDb = [
    { name: "寶雅", industry: "百貨零售業" },
    { name: "寶島眼鏡", industry: "醫療器材零售業" },
    { name: "寶成工業", industry: "鞋業製造業" },
    { name: "寶齡爵諾", industry: "生技製藥業" },
    { name: "寶元實業", industry: "土地開發與建築業" },
    { name: "仁寶電腦", industry: "電腦及週邊設備業" },
    { name: "精誠資訊", industry: "資訊軟體服務業" }
  ];

  // 下拉建議搜尋邏輯
  useEffect(() => {
    // 如果剛完成選取，不執行搜尋建議並重置狀態
    if (isSelectionMade.current) {
      isSelectionMade.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (companyName.length >= 1 && step === 'input') {
        const filtered = companyDb.filter(item => item.name.includes(companyName));
        
        // 若輸入內容與建議項完全符合，則隱藏選單，避免選完後選單還在那裡
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

  // 選取公司：同時更新名稱與產業領域
  const selectCompany = (item) => {
    isSelectionMade.current = true;
    setCompanyName(item.name);
    setIndustry(item.industry); // 自動填入正確產業
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
    // 模擬 AI 分析與生成過程
    setTimeout(() => {
      setReportData({
        trends: `目前 ${industry} 領域正處於數位轉型關鍵期。隨著消費行為全面線上化，數據驅動的精準行銷已成為標配。企業正積極導入 AI 預測模型以優化庫存管理並提升客戶生命週期價值，預計未來三年內自動化流程將佔據 40% 的運營重心。`,
        painPoints: `針對 ${companyName} 的關鍵挑戰在於線上與線下數據無法有效整合，導致無法描繪精確的客戶輪廓。此外，現有系統反應速度緩慢，無法應對高併發的流量。客戶對於個人化體驗的期待提升，傳統的統一推播模式已導致轉換率持續下滑。`
      });
      setStep('report');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans p-4 md:p-10 flex justify-center selection:bg-blue-500/30">
      <div className="w-full max-w-3xl">
        
        {/* 標題區域 */}
        <div className="mb-12 text-center animate-in fade-in duration-1000">
          <h1 className="text-5xl font-black tracking-tighter text-white mb-3 italic">
            Sales<span className="text-blue-500">AI</span>
          </h1>
          <div className="h-1.5 w-16 bg-blue-500 mx-auto mb-4 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <p className="text-slate-400 font-medium tracking-wide">SYSTEX 智慧提案 Demo 系統</p>
        </div>

        {/* 第一階段：輸入與搜尋 */}
        {step === 'input' && (
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="relative">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 block ml-1">公司名稱</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => {
                      isSelectionMade.current = false;
                      setCompanyName(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="輸入關鍵字，例如：寶"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 px-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-xl"
                  />
                  {/* 下拉建議清單 */}
                  {suggestions.length > 0 && (
                    <div className="absolute z-20 w-full bg-slate-800 border border-slate-700 mt-2 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1">
                      {suggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectCompany(item)}
                          className={`px-6 py-4 cursor-pointer transition-colors flex justify-between items-center ${selectedIndex === idx ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
                        >
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-[10px] bg-slate-900/50 px-2 py-1 rounded text-slate-400 font-bold border border-slate-700 uppercase">{item.industry}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 block ml-1">產業領域</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="系統將自動識別..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 px-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-xl"
                />
              </div>
            </div>

            <div className="mb-10">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 block ml-1">補充資料 (50字以內)</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value.slice(0, 50))}
                placeholder="輸入額外的背景資訊..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 px-6 h-32 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none shadow-xl"
              />
              <div className="text-right text-[10px] font-bold text-slate-600 mt-2 tracking-widest">{memo.length} / 50</div>
            </div>

            <button
              onClick={generateReport}
              disabled={loading || !companyName}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-900/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              自然生成報告
            </button>
          </div>
        )}

        {/* 第二階段：報告內容 (對比截圖 2 & 3) */}
        {step === 'report' && reportData && (
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
            {/* 產業趨勢 */}
            <div className="bg-slate-900/50 rounded-[2rem] border border-slate-800/50 overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="bg-[#0ea5e9] px-8 py-5 flex items-center gap-3">
                <BarChart3 size={20} className="text-white" />
                <h2 className="text-xl font-black text-white tracking-widest uppercase">產業趨勢</h2>
              </div>
              <div className="p-8">
                <p className="text-slate-200 leading-relaxed text-lg font-medium">
                  {reportData.trends}
                </p>
              </div>
            </div>

            {/* 客戶痛點分析 */}
            <div className="bg-slate-900/50 rounded-[2rem] border border-slate-800/50 overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="bg-[#f59e0b] px-8 py-5 flex items-center gap-3">
                <AlertCircle size={20} className="text-white" />
                <h2 className="text-xl font-black text-white tracking-widest uppercase">客戶痛點分析</h2>
              </div>
              <div className="p-8">
                <p className="text-slate-200 leading-relaxed text-lg font-medium">
                  {reportData.painPoints}
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('solution')}
              className="w-full bg-white text-[#0f172a] font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-[0.98] group"
            >
              產出精誠推薦解決方案 <ChevronRight size={22} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* 第三階段：解決方案 (對標截圖 4) */}
        {step === 'solution' && (
          <div className="animate-in zoom-in-95 duration-500 bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden text-slate-900 px-8 py-12 md:px-12">
            <div className="flex justify-between items-center mb-10 border-b-2 border-slate-50 pb-8">
              <div>
                <h2 className="text-3xl font-black text-[#1e3a8a] tracking-tight mb-2">精誠推薦解決方案</h2>
                <div className="h-1.5 w-12 bg-blue-600 rounded-full"></div>
              </div>
              <div className="hidden sm:block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border border-blue-100">
                SYSTEX EXPERT
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { t: "全通路零售數據中台", d: "整合線上與線下交易數據，建立 360 度會員畫像，實現精準預測消費行為。" },
                { t: "AI 智慧自動化客服系統", d: "導入最新 LLM 技術自動處理常見諮詢，提升回應效率並降低人力成本。" },
                { t: "混合雲安全防護架構", d: "提供端到端的資安監測，確保客戶數據安全並符合政府法規要求。" },
                { t: "ESG 智慧能源管理", d: "透過物聯網監測門市能耗與排碳量，協助企業達成綠色轉型目標。" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-7 bg-slate-50/80 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-blue-50/50 transition-all group">
                  <div className="bg-blue-600 text-white p-2.5 rounded-xl self-start group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">{item.t}</h4>
                    <p className="text-slate-500 mt-2 font-medium leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setStep('input')} 
              className="mt-12 w-full text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors tracking-widest uppercase"
            >
              ← 返回修改條件重新生成
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
