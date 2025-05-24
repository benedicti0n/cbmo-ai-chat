'use client';

import React, { useEffect } from 'react'
import DesktopSidebar from './DesktopSidebar'
import MobileSidebar from './MobileSidebar'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import useChatHistoryStore from '@/stores/useChatHistoryStore'

const Sidebar = () => {
    const { user } = useUser();
    const userId = user?.id;
    const { conversations, setAllConversations } = useChatHistoryStore();

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get(`/api/chat-history?userId=${userId}`);
                const data = response.data;
                setAllConversations(data);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        if (userId) {
            fetchChatHistory();
        }
    }, [userId]);

    return (
        <>
            <div className="hidden md:block">
                <DesktopSidebar conversations={conversations} />
            </div>
            <div className="md:hidden">
                <MobileSidebar conversations={conversations} />
            </div>
        </>
    )
}

export default Sidebar