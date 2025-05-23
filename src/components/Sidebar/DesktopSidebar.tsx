'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useThemeStore } from '@/stores/useThemeStore';
import { Input } from '../ui/input';
import { useSidebarStore } from '@/stores/useSidebarStore';
import useChatHistoryStore, { Conversation } from '@/stores/useChatHistoryStore';
import { useRouter } from 'next/navigation';

interface DesktopSidebarProps {
  conversations: Conversation[]
};

type ChatHistoryItem = {
  id: string;
};

export default function DesktopSidebar({ conversations }: DesktopSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { createConversation } = useChatHistoryStore();
  const { isOpen, toggleSidebar, setOpen } = useSidebarStore();
  const { theme } = useThemeStore();
  const router = useRouter();

  const handleNewChat = () => {
    const newConversationId = createConversation('New Chat');
    router.push(`/chat/${newConversationId}`);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && window.innerWidth <= 768 && !target.closest('.sidebar-container')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setOpen]);

  const openSearch = () => {
    setSearchQuery('');
    if (window.innerWidth <= 768) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <div className={`fixed top-4 left-4 z-[60] flex items-center justify-center gap-2 backdrop-blur-md ${isOpen ? 'p-0' : 'p-2 rounded-xl border border-[#6A4DFC]'} ${theme === 'light' ? 'bg-[#E1DBFE]' : 'bg-[#231E40]'} `}>
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          className={`p-2 rounded-md hover:bg-[#6A4DFC]/30 transition-colors ${isOpen && 'hover:border-none hover:bg-transparent hover:ring-0 mt-1'}`}
          aria-label="Toggle sidebar"
        >
          <PanelLeft className={`${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`} style={{ width: '16px', height: '16px' }} />
        </Button>
        {!isOpen && (
          <div className={`flex gap-2`}>
            <Button
              onClick={openSearch}
              variant="ghost"
              className={`p-2 rounded-md hover:bg-[#6A4DFC]/30 dark:hover:bg-[#6A4DFC]/30 transition-colors `}
              aria-label="Toggle sidebar"
            >
              <Search className={`${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`} style={{ width: '16px', height: '16px' }} />
            </Button>
            <Button
              onClick={handleNewChat}
              variant="ghost"
              className={`p-2 rounded-md hover:bg-[#6A4DFC]/30 dark:hover:bg-[#6A4DFC]/30 transition-colors`}
              aria-label="Toggle theme"
            >
              <Plus className={`${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`} style={{ width: '16px', height: '16px' }} />
            </Button>
          </div>
        )}
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-56 transform transition-transform duration-100 ease-in-out z-40 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:fixed md:transition-transform md:duration-100 sidebar-container`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-center items-center mb-4 mt-1">
            <div className="w-32 h-8 relative">
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="logo" className="w-6 h-6" />
                <p className={`ml-2 font-michroma text-xs ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`}>CBMO AI</p>
              </div>
            </div>
          </div>

          <Button
            className="w-full flex items-center justify-center gap-2"
            variant="default"
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>

          {/* Search Chats */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              <Search className={`${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`} style={{ width: '16px', height: '16px' }} />
            </div>
            <Input
              type="text"
              placeholder="Search your chats"
              className={`!w-full !pl-8 !pr-4 !py-2 !text-xs !rounded-none !border-0 !border-b-[1px] !border-[#6A4DFC] ${theme === 'light' ? '!bg-transparent placeholder:!text-[#6A4DFC]' : '!bg-transparent placeholder:!text-gray-400'} focus:!outline-none focus:!ring-0 focus-visible:!ring-0`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Chat History */}
          <div className="mt-4 flex-1 overflow-y-auto">
            <h3 className={`text-xs font-bold ${theme === 'light' ? 'text-[#3F29C7]' : 'text-[#6A4DFC]'} uppercase tracking-wider mb-2`}>
              Recent Chats
            </h3>
            <div className="space-y-1">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className={`block p-2 rounded-md ${theme === 'light' ? 'text-[#6A4DFC] hover:bg-white' : 'text-white hover:bg-[#6A4DFC]/[30%]'} transition-colors truncate`}
                  >
                    <div className="font-medium text-xs">{chat.title}</div>
                  </Link>
                ))
              ) : (
                <p className={`p-2 text-xs ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`}>
                  No chats found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
