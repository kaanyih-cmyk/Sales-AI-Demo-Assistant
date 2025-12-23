
import { GoogleGenAI, Type } from "@google/genai";
import { ReportData, SystexSolution } from "../types";

// The API key is obtained from process.env.API_KEY
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 使用 Google Search Grounding 搜尋真實公司名稱
 */
export const searchCompanyNames = async (query: string): Promise<string[]> => {
  if (!query || query.trim().length < 1) return [];

  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請列出 5 個與關鍵字 "${query}" 相關的台灣知名公司或經濟部登記的公司正式名稱。只回傳名稱列表，每行一個，不要編號。`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    return text
      .split('\n')
      .map(name => name.replace(/^\d+\.\s*/, '').trim())
      .filter(name => name.length > 0)
      .slice(0, 5);
  } catch (error) {
    console.error("搜尋公司失敗:", error);
    return [];
  }
};

/**
 * 自動獲取選定公司的背景補充資料 (50字以內)
 */
export const fetchCompanyBackground = async (companyName: string): Promise<string> => {
  if (!companyName) return "";
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請搜尋並提供台灣公司「${companyName}」的簡短背景介紹。
      規則：
      1. 字數必須嚴格控制在 45 字以內。
      2. 內容需包含其主要核心業務或最新市場動態。
      3. 直接回傳文字，不需要任何標題或引號。`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("獲取背景失敗:", error);
    return "無法取得背景資訊，請手動輸入。";
  }
};

/**
 * 生成產業趨勢與客戶痛點分析
 */
export const generateReport = async (company: string, industry: string, extraInfo: string): Promise<ReportData> => {
  const ai = getAI();
  const prompt = `你是一位專業的產業分析師。請針對位於「${industry}」產業的「${company}」進行分析。
  參考背景：${extraInfo || "無"}
  
  請生成 3 個目前的【產業趨勢】和 3 個該客戶面臨的【客戶痛點】。
  
  規則：
  1. 產業趨勢標題必須包含在【】中。
  2. 內容必須具體、具備專業洞察力。
  3. 每一項內容（含標題）必須在 100 字以內。
  4. 請以繁體中文撰寫並回傳 JSON 格式。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            },
            painPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            }
          },
          required: ["trends", "painPoints"]
        }
      }
    });

    const resultText = response.text?.trim() || "{}";
    return JSON.parse(resultText);
  } catch (error) {
    console.error("生成報告失敗:", error);
    throw error;
  }
};

/**
 * 生成精誠推薦解決方案
 */
export const generateSystexSolution = async (company: string, industry: string, painPoints: string): Promise<SystexSolution> => {
  const ai = getAI();
  const prompt = `針對「${company}」在${industry}產業中的痛點：${painPoints}。
  請生成一個由「精誠集團 (SYSTEX)」提供的專業解決方案推薦。
  
  規則：
  1. 標題必須包含精誠或其解決方案品牌名。
  2. 執行單位必須是精誠內部的專業部門。
  3. 業務話術必須以業務代表的角度，具備極強的說服力。
  4. 回傳繁體中文 JSON 格式。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            department: { type: Type.STRING },
            reason: { type: Type.STRING },
            salesPitch: { type: Type.STRING },
            targetPainPoint: { type: Type.STRING }
          },
          required: ["title", "description", "department", "reason", "salesPitch", "targetPainPoint"]
        }
      }
    });

    const resultText = response.text?.trim() || "{}";
    return JSON.parse(resultText);
  } catch (error) {
    console.error("生成解決方案失敗:", error);
    throw error;
  }
};
