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
        const { conversationId, title, clerkId, userMessage, aiMessage, content, role, createdAt } = await request.json();
        console.log('Received request:', { conversationId, title, clerkId, userMessage, aiMessage, content, role, createdAt });

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

        // // Prepare the new message
        // const newMessage = userMessage || {
        //     id,
        //     content,
        //     role,
        //     createdAt: new Date().toISOString()
        // };

        // if (existingConversation) {
        //     // Update existing conversation
        //     const currentMessages = Array.isArray(existingConversation.messages)
        //         ? existingConversation.messages as Message[]
        //         : [];

        //     const updatedMessages = [...currentMessages, newMessage];

        //     await prisma.$executeRaw`
        //         UPDATE "Conversation" 
        //         SET 
        //             messages = ${JSON.stringify(updatedMessages)}::jsonb,
        //             "updatedAt" = NOW()
        //         WHERE id = ${conversationId}::uuid;
        //     `;

        //     console.log('Updated conversation with new message');
        //     return NextResponse.json({
        //         success: true,
        //         conversation: {
        //             ...existingConversation,
        //             messages: updatedMessages,
        //             updatedAt: new Date()
        //         }
        //     });
        // } else {
        //     // Create new conversation
        //     if (!title || !clerkId) {
        //         return NextResponse.json(
        //             { error: 'title and userId are required for new conversations' },
        //             { status: 400 }
        //         );
        //     }

        //     await prisma.$executeRaw`
        //         INSERT INTO "Conversation" (id, title, "clerkId", messages, "createdAt", "updatedAt")
        //         VALUES (
        //             ${conversationId}::uuid,
        //             ${title},
        //             ${clerkId},
        //             ${JSON.stringify([newMessage])}::jsonb,
        //             NOW(),
        //             NOW()
        //         );
        //     `;

        //     console.log('Created new conversation');
        //     return NextResponse.json({
        //         success: true,
        //         conversation: {
        //             id: conversationId,
        //             title,
        //             clerkId,
        //             messages: [newMessage],
        //             createdAt: new Date(),
        //             updatedAt: new Date()
        //         }
        //     });
        // }

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