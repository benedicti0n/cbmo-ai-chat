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
import { AnimatedShinyText } from './magicui/animated-shiny-text';
import { useRouter } from 'next/navigation';

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

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        if (!messagesEndRef.current) return;

        isScrollingRef.current = true;
        messagesEndRef.current.scrollIntoView({ behavior });

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
        setIsThinking(true);
        if (!content.trim()) return;
        if (!user) {
            router.push('/signup');
            return;
        }

        const userMessage = {
            content,
            role: 'user',
        };

        const title = content.slice(0, 20);

        // @ts-expect-error id is not defined in userMessage
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
            // setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        } finally {
            setIsThinking(false);
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
                flex flex-col items-center relative
                ${isOpen
                    ? 'md:ml-56 md:mt-4 w-full h-screen md:w-[calc(100vw-224px)] md:h-[calc(100vh-16px)] md:rounded-tl-xl md:border-l-[1px] md:border-t-[1px] md:border-[#6A4DFC]'
                    : 'ml-0 mt-0 w-full h-screen'}
                ${theme === 'light' ? 'bg-white' : 'bg-white/5'}
            `}
        >
            <div className="w-full h-full flex flex-col">
                {/* Messages Container */}
                <div className={`w-full overflow-y-auto ${messages.length === 0 ? 'h-full' : 'flex-1'} h-full scrollbar-hide`}>
                    <div className={`flex justify-center ${messages.length === 0 ? 'items-center' : 'items-end'} w-full h-full`}>
                        <div className={`relative w-[95vw] md:w-[532px] lg:w-[720px] ${messages.length === 0 ? 'h-full' : 'h-[90%] md:h-full'}`}>
                            <div
                                ref={messagesContainerRef}
                                className={`w-full pt-4 pb-4 ${messages.length === 0 ? 'h-full flex items-center justify-center' : 'min-h-[15%] max-h-[85%]'}`}
                            >
                                <div className="w-[95vw] md:w-[532px] lg:w-[720px]">
                                    {messages.length === 0 ? (
                                        <div className="h-full flex items-center justify-center">
                                            <p className={`text-center font-semibold text-3xl md:text-5xl px-4 ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`}>
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
                                                        // @ts-expect-error createdAt is not defined in message
                                                        timestamp: new Date(message.createdAt),
                                                    }}
                                                />
                                            ))}
                                            {isThinking && (
                                                <div className="h-2 w-2 py-6 relative">
                                                    <AnimatedShinyText className="text-center text-md font-semibold text-[#6A4DFC]">Thinking...</AnimatedShinyText>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <ScrollToBottomButton
                                        onClick={() => scrollToBottom('smooth')}
                                        show={showScrollButton}
                                    />
                                    <div ref={messagesEndRef} />
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
