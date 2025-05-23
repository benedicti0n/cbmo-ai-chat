'use client';

import { useThemeStore } from '@/stores/useThemeStore';

export default function Home() {
  const { theme } = useThemeStore();
  return (
    <div className={`flex fixed w-full items-center justify-center h-screen mt-6 rounded-tl-xl border-l-[1px] border-t-[1px] border-[#6A4DFC] ${theme === 'light' ? 'bg-white' : 'bg-black'}`} >
      <div className={`flex items-center justify-center h-screen w-full rounded-tl-xl ${theme === 'light' ? 'bg-[#6A4DFC]/10' : 'bg-[#6A4DFC]/[15%]'}`}>
        hi
      </div>
    </div>
  );
}