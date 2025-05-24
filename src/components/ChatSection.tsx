'use client';

import ChatBox from '@/components/ChatBox';
import ChatMessage from '@/components/ChatMessage';
import ScrollToBottomButton from '@/components/ScrollToBottomButton';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useCallback, useEffect, useRef, useState } from 'react';

export type Message = {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
};

const ChatSection = () => {
    const { theme } = useThemeStore();
    const { isOpen } = useSidebarStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);

    useEffect(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
            const parsedMessages = JSON.parse(savedMessages).map(
                (msg: Omit<Message, 'timestamp'> & { timestamp: string }) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                })
            );
            setMessages(parsedMessages);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
        }

        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop <= clientHeight + 200;
            if (isNearBottom) {
                scrollToBottom('smooth');
            }
        }
    }, [messages]);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        if (!messagesEndRef.current) return;

        isScrollingRef.current = true;
        messagesEndRef.current.scrollIntoView({ behavior });
        setShowScrollButton(false);

        setTimeout(() => {
            isScrollingRef.current = false;
        }, 500);
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom('auto');
        }
    }, [messages.length, scrollToBottom]);

    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current || isScrollingRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;

        setShowScrollButton(!isAtBottom);
    }, []);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        let timeoutId: NodeJS.Timeout;
        const debouncedHandleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleScroll, 50);
        };

        container.addEventListener('scroll', debouncedHandleScroll);
        handleScroll();

        return () => {
            container.removeEventListener('scroll', debouncedHandleScroll);
            clearTimeout(timeoutId);
        };
    }, [handleScroll]);

    const handleSendMessage = (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: "I'm your AI assistant. How can I help you today?",
                isUser: false,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        }, 500);
    };

    return (
        <div
            className={`
                flex fixed items-center justify-center 
                ${isOpen
                    ? 'md:ml-56 md:mt-4 w-full h-full md:w-[calc(100vw-224px)] md:h-[calc(100vh-16px)] md:rounded-tl-xl md:border-l-[1px] md:border-t-[1px] md:border-[#6A4DFC]'
                    : 'ml-0 mt-0 w-full h-screen'}
                ${theme === 'light' ? 'bg-white' : 'bg-white/5'}
                transition-all duration-100 ease-in-out
            `}
        >
            <div
                className={`flex flex-col items-center justify-between h-full w-full rounded-tl-xl relative ${theme === 'light' ? 'bg-[#6A4DFC]/10' : ''
                    }`}
            >
                <div
                    ref={messagesContainerRef}
                    className="flex-1 w-[95vw] md:w-[532px] lg:w-[720px] overflow-y-auto py-4 scrollbar-hide relative"
                >
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <p className={`text-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                Start a conversation with the AI assistant
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    <div className="fixed bottom-36 left-1/2 -translate-x-1/2 translate-y-0">
                        <ScrollToBottomButton onClick={() => scrollToBottom()} show={showScrollButton} />
                    </div>
                </div>
                <ChatBox onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
};

export default ChatSection;
