import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generateAIResponse(content: string, messages: any[]) {
  try {
    const history = messages.map((msg) => ({
      author: msg.role === 'user' ? 'user' : 'model',
      content: msg.content,
    }));

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: content }],
      }],
      history,
    });

    const response = await result.response;
    return { content: response.text() || 'I apologize, but I encountered an error generating a response.' };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return { content: 'I apologize, but I encountered an error generating a response.' };
  }
}
