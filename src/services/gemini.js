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
export const extractStructuredData = async (apiKey, reportText) => {
    if (!apiKey) throw new Error("Gemini API Key is missing.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
        You are a medical data extractor. Extract numerical values and units from this medical report. 
        Focus on:
        1. Blood Glucose (HbA1c, Fasting, Post Prandial)
        2. Lipids (LDL, HDL, Total Cholesterol, Triglycerides)
        3. Vital Organs (Liver: SGPT/SGOT, Kidney: Creatinine/Urea)
        4. Vitals (Blood Pressure, Heart Rate)
        5. Blood Health (Hemoglobin, WBC, Platelets, Vitamin B12, Vitamin D)
        6. Musculoskeletal (Calcium, Uric Acid - relevant for joints/limbs)

        Return a JSON object with this structure:
        {
            "date": "YYYY-MM-DD (extract from report or use current)",
            "metrics": {
                "heart": { "bpm": 0, "bp_sys": 0, "bp_dia": 0 },
                "blood": { 
                    "glucose_f": 0, "glucose_pp": 0, "hba1c": 0, "hemoglobin": 0, 
                    "wbc": 0, "platelets": 0, "vitamin_b12": 0, "vitamin_d": 0 
                },
                "cholesterol": { "total": 0, "ldl": 0, "hdl": 0, "triglycerides": 0 },
                "liver": { "sgpt": 0, "sgot": 0 },
                "kidney": { "creatinine": 0, "urea": 0 },
                "limbs": { "calcium": 0, "uric_acid": 0 }
            },
            "summary": "Short 1-sentence health status",
            "criticalAlerts": ["List any values outside normal range"]
        }



        Report Text:
        ${reportText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
};
