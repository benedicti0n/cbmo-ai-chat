"use client"
import { redirect } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import useChatHistoryStore from '@/stores/useChatHistoryStore';
import { useEffect } from 'react';

export default function Home() {
  const { isLoaded, user } = useUser();
  const { createConversation } = useChatHistoryStore();

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        const userId = user.id;
        const conversationId = createConversation('New Chat', userId);
        redirect(`/chat/${conversationId}`);
      } else {
        redirect('/chat');
      }
    }
  }, [isLoaded, user, createConversation]);

  return null;
}