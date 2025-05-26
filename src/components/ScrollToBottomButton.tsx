'use client';

import { Button } from './ui/button';
import { useThemeStore } from '@/stores/useThemeStore';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollToBottomButtonProps {
    onClick: () => void;
    show: boolean;
    className?: string;
}

const ScrollToBottomButton = ({ onClick, show, className }: ScrollToBottomButtonProps) => {
    const { theme } = useThemeStore();

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className={cn(
                        'fixed w-[95vw] md:w-[532px] lg:w-[720px] bottom-32 flex justify-center items-center z-50',
                        className
                    )}
                >
                    <Button
                        onClick={onClick}
                        variant="ghost"
                        className={`px-4 py-2 rounded-full flex items-center space-x-2 backdrop-blur-2xl border-[1px] border-[#6A4DFC] focus:outline-none ${theme === 'light' ? 'bg-[#6A4DFC]/30 hover:bg-[#6A4DFC]/50' : 'bg-[#6A4DFC]/30 hover:bg-[#6A4DFC]/50 text-white'}`}
                        aria-label="Scroll to bottom"
                    >
                        <span className="text-xs">Scroll to bottom</span>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScrollToBottomButton;
