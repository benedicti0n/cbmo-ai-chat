'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ChatBox from '@/components/ChatBox';
import ChatMessage from '@/components/ChatMessage';
import ScrollToBottomButton from '@/components/ScrollToBottomButton';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useGreeting } from '@/hooks/useGreeting';
import { useParams } from 'next/navigation';
import useChatHistoryStore from '@/stores/useChatHistoryStore';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

type ScrollBehavior = 'auto' | 'smooth';

export type Message = {
    id: string;
    content: string;
    role: 'user' | 'ai';
};

const ChatSection = () => {
    const { theme } = useThemeStore();
    const { isOpen } = useSidebarStore();
    const { fullGreeting } = useGreeting();
    const [messages, setMessages] = useState<Message[]>([]);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const isScrollingRef = useRef<boolean>(false);

    const { user } = useUser();
    const userId = user?.id as string;

    const { conversationId }: { conversationId: string } = useParams()
    const streamingContentRef = useRef('');


    useEffect(() => {
        // const savedMessages = localStorage.getItem('chatMessages');
        // if (savedMessages) {
        //     const parsedMessages = JSON.parse(savedMessages).map(
        //         (msg: Omit<Message, 'timestamp'> & { timestamp: string }) => ({
        //             ...msg,
        //             timestamp: new Date(msg.timestamp),
        //         })
        //     );
        //     setMessages(parsedMessages);
        // }
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

        // Reset the scrolling flag after a short delay
        const timer = setTimeout(() => {
            isScrollingRef.current = false;
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Auto-scroll effect when new messages arrive
    useEffect(() => {
        if (messages.length > 0) {
            // Use requestAnimationFrame to ensure the DOM is updated before scrolling
            requestAnimationFrame(() => {
                scrollToBottom('auto');
            });
        }
        // We're intentionally not including scrollToBottom in the dependency array
        // because it's already stable (has no dependencies that would cause it to change)
        // and we don't want to recreate this effect when it changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages.length]);

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

    const handleSendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        const userMessage = {
            id: crypto.randomUUID(),
            content,
            role: 'user' as const,
        };

        const title = content.slice(0, 20);

        setMessages((prev) => [...prev, userMessage]);

        try {
            await axios.post('/api/v1/chat/addChat', {
                conversationId,
                title,
                clerkId: userId,
                userMessage,
            });
        } catch (error) {
            console.error('Error adding user message:', error);
            // Optionally, you might want to remove the message from the UI if the API call fails
            // setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        }
    }, [conversationId, userId]);

    const handleStreamingComplete = useCallback((content: string) => {
        setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];

            // If the last message is from the assistant, update it
            if (lastMessage && lastMessage.role === 'ai') {
                return [
                    ...prev.slice(0, -1),
                    { ...lastMessage, content },
                ];
            }

            // Otherwise, add a new message
            return [
                ...prev,
                {
                    id: `ai-${Date.now()}`,
                    content,
                    role: 'ai' as const,
                },
            ];
        });
    }, []);

    return (
        <div
            className={`
                flex items-center justify-center relative
                ${isOpen
                    ? 'md:ml-56 md:mt-4 w-full h-screen md:w-[calc(100vw-224px)] md:h-[calc(100vh-16px)] md:rounded-tl-xl md:border-l-[1px] md:border-t-[1px] md:border-[#6A4DFC]'
                    : 'ml-0 mt-0 w-full h-screen'}
                ${theme === 'light' ? 'bg-white' : 'bg-white/5'}
                transition-all duration-100 ease-in-out
            `}
        >
            <div
                className={`flex flex-col items-center justify-between h-full w-full rounded-tl-xl relative ${theme === 'light' ? 'bg-[#6A4DFC]/10' : ''
                    }`}
            >
                <div className="flex-1 flex justify-center overflow-hidden w-[95vw] md:w-[532px] lg:w-[720px] h-full">
                    <div className="relative w-full h-full flex items-end justify-center">
                        <div
                            ref={messagesContainerRef}
                            className={`w-full overflow-y-auto py-4 scrollbar-hide px-2 ${messages.length === 0 ? 'h-full' : 'min-h-[10%] max-h-full pt-16'}`}
                        >
                            {messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <p className={`text-center font-semibold text-4xl ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`}>
                                        {fullGreeting}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4 w-full">
                                    {messages.map((message) => (
                                        <ChatMessage
                                            key={message.id}
                                            message={{
                                                id: message.id,
                                                content: message.content,
                                                role: message.role,
                                                timestamp: new Date(message.createdAt),
                                            }}
                                        />
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                            <ScrollToBottomButton
                                onClick={() => scrollToBottom('smooth')}
                                show={showScrollButton}
                            />
                        </div>
                    </div>
                </div>
                <ChatBox
                    onSendMessage={handleSendMessage}
                    onStreamingComplete={handleStreamingComplete}
                    isStreaming={isStreaming}
                    setIsStreaming={setIsStreaming}
                />
            </div>
        </div>
    );
};

export default ChatSection;
