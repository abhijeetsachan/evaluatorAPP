// /api/proxy.js

import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(request, response) {
    // Vercel automatically parses the body, so we can use it directly.
    // It also runs on POST by default for the proxy.
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const { mode, payload, prompt, file } = request.body;

        const modelName = "gemini-1.5-flash"; // Use a single, powerful model
        const model = genAI.getGenerativeModel({ model: modelName });

        let result;
        if (mode === 'ocr') {
            const imagePart = {
                inlineData: {
                    data: file.data,
                    mimeType: file.mimeType,
                },
            };
            result = await model.generateContent([prompt, imagePart]);
        } else {
            // For 'evaluate' and 'generate' modes
            result = await model.generateContent(payload);
        }

        // Send the successful response back to the front-end
        response.status(200).json(result.response);

    } catch (error) {
        console.error('Error in serverless function:', error);
        response.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}
