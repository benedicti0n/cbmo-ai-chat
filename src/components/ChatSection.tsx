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
import { useRouter } from 'next/navigation';
import { AnimatedShinyText } from './magicui/animated-shiny-text';

type ScrollBehavior = 'auto' | 'smooth';

export type Message = {
    id: string;
    content: string;
    role: 'user' | 'ai';
    timestamp: Date;
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
    const [isLoading, setIsLoading] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    const { user } = useUser();
    const userId = user?.id as string;

    const router = useRouter();

    const { conversationId }: { conversationId: string } = useParams()
    const { conversations } = useChatHistoryStore()
    const conversation = conversations.find((conv) => conv.id === conversationId);

    useEffect(() => {
        if (conversation) {
            setMessages(conversation.messages);
        }
    }, [conversation]);

    console.log(messages);

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

    const handleScroll = useCallback((e?: React.UIEvent<HTMLDivElement>) => {
        // Prevent the scroll event from being handled if it's a programmatic scroll
        if (e && isScrollingRef.current) return;
        const container = messagesContainerRef.current;
        if (!container || isScrollingRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const scrollThreshold = 100; // Pixels from bottom to consider "at bottom"
        const isAtBottom = Math.abs(scrollHeight - (scrollTop + clientHeight)) <= scrollThreshold;

        setShowScrollButton(!isAtBottom);
    }, []);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        if (!messagesEndRef.current) return;

        isScrollingRef.current = true;
        messagesEndRef.current.scrollIntoView({ behavior });

        if (behavior === 'smooth') {
            const timer = setTimeout(() => {
                isScrollingRef.current = false;
                setShowScrollButton(false);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            isScrollingRef.current = false;
            setShowScrollButton(false);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            requestAnimationFrame(() => {
                scrollToBottom('auto');
            });
        }
    }, [messages.length, scrollToBottom]);

    useEffect(() => {
        handleScroll();
    }, [messages, handleScroll]);

    const handleSendMessage = useCallback(async (content: string) => {
        setIsThinking(true);
        if (!content.trim()) return;
        if (!user) {
            router.push('/signup');
            return;
        }

        const userMessage = {
            id: `user-${Date.now()}`,
            content,
            role: 'user' as const,
            timestamp: new Date(),
        };

        const title = content.slice(0, 20);

        setMessages((prev) => [...prev, userMessage]);

        try {
            if (user) {
                await axios.post('/api/v1/chat/addChat', {
                    conversationId,
                    title,
                    clerkId: userId,
                    userMessage,
                });
            }
        } catch (error) {
            console.error('Error adding user message:', error);
        } finally {
            setIsThinking(false);
        }
    }, [conversationId, userId]);

    const handleStreamingComplete = useCallback((content: string) => {
        setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];

            if (lastMessage && lastMessage.role === 'ai') {
                return [
                    ...prev.slice(0, -1),
                    {
                        ...lastMessage,
                        content,
                        timestamp: new Date()
                    },
                ];
            }

            return [
                ...prev,
                {
                    id: `ai-${Date.now()}`,
                    content,
                    role: 'ai' as const,
                    timestamp: new Date()
                },
            ];
        });
    }, []);

    return (
        <div
            className={`
                flex flex-col items-center relative
                ${isOpen
                    ? 'md:ml-56 md:mt-4 w-full h-screen md:w-[calc(100vw-224px)] md:h-[calc(100vh-16px)] md:rounded-tl-xl md:border-l-[1px] md:border-t-[1px] md:border-[#6A4DFC]'
                    : 'ml-0 mt-0 w-full h-screen'}
                ${theme === 'light' ? 'bg-white' : 'bg-white/5'}
            `}
        >
            <div className="w-full h-full flex flex-col">
                {/* Messages Container */}
                <div className="relative w-full h-full overflow-hidden">
                    <div
                        ref={messagesContainerRef}
                        className={`w-full overflow-y-auto h-full scrollbar-hide`}
                        onScroll={handleScroll}
                    >
                        <div className={`flex justify-center ${messages.length === 0 ? 'items-center' : 'items-end'} w-full h-[calc(100%-80px)]`}>
                            <div className={`relative w-[95vw] md:w-[532px] lg:w-[720px] ${messages.length === 0 ? 'h-full' : 'h-[80%]'}`}>
                                <div className={`w-full pt-4 pb-4 ${messages.length === 0 ? 'h-full flex items-center justify-center' : 'min-h-full'}`}>
                                    <div className="w-[95vw] md:w-[532px] lg:w-[720px]">
                                        {messages.length === 0 ? (
                                            <div className="h-full flex items-center justify-center">
                                                <p className={`text-center font-semibold text-3xl md:text-5xl px-4 ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`}>
                                                    {fullGreeting}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {messages.map((message) => (
                                                    <ChatMessage
                                                        key={message.id}
                                                        message={message}
                                                    />
                                                ))}
                                                {isThinking && (
                                                    <div className="h-2 w-2 py-6 relative">
                                                        <AnimatedShinyText className="text-center text-md font-semibold text-[#6A4DFC]">Thinking...</AnimatedShinyText>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                        <ScrollToBottomButton
                                            show={showScrollButton}
                                            onClick={() => scrollToBottom('smooth')}
                                            className="mb-4"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ChatBox Container */}
                <div className="w-full">
                    <div className="flex justify-center w-full">
                        <div className="w-[95vw] md:w-[532px] lg:w-[720px] relative">
                            <ChatBox
                                onSendMessage={handleSendMessage}
                                onStreamingComplete={handleStreamingComplete}
                                isStreaming={isStreaming}
                                setIsStreaming={setIsStreaming}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                                conversationId={conversationId}
                                clerkId={userId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatSection;
