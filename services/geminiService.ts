
import { GoogleGenAI, Type } from "@google/genai";
import { MuhurtaRequest, MuhurtaResponse, Language } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Generates a deterministic numeric seed from the request object
 * to ensure consistent results for the same inputs.
 */
const generateSeed = (req: MuhurtaRequest): number => {
  const str = JSON.stringify({
    a: req.activity,
    l: req.location,
    s: req.startDate,
    e: req.endDate,
    m: req.searchMode,
    p: req.people.map(p => ({ d: p.birthDate, t: p.birthTime, r: p.rashi, n: p.nakshatra })),
    ln: req.language
  });
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const findMuhurtas = async (req: MuhurtaRequest): Promise<MuhurtaResponse> => {
  const peopleContext = req.people.map((p, i) => {
    const label = p.label || `Person ${i + 1}`;
    return `
    Details for ${label}:
    - Birth Date: ${p.birthDate}
    - Birth Time: ${p.birthTime}
    - Birth Place: ${p.birthPlace}
    - Rashi (Moon Sign): ${p.rashi}
    - Janma Nakshatra: ${p.nakshatra}
    - Nakshatra Pada: ${p.nakshatraPada}`;
  }).join("\n");

  let languageInstruction = "Provide all text fields in English.";
  if (req.language === Language.KANNADA) {
    languageInstruction = "CRITICAL: The user speaks ONLY KANNADA. Do NOT use any English words, Latin characters, or parentheses containing English in the output. Translate EVERYTHING. Use KANNADA script for all fields: 'summary', 'day', 'timeRange', 'tithi', 'nakshatra', 'yoga', and 'description'. Ensure 100% pure Kannada content.";
  } else if (req.language === Language.HINDI) {
    languageInstruction = "CRITICAL: The user speaks ONLY HINDI. Do NOT use any English words, Latin characters, or parentheses containing English in the output. Translate EVERYTHING. Use DEVANAGARI script for all fields: 'summary', 'day', 'timeRange', 'tithi', 'nakshatra', 'yoga', and 'description'. Ensure 100% pure Hindi content.";
  }

  const dateContext = req.searchMode === 'specific'
    ? `Analyze the specific date: ${req.startDate}. Check if it is auspicious for the activity. If not, suggest the closest best timing on that day or explain why it's not ideal.`
    : `Find the most auspicious personalized Muhurtas between ${req.startDate} and ${req.endDate || '6 months from start'}.`;

  const model = genAI.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find the most auspicious personalized Muhurtas for ${req.activity}.
    
    Location: ${req.location}. 
    
    Date Context:
    ${dateContext}
    
    User(s) Birth Details for Compatibility:
    ${peopleContext}
    
    ${req.additionalNotes ? `Additional Preferences: ${req.additionalNotes}.` : ""}
    
    Instruction:
    Please use your deep knowledge of Vedic Astrology (Jyotisha). 
    Base your calculations on the **Muhurta Shastra** (Electional Astrology) branch.
    Follow the **Parashari** tradition for Rashi/Nakshatra strength and compatibility.
    Utilize the **Drik Ganitha** (Precise Astronomical) method for time transitions.
    
    Crucially, consider the "Nakshatra Pada" for fine-grained compatibility (Tara Bala and Chandra Bala). 
    ${req.people.length > 1 ? "For Marriage/Engagement, perform a detailed Melapak analysis (Ashta-kuta) considering the Nakshatras and Padas of both individuals to find shared auspicious windows." : "Ensure the Muhurta is specifically strengthened for the individual's birth star and pada."}
    Avoid Rahu Kaal, Yamaganda, and Gulika Kaal. Ensure Tithi, Nakshatra, and Yoga are ideal for ${req.activity}.
    
    In the 'summary' field, briefly mention that these results are derived using Muhurta Shastra and Drik Ganitha principles for authenticity.
    
    ${languageInstruction}
    
    For range searches, provide a list of at least 8-12 high-quality Muhurtas. For specific date searches, provide detailed analysis for that day.
    
    CONSISTENCY REQUIREMENT: For the same set of input data, the selected Muhurtas and their specific timings must remain consistent.`,
    config: {
      responseMimeType: "application/json",
      seed: generateSeed(req),
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "A high-level astrological overview, mentioning the methodology used."
          },
          muhurtas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING, description: "Full date in YYYY-MM-DD format" },
                day: { type: Type.STRING, description: "Day of the week" },
                timeRange: { type: Type.STRING, description: "The specific auspicious time window" },
                tithi: { type: Type.STRING, description: "The lunar day" },
                nakshatra: { type: Type.STRING, description: "The lunar mansion for that specific Muhurta" },
                yoga: { type: Type.STRING, description: "The Yoga for the day" },
                description: { type: Type.STRING, description: "Auspicious details." },
                auspiciousScore: { type: Type.NUMBER, description: "Score from 0 to 100" }
              },
              required: ["date", "day", "timeRange", "tithi", "nakshatra", "description", "auspiciousScore"]
            }
          }
        },
        required: ["summary", "muhurtas"]
      }
    }
  });

  const response = await model;
  const text = response.text;
  if (!text) throw new Error("No response from the divine guidance system.");
  return JSON.parse(text) as MuhurtaResponse;
};
