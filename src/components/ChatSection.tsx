'use client';

import { useThemeStore } from '@/stores/useThemeStore';
import ChatBox from '@/components/ChatBox';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useEffect, useRef, useState } from 'react';

type Message = {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
};

const ChatSection = () => {
    const { theme } = useThemeStore();
    const { isOpen } = useSidebarStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load messages from localStorage on component mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
            const parsedMessages = JSON.parse(savedMessages).map((msg: Omit<Message, 'timestamp'> & { timestamp: string }) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));
            setMessages(parsedMessages);
        }
    }, []);

    // Save messages to localStorage and scroll to bottom when messages change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
        }
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (content: string) => {
        if (!content.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            content,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: "I'm your AI assistant. How can I help you today?",
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        }, 500);
    };

    return (
        <div className={` 
            flex fixed items-center justify-center 
            ${isOpen ? 'md:ml-56 md:mt-4 w-full h-full md:w-[calc(100vw-224px)] md:h-[calc(100vh-16px)] md:rounded-tl-xl md:border-l-[1px] md:border-t-[1px] md:border-[#6A4DFC]' : 'ml-0 mt-0 w-full h-screen'} 
            ${theme === 'light' ? 'bg-white' : 'bg-white/5'} 
            transition-all duration-100 ease-in-out
        `}>
            <div className={`flex flex-col items-center justify-between h-full w-full rounded-tl-xl relative ${theme === 'light' ? 'bg-[#6A4DFC]/10' : ''}`}>
                <div className="flex-1 w-[95vw] md:w-[532px] lg:w-[720px] overflow-y-auto py-4 px-2 scrollbar-hide">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <p className={`text-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                Start a conversation with the AI assistant
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.isUser
                                            ? 'bg-[#6A4DFC] text-white rounded-br-none'
                                            : theme === 'light'
                                                ? 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                                                : 'bg-white/10 text-white rounded-bl-none border border-white/20'
                                            }`}
                                    >
                                        <p className="text-sm">{message.content}</p>
                                        <p className={`text-xs mt-1 text-right ${message.isUser ? 'text-white/70' : theme === 'light' ? 'text-gray-500' : 'text-white/50'}`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
                <ChatBox onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
};

export default ChatSection;