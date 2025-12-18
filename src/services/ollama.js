export const generateOllamaResponse = async (prompt, model, baseUrl = 'http://localhost:11434', languageInstruction = '') => {
    try {
        // Prepend language instruction to the prompt if provided
        const fullPrompt = languageInstruction ? `${languageInstruction}\n\n${prompt}` : prompt;

        const response = await fetch(`${baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                prompt: fullPrompt,
                stream: false
            }),
        });

        if (!response.ok) {
            // Check for CORS error or connection refused
            throw new Error(`Ollama Error: ${response.statusText}. Make sure Ollama is running and CORS is allowed.`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Ollama Service Error:", error);
        throw error;
    }
};

export const extractStructuredDataWithOllama = async (model, reportText, baseUrl = 'http://localhost:11434') => {
    try {
        const prompt = `
            You are a medical data extractor. Extract numerical values and units from this medical report. 
            Focus on:
            1. Blood Glucose (HbA1c, Fasting, Post Prandial)
            2. Lipids (LDL, HDL, Total Cholesterol, Triglycerides)
            3. Vital Organs (Liver: SGPT/SGOT, Kidney: Creatinine/Urea)
            4. Vitals (Blood Pressure, Heart Rate)
            5. Blood Health (Hemoglobin, WBC, Platelets, Vitamin B12, Vitamin D)
            6. Musculoskeletal (Calcium, Uric Acid)

            Return ONLY a JSON object with this EXACT structure (use 0 for missing values):
            {
                "date": "YYYY-MM-DD",
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
                "criticalAlerts": []
            }


            Report Text:
            "${reportText}"
        `;

        const response = await fetch(`${baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false,
                format: "json"
            }),
        });

        if (!response.ok) throw new Error(`Ollama Error: ${response.statusText}`);

        const data = await response.json();
        let jsonResponse = data.response;

        // Resilience: Some models might wrap JSON in markdown blocks
        const jsonMatch = jsonResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonResponse = jsonMatch[0];
        }

        try {
            return JSON.parse(jsonResponse);
        } catch (e) {
            console.error("Failed to parse Ollama JSON. Raw response:", data.response);
            // Fallback empty structure
            return {
                date: new Date().toISOString().split('T')[0],
                metrics: {},
                summary: "Extraction failed. Please check medical report format.",
                criticalAlerts: []
            };
        }
    } catch (error) {

        console.error("Ollama Extraction Error:", error);
        throw error;
    }
};

