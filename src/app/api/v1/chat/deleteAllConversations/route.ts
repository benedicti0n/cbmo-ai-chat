import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const success = await prisma.conversation.deleteMany({
            where: {
                clerkId: userId,
            },
        });
        if (success) {
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Failed to delete all chats' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error deleting all chats:', error);
        return NextResponse.json({ error: 'Failed to delete all chats' }, { status: 500 });
    }
}