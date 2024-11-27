import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

interface PriceData {
  modelInfo: string;
  pricing: string;
  timestamp: string;
  source: string;
}

export const useGeminiAnalyzer = () => {
  const analyzePricing = async (
    scrapedData: any[], 
    onProgress?: (provider: string, percent: number) => void
  ): Promise<{ analyzedData: PriceData[], usedPrompt: string }> => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const results: PriceData[] = [];
      let lastUsedPrompt = '';
      
      for (let i = 0; i < scrapedData.length; i++) {
        const data = scrapedData[i];
        const progress = (i / scrapedData.length) * 100;
        onProgress?.(data.modelInfo, progress);

        const prompt = `
You are a pricing data analyzer for Language Models (LLMs). 
Your task is to extract and structure pricing information from the provided content.

Source: ${data.source}

Raw Content:
${data.pricing}

Instructions:
1. Identify all LLM models mentioned in the content
2. Extract their pricing details
3. Format the information consistently

Required format for each model:
- Model name and version
- Input cost (per 1K tokens)
- Output cost (per 1K tokens)
- Context window size (if mentioned)
- Any usage limits or special conditions

Return a JSON array where each item has:
{
  "modelInfo": "Model name and version",
  "pricing": "Formatted pricing details",
  "timestamp": "${data.timestamp}",
  "source": "${data.source}"
}

Important:
- Use consistent price formatting (e.g., "$0.01/1K tokens")
- Include both input and output costs when available
- Return ONLY valid JSON, no markdown or other formatting
- Focus on current pricing, ignore historical prices
- Include any relevant usage tiers or volume discounts

Example format:
[{
  "modelInfo": "GPT-4 Turbo",
  "pricing": "Input: $0.01/1K tokens, Output: $0.03/1K tokens, Context: 128K tokens",
  "timestamp": "${data.timestamp}",
  "source": "${data.source}"
}]`;

        lastUsedPrompt = prompt;

        try {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const responseText = response.text().trim();
          
          let jsonText = responseText.replace(/```json\s*/gi, '')
                                   .replace(/```\s*$/gi, '')
                                   .replace(/```JSON\s*/gi, '')
                                   .trim();
          
          if (!jsonText.startsWith('[')) {
            const startIndex = jsonText.indexOf('[');
            if (startIndex !== -1) {
              jsonText = jsonText.substring(startIndex);
            }
          }
          
          if (!jsonText.endsWith(']')) {
            const endIndex = jsonText.lastIndexOf(']');
            if (endIndex !== -1) {
              jsonText = jsonText.substring(0, endIndex + 1);
            }
          }

          const parsedData = JSON.parse(jsonText);
          if (Array.isArray(parsedData)) {
            results.push(...parsedData);
          }
        } catch (error) {
          console.error('Error processing response:', error);
          results.push({
            modelInfo: data.modelInfo,
            pricing: 'Error processing pricing information',
            timestamp: data.timestamp,
            source: data.source
          });
        }
      }
      
      onProgress?.('', 100);
      return { 
        analyzedData: results,
        usedPrompt: lastUsedPrompt 
      };
    } catch (error) {
      console.error('Gemini analysis failed:', error);
      return { 
        analyzedData: scrapedData.map(data => ({
          modelInfo: data.modelInfo,
          pricing: 'Error analyzing pricing information',
          timestamp: data.timestamp,
          source: data.source
        })),
        usedPrompt: 'Error: Failed to process prompt'
      };
    }
  };

  return { analyzePricing };
}; 