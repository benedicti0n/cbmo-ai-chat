import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Message = {
    id: string;
    role: 'user' | 'ai';
    content: string;
    createdAt: string;
};

export async function POST(request: NextRequest) {
    try {
        const { conversationId, title, clerkId, userMessage, aiMessage, content, role } = await request.json();
        console.log('Received request:', { conversationId, title, clerkId, userMessage, aiMessage, content, role });

        if (!conversationId) {
            return NextResponse.json(
                { error: 'conversationId is required' },
                { status: 400 }
            );
        }

        // Check if conversation exists
        const existingConversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        console.log('Existing conversation:', existingConversation ? 'Found' : 'Not found');

        // Validate and prepare the new user message
        const newUserMessage = userMessage?.content?.trim() && userMessage?.role
            ? {
                id: crypto.randomUUID(),
                content: userMessage.content.trim(),
                role: userMessage.role,
                createdAt: new Date().toISOString()
            }
            : null;

        // Validate and prepare the new AI message
        const newAiMessage = aiMessage?.content?.trim() && aiMessage?.role
            ? {
                id: crypto.randomUUID(),
                content: aiMessage.content.trim(),
                role: aiMessage.role,
                createdAt: new Date().toISOString()
            }
            : null;

        // If no valid messages to add, return early
        if (!newUserMessage && !newAiMessage) {
            return NextResponse.json(
                { error: 'No valid messages to add to conversation' },
                { status: 400 }
            );
        }

        if (existingConversation) {
            // Update existing conversation
            const currentMessages = Array.isArray(existingConversation.messages)
                ? existingConversation.messages as Message[]
                : [];

            // Create a new array with existing messages
            const updatedMessages = [...currentMessages];
            
            // Add user message if valid
            if (newUserMessage) {
                updatedMessages.push(newUserMessage);
            }
            
            // Add AI message if valid
            if (newAiMessage) {
                updatedMessages.push(newAiMessage);
            }

            await prisma.conversation.update({
                where: { id: conversationId },
                data: {
                    messages: updatedMessages,
                    updatedAt: new Date()
                }
            });

            console.log('Updated conversation with new message');
            return NextResponse.json({
                success: true,
                message: 'Message added to existing conversation',
            });
        } else {
            // Create new conversation
            if (!title || !clerkId) {
                return NextResponse.json(
                    { error: 'title and userId are required for new conversations' },
                    { status: 400 }
                );
            }

            await prisma.conversation.create({
                data: {
                    id: conversationId,
                    title,
                    clerkId,
                    messages: newUserMessage ? [newUserMessage] : [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            console.log('Created new conversation');
            return NextResponse.json({
                success: true,
                message: 'Conversation created successfully',
            });
        }

    } catch (error) {
        console.error('Detailed error:', error);

        // More specific error handling
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Unknown error occurred' },
            { status: 500 }
        );
    }
}