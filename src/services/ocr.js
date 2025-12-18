import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imageFile, onProgress) => {
    try {
        const worker = await Tesseract.createWorker('eng', 1, {
            logger: m => {
                if (m.status === 'recognizing text') {
                    onProgress(m.progress);
                }
            }
        });

        const result = await worker.recognize(imageFile);
        const { text, confidence } = result.data;

        await worker.terminate();
        return { text, confidence };
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to extract text from image.");
    }
};
