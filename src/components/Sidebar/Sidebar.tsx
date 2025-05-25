'use client';

import React, { useCallback, useEffect } from 'react'
import DesktopSidebar from './DesktopSidebar'
import MobileSidebar from './MobileSidebar'
import { useUser } from '@clerk/nextjs';
import useChatHistoryStore from '@/stores/useChatHistoryStore';
import { fetchChatHistory } from '@/utils/chatUtils';

const Sidebar = () => {
    const { user } = useUser();
    const userId = user?.id;
    const { setAllConversations } = useChatHistoryStore();

    const loadChatHistory = useCallback(async () => {
        if (!userId) return;
        try {
            const data = await fetchChatHistory(userId);
            setAllConversations(data);
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }, [userId, setAllConversations]);
    useEffect(() => {
        if (userId) {
            loadChatHistory();
        }
    }, [userId, loadChatHistory]);

    return (
        <>
            <div className="hidden md:block">
                <DesktopSidebar />
            </div>
            <div className="md:hidden">
                <MobileSidebar />
            </div>
        </>
    )
}

export default Sidebar