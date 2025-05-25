'use client';

import React from 'react';
import {

    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
    const { isOpen } = useSidebarStore();
    const { theme } = useThemeStore();

    return (
        <header className={`${isOpen ? 'border-l-[1px] border-b-[1px] border-[#6A4DFC] border-t-[1px] md:border-t-0 rounded-l-xl md:rounded-bl-xl md:rounded-tl-none' : 'border-l-[1px] border-y-[1px] border-[#6A4DFC]  rounded-l-xl'} 
        ${theme === 'light' ? 'bg-[#E1DBFE]' : 'bg-[#231E40]'} 
        flex justify-end items-center px-2 py-2 gap-2 w-fit fixed right-0 top-0 z-[30] mt-4 transition-all duration-100 ease-in-out backdrop-blur-md`}>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <SignedOut>
                    <Link href="/signup">
                        <Button variant="default" className="px-4 py-2 rounded-md bg-[#6A4DFC] text-white hover:bg-[#5a3fe0] transition-colors">
                            <LogIn className="h-4 w-4" />
                            Sign Up
                        </Button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </header>
    )
}

export default Header