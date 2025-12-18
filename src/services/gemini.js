import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateGeminiResponse = async (apiKey, history, message, context, languageInstruction = '') => {
    if (!apiKey) throw new Error("Gemini API Key is missing. Please add it in settings.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
        history: history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
        })),
    });

    // Prepend language instruction to the message if provided
    const fullMessage = languageInstruction ? `${languageInstruction}\n\n${message}` : message;

    const result = await chat.sendMessage(fullMessage);
    const response = await result.response;
    return response.text();
};
import { MEDICAL_CONSTANTS } from './medicalConfig';

export const extractStructuredData = async (apiKey, reportText) => {
    if (!apiKey) throw new Error("Gemini API Key is missing.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
        You are a medical data extractor and analyzer.
        
        STRICT MEDICAL RULES:
        1. GUIDELINES: Anchor all interpretations to these standards: ${JSON.stringify(MEDICAL_CONSTANTS.GUIDELINES)}.
        2. CONFIDENCE: For every extracted value, assign a confidence level ("High", "Medium", "Low").
           - "High": >90% clarity (text is perfect).
           - "Medium": 70-90% clarity (minor typos/ambiguity).
           - "Low": <70% clarity (inferred or blurry).
        3. SAFETY: ${MEDICAL_CONSTANTS.ADVICE_BLOCKER_PROMPT}

        Extract numerical values and return this EXACT JSON structure.
        For every metric, output an object: { "value": number, "unit": string, "confidence": "High" | "Medium" | "Low", "status": "Normal" | "High" | "Low" | "Critical", "explanation": "Why this is normal/abnormal based on guidelines" }

        Targets:
        1. Blood Glucose (HbA1c, Fasting, Post Prandial)
        2. Lipids (LDL, HDL, Total Cholesterol, Triglycerides)
        3. Vital Organs (Liver: SGPT/SGOT, Kidney: Creatinine/Urea)
        4. Vitals (Blood Pressure, Heart Rate)
        5. Blood Health (Hemoglobin, WBC, Platelets, Vitamin B12, Vitamin D)
        6. Musculoskeletal (Calcium, Uric Acid)

        Return JSON:
        {
            "date": "YYYY-MM-DD",
            "metrics": {
                "heart": { 
                    "bpm": { "value": 0, "unit": "bpm", "confidence": "High", "status": "Normal", "explanation": "..." },
                    "bp_sys": { "value": 0, ... },
                    "bp_dia": { "value": 0, ... }
                },
                "blood": { 
                    "glucose_f": { "value": 0, ... }, "glucose_pp": { "value": 0, ... }, 
                    "hba1c": { "value": 0, ... }, "hemoglobin": { "value": 0, ... },
                    "wbc": { "value": 0, ... }, "platelets": { "value": 0, ... },
                    "vitamin_b12": { "value": 0, ... }, "vitamin_d": { "value": 0, ... }
                },
                "cholesterol": { 
                    "total": { "value": 0, ... }, "ldl": { "value": 0, ... }, 
                    "hdl": { "value": 0, ... }, "triglycerides": { "value": 0, ... } 
                },
                "liver": { "sgpt": { "value": 0, ... }, "sgot": { "value": 0, ... } },
                "kidney": { "creatinine": { "value": 0, ... }, "urea": { "value": 0, ... } },
                "limbs": { "calcium": { "value": 0, ... }, "uric_acid": { "value": 0, ... } }
            },
            "summary": "Short health summary citing changes",
            "criticalAlerts": ["List critical values with reason"],
            "body_system_correlations": [
                { "systems": ["Metabolic"], "finding": "Elevated HbA1c matches high Triglycerides reflecting metabolic syndome risk." }
            ],
            "daily_life_impact": [
                { "area": "Energy", "insight": "Low Hemoglobin may explain recent fatigue." },
                { "area": "Focus", "insight": "High Glucose might be associated with difficulty concentrating after meals." }
            ]
        }
        
        INSTRUCTION FOR IMPACTS:
        - Only generate daily life impacts for ABNORMAL values.
        - Use CAUTIOUS language: "may explain", "might be associated with", "could contribute to".
        - Do NOT say "This IS causing...".

        Report Text:
        ${reportText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
};
