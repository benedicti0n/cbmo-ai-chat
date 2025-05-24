import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Helper function to convert the stream to a ReadableStream
function streamToReadableStream(stream: AsyncGenerator<any>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          // Extract the actual text from the chunk structure
          const textParts = chunk.candidates?.[0]?.content?.parts || [];

          for (const part of textParts) {
            if (part?.text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: part.text })}\n\n`));
            }
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        console.error('Stream error:', error);
        controller.error(error);
      }
    },
  });
}


export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Type for the message object
    interface ChatMessage {
      role: 'user' | 'assistant' | 'system';
      content: string;
    }

    // Convert messages to the format expected by Gemini
    const chatMessages = messages as ChatMessage[];
    const prompt = chatMessages[chatMessages.length - 1].content;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

    // Start a chat session with history
    const chat = model.startChat({
      history: chatMessages.slice(0, -1).map((msg: ChatMessage) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Send the message and get a stream of results
    const result = await chat.sendMessageStream(prompt);

    // Convert the stream to a ReadableStream
    const readableStream = streamToReadableStream(result.stream as AsyncGenerator<string>);

    // Return the stream with the correct headers
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
}
