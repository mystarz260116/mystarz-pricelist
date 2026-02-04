import { GoogleGenAI, Type } from "@google/genai";
import { PriceListData } from "../types";

export async function processMemoWithAI(memo: string, currentData: PriceListData): Promise<PriceListData> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        text: `あなたは歯科医院の料金表管理エキスパートです。
営業担当者が記入したメモに基づき、既存のJSONデータを更新してください。
メモに記載された変更のみを反映し、それ以外の項目やID、構造、医院情報は可能な限り維持してください。
金額は必ず3桁カンマ区切りの文字列（例: "15,000"）として出力してください。

メモ: "${memo}"

現在のデータ: ${JSON.stringify(currentData)}`
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          clinic: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              representative: { type: Type.STRING },
              publishDate: { type: Type.STRING },
              expiryDate: { type: Type.STRING },
            },
            required: ["name", "representative", "publishDate"]
          },
          categories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                color: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      price: { type: Type.STRING }
                    },
                    required: ["name", "price"]
                  }
                }
              },
              required: ["id", "title", "items"]
            }
          }
        },
        required: ["clinic", "categories"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("AIからの応答が空です");
    return JSON.parse(text.trim()) as PriceListData;
  } catch (error) {
    console.error("AI解析エラー:", error);
    return currentData;
  }
}