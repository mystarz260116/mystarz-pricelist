
import { GoogleGenAI, Type } from "@google/genai";
import { PriceListData } from "../types";

export async function processMemoWithAI(memo: string, currentData: PriceListData): Promise<PriceListData> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        text: `You are a helpful assistant specialized in medical price list management. 
        A salesperson has provided a memo about price changes for a dental clinic. 
        Update the provided JSON data based on this memo.
        Only change the prices mentioned in the memo. Keep other items exactly as they are.
        
        Memo: "${memo}"
        
        Current Price Data: ${JSON.stringify(currentData)}`
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
            }
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
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  try {
    const updatedData = JSON.parse(response.text.trim()) as PriceListData;
    return updatedData;
  } catch (error) {
    console.error("Failed to parse AI response", error);
    return currentData;
  }
}
