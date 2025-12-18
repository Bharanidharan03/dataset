/**
 * Central Configuration for Medical Logic
 * 
 * Defines "Safety Defaults" approved by user.
 */

export const MEDICAL_CONSTANTS = {
    // Feature 1: Evidence Anchoring
    GUIDELINES: {
        DIABETES: "ADA (American Diabetes Association) 2024",
        HEART: "AHA/ACC (American Heart Association)",
        GENERAL: "WHO (World Health Organization) Global Reference",
        LIVER: "AASLD (American Association for the Study of Liver Diseases)",
        KIDNEY: "KDIGO (Kidney Disease: Improving Global Outcomes)"
    },

    // Feature 2: Confidence Thresholds
    CONFIDENCE: {
        HIGH: 90,   // >90% = Green
        MEDIUM: 70, // 70-90% = Yellow
        LOW: 0,     // <70% = Red (Requires manual verify)

        // Text strings for UI/Voice
        LABELS: {
            HIGH: "High Confidence",
            MEDIUM: "Medium Confidence",
            LOW: "Low Confidence - Verify Manually"
        }
    },

    // Feature 3: Quality Assessment
    SCAN_QUALITY: {
        MIN_OCR_WORDS: 10,
        BLUR_THRESHOLD: 60, // Average Tesseract confidence below this = "Blurry/Bad Scan"
        WARNING_MSG: "Scan quality is low. Please cross-check values carefully."
    },

    // Feature 6: Voice Support
    LANGUAGES: [
        { code: 'en-US', name: 'English', label: 'English' },
        { code: 'ta-IN', name: 'Tamil', label: 'தமிழ்' },
        { code: 'hi-IN', name: 'Hindi', label: 'हिंदी' },
        { code: 'es-ES', name: 'Spanish', label: 'Español' }
    ],

    // Feature 8: Baseline
    HISTORY_LOOKBACK: 5, // Number of past reports to compare

    // Feature 11: Advice Guardrails
    DISCLAIMER: "This analysis is for informational purposes only and references clinical guidelines (WHO/ADA). It is not a medical diagnosis. Always consult a doctor.",
    ADVICE_BLOCKER_PROMPT: "Do NOT provide medical advice, treatment plans, or prescriptions. If the user asks for advice, reply: 'I cannot provide medical advice. Clinical guidelines suggest discussing these values with a doctor.'",

    // Feature 4: Body System Correlations (Safe List)
    ALLOWED_CORRELATIONS: [
        "Metabolic (Glucose + Lipids)",
        "Renal-Cardiac (BP + Kidney)",
        "Liver-Metabolic (Enzymes + Lipids)"
    ],

    // Feature 13: Daily Life Impact Translation (Cautious Language)
    IMPACT_PROMPTS: {
        ENERGY: "fluctuating energy levels",
        FOCUS: "difficulty concentrating",
        SLEEP: "sleep quality disruptions",
        HYDRATION: "hydration needs"
    }
};
