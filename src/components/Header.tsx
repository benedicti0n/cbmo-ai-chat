'use client';

import React from 'react'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useSidebarStore } from '@/stores/useSidebarStore'
import { useThemeStore } from '@/stores/useThemeStore'

const Header = () => {
    const { isOpen } = useSidebarStore();
    const { theme } = useThemeStore();
    return (
        <header className={`${isOpen ? 'border-l-[1px] border-b-[1px] border-[#6A4DFC] border-t-[1px] md:border-t-0 rounded-l-xl md:rounded-bl-xl md:rounded-tl-none' : 'border-l-[1px] border-y-[1px] border-[#6A4DFC]  rounded-l-xl'} 
        ${theme === 'light' ? 'bg-[#E1DBFE]' : 'bg-[#6A4DFC]/20'}
        flex justify-end items-center px-2 py-2 gap-4 w-fit fixed right-0 top-0 z-[60] mt-4 transition-all duration-100 ease-in-out backdrop-blur-md`}>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <SignedOut>
                    <SignInButton />
                    <SignUpButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </header>
    )
}

export default Header