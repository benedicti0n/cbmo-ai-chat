'use client';

import { useThemeStore } from '@/stores/useThemeStore';
import ChatBox from '@/components/ChatBox';

export default function Home() {
  const { theme } = useThemeStore();
  return (
    <div className={`flex fixed items-center justify-center w-[calc(100vw-256px)] h-[calc(100vh-24px)] mt-6 rounded-tl-xl border-l-[1px] border-t-[1px] border-[#6A4DFC] ${theme === 'light' ? 'bg-white' : 'bg-white/5'}`}>
      <div className={`flex items-center justify-center h-full w-full rounded-tl-xl relative ${theme === 'light' ? 'bg-[#6A4DFC]/10' : ''}`}>
        <ChatBox />
      </div>
    </div>
  );
}