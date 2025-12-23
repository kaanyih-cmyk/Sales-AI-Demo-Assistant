import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  }

  try {
    const { query } = req.body as { query?: string };
    if (!query?.trim()) return res.status(400).json({ error: "Missing query" });

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請列出 5 個與「${query}」相關的台灣知名公司或經濟部登記公司正式名稱（只回傳公司名清單）。`,
      config: { tools: [{ googleSearch: {} }] },
    });

    return res.status(200).json({ text: response.text ?? "" });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Unknown error" });
  }
}
