'use client';

import { useThemeStore } from "@/stores/useThemeStore";
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from "./ui/button";
import { ArrowUp, Paperclip } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { KeyboardEvent, useState } from "react";
import axios from "axios";

interface ChatBoxProps {
    onSendMessage: (content: string) => void;
    onStreamingComplete: (content: string) => void;
    isStreaming: boolean;
    setIsStreaming: (val: boolean) => void;
    conversationId: string;
    clerkId: string;
}

const ChatBox = ({ onSendMessage, onStreamingComplete, isStreaming, setIsStreaming, conversationId, clerkId }: ChatBoxProps) => {
    const { theme } = useThemeStore();
    const [modelName] = useState('Gemini');
    const [message, setMessage] = useState('');

    const handleSend = async () => {
        if (!message.trim() || isStreaming) return;

        // Send the user message
        onSendMessage(message);
        setMessage('');

        // Set up the streaming state
        setIsStreaming?.(true);
        let fullResponse = '';

        try {
            // Call the Gemini API
            const response = await fetch('/api/v1/gemini/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'user',
                            content: message,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from Gemini API');
            }

            // Handle the streaming response
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to read response stream');
            }

            // Process the stream
            // Process the stream
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = new TextDecoder().decode(value);

                // Split chunk by lines (in case multiple lines come at once)
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const jsonStr = line.replace(/^data:\s*/, '').trim();

                        if (jsonStr === '[DONE]') {
                            setIsStreaming?.(false);
                            return;
                        }

                        try {
                            const data = JSON.parse(jsonStr);
                            const delta = data.text ?? '';

                            fullResponse += delta;
                            onStreamingComplete?.(fullResponse);
                        } catch (err) {
                            console.error('Failed to parse stream chunk:', jsonStr, err);
                        }
                    }
                }
            }


        } catch (error) {
            console.error('Error streaming response:', error);
            // Notify the parent component about the error
            onStreamingComplete?.('Sorry, I encountered an error. Please try again.');
        } finally {
            setIsStreaming?.(false);
            try {
                const aiMessage = {
                    content: fullResponse,
                    role: 'ai',
                };
                await axios.post('/api/v1/chat/addChat', { aiMessage, conversationId, clerkId }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (err) {
                console.error('Failed to cancel reader:', err);
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-[95vw] md:w-[532px] lg:w-[720px] relative bottom-0">
            <div
                className={`w-full max-h-[400px] flex flex-col justify-end 
                    ${theme === 'light' ? 'bg-[#6A4DFC]/10' : 'bg-[#6A4DFC]/[10%]'} 
                    rounded-t-xl px-2 pt-2 overflow-hidden`}
            >
                <div className={`rounded-t-lg border-x-[1px] border-t-[1px] border-[#6A4DFC] ${theme === 'light' ? 'bg-white' : ''}`}>
                    <div
                        className={`px-4 pt-4 rounded-t-lg ${theme === 'light' ? 'bg-[#6A4DFC]/10' : 'bg-white/5'}`}
                    >
                        <TextareaAutosize
                            placeholder="Ask me anything..."
                            className="w-full min-h-[50px] resize-none overflow-y-auto focus:outline-none bg-transparent border-0 shadow-none text-sm
                                [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#6A4DFC]/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
                            maxRows={10}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className={`flex justify-between items-center ${theme === 'light' ? 'bg-[#6A4DFC]/10' : 'bg-white/5'} p-2`}>
                        <div className="flex rounded-lg">
                            <DropdownMenu>
                                <DropdownMenuTrigger className={`px-2 py-2 text-xs h-full rounded-lg hover:bg-[#6A4DFC]/30 hover:ring-1 hover:ring-[#6A4DFC] transition-colors duration-100 ease-in-out ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`}>
                                    {modelName}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className={`w-48 ${theme === 'light' ? 'bg-[#6A4DFC]/10 text-[#6A4DFC]' : 'bg-black/60 text-white'} backdrop-blur-sm border border-[#6A4DFC] rounded-lg p-2`} align="start" sideOffset={8}>
                                    <DropdownMenuItem className="hover:bg-[#6A4DFC]/20 focus:bg-[#6A4DFC]/30 rounded-md px-2 py-1.5 text-sm cursor-pointer">OpenAI</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-[#6A4DFC]/20 focus:bg-[#6A4DFC]/30 rounded-md px-2 py-1.5 text-sm cursor-pointer">Claude</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-[#6A4DFC]/20 focus:bg-[#6A4DFC]/30 rounded-md px-2 py-1.5 text-sm cursor-pointer">ChatGPT</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="ghost" className={`p-0 h-8 w-8 ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`}>
                                <Paperclip className="h-4 w-4" />
                            </Button>
                            <Button
                                className={`h-8 w-8 p-0 border-[2px] border-[#6a4dfc] ${message.trim() && !isStreaming ? 'bg-[#6A4DFC] hover:bg-[#6A4DFC]/90' : 'bg-white/20 cursor-not-allowed'} transition-colors duration-100 ease-in-out`}
                                disabled={!message.trim() || isStreaming}
                                onClick={handleSend}
                            >
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
