'use client';

import { useThemeStore } from "@/stores/useThemeStore";
import TextareaAutosize from 'react-textarea-autosize'; // Install: npm i react-textarea-autosize
import { Button } from "./ui/button";
import { ArrowUp, Paperclip } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useState } from "react";


const ChatBox = () => {
    const { theme } = useThemeStore();
    const [modelName, setModelName] = useState('OpenAI');

    const handleSend = () => {
        console.log('Send');
    };

    return (
        <div className="w-[720px] absolute bottom-0">
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
                        />
                    </div>
                    <div className={`flex justify-between items-center ${theme === 'light' ? 'bg-[#6A4DFC]/10' : 'bg-white/5'} px-2 py-1`}>
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
                            <Button variant="ghost" className={`px-3 ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`}>
                                <Paperclip />
                            </Button>
                            <Button
                                variant="default"
                                className="px-3"
                                onClick={handleSend}
                            >
                                <ArrowUp />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
