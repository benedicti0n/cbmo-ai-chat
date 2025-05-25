"use client"
import { redirect } from 'next/navigation';

import { useUser } from '@clerk/nextjs';
import useChatHistoryStore from '@/stores/useChatHistoryStore';
export default function Home() {
  const { user } = useUser();
  const userId = user?.id;
  const { createConversation } = useChatHistoryStore();

  const conversationId = createConversation('New Chat', userId!);
  if (!user) {
    redirect('/chat');
  } else {
    redirect(`/chat/${conversationId}`);
  }
}