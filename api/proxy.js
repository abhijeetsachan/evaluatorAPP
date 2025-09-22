// File: /api/proxy.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return response.status(500).json({ error: 'API key is not configured.' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const { mode, payload } = request.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(payload);
        
        // Vercel requires you to explicitly allow CORS for requests from other domains if needed,
        // but since the front-end and back-end are on the same domain, this is fine.
        response.status(200).json(result.response);

    } catch (error) {
        console.error('Error in serverless function:', error);
        response.status(500).json({ error: error.message });
    }
}
