'use client';

import React from 'react';
import { useThemeStore } from '@/stores/useThemeStore';

type Message = {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
};

interface ChatMessageProps {
    message: Message;
}

const ChatMessage = React.memo(({ message }: ChatMessageProps) => {
    const { theme } = useThemeStore();

    return (
        <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[60%] md:max-w-[80%] rounded-2xl px-4 py-2 ${message.isUser
                    ? `${theme === 'light' ? 'bg-[#6A4DFC]/30 backdrop-blur-sm rounded-br-none text-[#3F29C7] border-[1px] border-[#6A4DFC]' : 'bg-[#6A4DFC]/[30%] backdrop-blur-sm rounded-br-none text-white border-[1px] border-[#6A4DFC]'}`
                    : `${theme === 'light' ? 'bg-white text-[#3F29C7] border-[1px] border-white/20' : 'bg-white/10 text-[#3F29C7] border-[1px] border-white/20'} text-foreground rounded-bl-none`
                    }`}
            >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 text-right ${message.isUser ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                </p>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if the message content or timestamp changes
    return prevProps.message.content === nextProps.message.content &&
        prevProps.message.timestamp.getTime() === nextProps.message.timestamp.getTime();
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
