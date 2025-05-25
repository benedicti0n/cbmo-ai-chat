import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    createdAt: string;
}

export interface ConversationWithMessages {
    id: string;
    title: string;
    updatedAt: Date;
    messages: Message[];
}

export async function GET(request: Request) {
    try {
        // Get the Clerk user ID from the auth token
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get the userId from query parameters
        const { searchParams } = new URL(request.url);
        const requestedUserId = searchParams.get('userId');

        // Verify the user is requesting their own data
        if (userId !== requestedUserId) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Fetch chat history from the database
        const conversations = await prisma.conversation.findMany({
            where: {
                clerkId: userId,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            select: {
                id: true,
                title: true,
                updatedAt: true,
                messages: true
            },
        });

        // Format the response with all messages
        const conversationsWithMessages: ConversationWithMessages[] = conversations.map(conv => {
            // Safely parse the messages JSON array
            let messages: Message[] = [];
            try {
                messages = Array.isArray(conv.messages) 
                    ? (conv.messages as unknown as Message[]).map(msg => ({
                        id: msg.id,
                        role: msg.role,
                        content: msg.content,
                        createdAt: msg.createdAt
                    }))
                    : [];
            } catch (error) {
                console.error('Error parsing messages:', error);
                messages = [];
            }
            
            return {
                id: conv.id,
                title: conv.title,
                updatedAt: conv.updatedAt,
                messages: messages
            };
        });

        return NextResponse.json(conversationsWithMessages);

    } catch (error) {
        console.error('Error fetching chat history:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
