'use client';

import { useThemeStore } from '@/stores/useThemeStore';
import ChatBox from '@/components/ChatBox';
import { useSidebarStore } from '@/stores/useSidebarStore';

const ChatSection = () => {
    const { theme } = useThemeStore();
    const { isOpen } = useSidebarStore();

    return (
        <div className={` 
            flex fixed items-center justify-center 
            ${isOpen ? 'md:ml-56 md:mt-4 w-full h-full md:w-[calc(100vw-224px)] md:h-[calc(100vh-16px)] md:rounded-tl-xl md:border-l-[1px] md:border-t-[1px] md:border-[#6A4DFC]' : 'ml-0 mt-0 w-full h-screen'} 
            ${theme === 'light' ? 'bg-white' : 'bg-white/5'} 
            transition-all duration-100 ease-in-out
        `}>
            <div className={`flex items-center justify-center h-full w-full rounded-tl-xl relative ${theme === 'light' ? 'bg-[#6A4DFC]/10' : ''}`}>
                <ChatBox />
            </div>
        </div>
    )
}

export default ChatSection