import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export async function generateAIResponse(content: string, messages: Message[]) {
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
      // @ts-expect-error history is not a valid property
      history,
    });

    const response = await result.response;
    return { content: response.text() || 'I apologize, but I encountered an error generating a response.' };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return { content: 'I apologize, but I encountered an error generating a response.' };
  }
}
