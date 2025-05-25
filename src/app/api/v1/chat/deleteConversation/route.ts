import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');
        console.log('Received request:', { conversationId });

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

        if (existingConversation) {
            // Delete conversation
            await prisma.conversation.delete({
                where: { id: conversationId },
            });

            console.log('Deleted conversation');
            return NextResponse.json({
                success: true,
                message: 'Conversation deleted successfully',
            });
        } else {
            console.log('Conversation not found');
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
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