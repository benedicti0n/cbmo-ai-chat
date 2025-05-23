'use client';

import { useState } from 'react';
import { Plus, Search, PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useThemeStore } from '@/stores/useThemeStore';

type ChatHistoryItem = {
  id: string;
  title: string;
  date: string;
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useThemeStore();

  // Mock chat history data - replace with your actual data
  const [chatHistory] = useState<ChatHistoryItem[]>([
    { id: '1', title: 'Chat about project requirements', date: '2023-05-22' },
    { id: '2', title: 'Discuss new features', date: '2023-05-21' },
    { id: '3', title: 'Bug fixes discussion', date: '2023-05-20' },
  ]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Sidebar Toggle Button */}
      <Button
        onClick={toggleSidebar}
        className={`${theme === 'light' ? '' : ''} fixed top-4 left-4 z-[60] p-2 mt-1 rounded-md hover:bg-[#6A4DFC]/30 dark:hover:bg-[#6A4DFC]/30 transition-colors`}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className={`${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`} style={{ width: '20px', height: '20px' }} />
      </Button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 transform transition-transform duration-100 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:fixed md:transition-transform md:duration-100`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-center items-center mb-4 mt-1">
            <div className="w-32 h-8 relative">
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="logo" className="w-6 h-6" />
                <p className={`ml-2 font-michroma text-sm ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`}>CBMO AI</p>
              </div>
            </div>
          </div>

          <Button variant="default" className="w-full">
            <Plus className="w-5 h-5" />
            New Chat
          </Button>


          {/* Search Chats */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              <Search className={`${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`} style={{ width: '16px', height: '16px' }} />
            </div>
            <input
              type="text"
              placeholder="Search your chats"
              className={`w-full pl-8 pr-4 py-2 focus:outline-none text-sm ${theme === 'light' ? 'bg-transparent border-b border-[#6A4DFC] placeholder:text-[#6A4DFC]' : 'bg-transparent border-b border-[#6A4DFC] placeholder:text-gray-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Chat History */}
          <div className="mt-4 flex-1 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
              Recent Chats
            </h3>
            <div className="space-y-1">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors truncate"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="font-medium">{chat.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(chat.date).toLocaleDateString()}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
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
