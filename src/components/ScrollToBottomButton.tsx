'use client';

import { Button } from './ui/button';
import { useThemeStore } from '@/stores/useThemeStore';
import { ChevronDown } from 'lucide-react';

interface ScrollToBottomButtonProps {
    onClick: () => void;
    show: boolean;
}

const ScrollToBottomButton = ({ onClick, show }: ScrollToBottomButtonProps) => {
    const { theme } = useThemeStore();

    if (!show) return null;

    return (
        <Button
            onClick={onClick}
            className={`px-3 py-1 rounded-full shadow-lg flex items-center transition-all duration-100 ease-in-out z-10 bg-[#6A4DFC]/30 text-[#6A4DFC] hover:bg-[#6A4DFC]/40 backdrop-blur-md ${theme === 'dark' ? 'text-white' : 'text-[#6A4DFC]'}`}
        >
            <span className="text-xs">Scroll to bottom</span>
            <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
    );
};

export default ScrollToBottomButton;
