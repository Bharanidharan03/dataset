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

        const { data: { text } } = await worker.recognize(imageFile);
        await worker.terminate();
        return text;
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to extract text from image.");
    }
};
