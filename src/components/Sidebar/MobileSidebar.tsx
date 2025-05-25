'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, PanelLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useThemeStore } from '@/stores/useThemeStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import useChatHistoryStore, { Conversation } from '@/stores/useChatHistoryStore';
import { CustomModal } from '../ui/CustomModal';
import { deleteAllChats, deleteChat, fetchChatHistory } from '@/utils/chatUtils';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { TrashIcon } from 'lucide-react';

export default function MobileSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { conversations, createConversation, setAllConversations, removeConversation } = useChatHistoryStore();
  const { isOpen, toggleSidebar, setOpen } = useSidebarStore();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useThemeStore();
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  // Memoize filtered conversations to prevent unnecessary recalculations
  const filteredConversations = useMemo(() =>
    (conversations as Conversation[])
      .filter((conv: Conversation) =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort(
        (a: Conversation, b: Conversation) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ) as Conversation[],
    [conversations, searchQuery]
  );

  const handleNewChat = async () => {
    try {
      if (!userId) return;
      setIsLoading(true);
      const newConversationId = createConversation('New Chat', userId);
      // Refresh the conversations list from the server
      const response = await fetch(`/api/v1/chat/history?userId=${userId}`);
      const data = await response.json();
      setAllConversations(data);
      setOpen(false);
      router.push(`/chat/${newConversationId}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setChatToDelete(chatId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteChat = async () => {
    if (!chatToDelete) return;
    try {
      const success = await deleteChat(chatToDelete);
      if (success && userId) {
        // Remove the conversation from the UI immediately
        removeConversation(chatToDelete);
        toast.success('Chat deleted successfully');

        // Refresh the full list from the server
        try {
          const updatedConversations = await fetchChatHistory(userId);
          setAllConversations(updatedConversations);
        } catch (error) {
          console.error('Error refreshing conversations:', error);
          toast.error('Failed to refresh chat list');
        }
      } else {
        toast.error('Failed to delete chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    } finally {
      setIsDeleteModalOpen(false);
      setChatToDelete(null);
    }
  };

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

  return (
    <>
      {/* Sidebar Toggle Button */}
      <div className={`fixed top-4 left-4 z-[60] flex items-center justify-center gap-2 backdrop-blur-md ${isOpen ? 'p-0' : 'p-2 rounded-xl border border-[#6A4DFC]'} ${theme === 'light' ? 'bg-[#E1DBFE]' : 'bg-[#231E40]'}`}>
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
              onClick={handleNewChat}
              variant="ghost"
              className={`p-2 rounded-md hover:bg-[#6A4DFC]/30 dark:hover:bg-[#6A4DFC]/30 transition-colors`}
              aria-label="Toggle theme"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className={`${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`} style={{ width: '16px', height: '16px' }} />}
            </Button>
          </div>
        )}
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-60 transform transition-transform duration-100 ease-in-out z-[60] 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${theme === 'light' ? 'bg-[#E1DBFE]' : 'bg-[#231E40]'} 
        md:fixed md:transition-transform md:duration-100 sidebar-container`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-full h-full flex flex-col items-center justify-center`}>
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

            <Button variant="default" className="w-full flex items-center gap-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span className="text-xs">New Chat</span>
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
                  filteredConversations.map((chat: Conversation) => (
                    <Link
                      key={chat.id}
                      href={`/chat/${chat.id}`}
                      className={`block p-2 rounded-md ${theme === 'light' ? 'text-[#6A4DFC] hover:bg-[#6A4DFC]/[10%]' : 'text-white hover:bg-[#6A4DFC]/[10%]'} transition-colors truncate flex items-center justify-between`}
                    >
                      <div className="font-medium text-xs">{chat.title}</div>
                      <TrashIcon
                        onClick={(e) => handleDeleteClick(e, chat.id)}
                        className="text-red-400 cursor-pointer hover:text-red-500 transition-colors duration-100 ease-in-out"
                        style={{ width: '12px', height: '12px' }}
                      />
                    </Link>
                  ))
                ) : (
                  <p className={`p-2 text-xs ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`}>
                    No chats found
                  </p>
                )}
              </div>
            </div>
            {userId && (
              <Button
                variant="ghost"
                onClick={() => deleteAllChats(userId)}
                className={`flex items-center justify-center gap-2 text-sm ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`}
              >
                <TrashIcon className={`text-[#6A4DFC] cursor-pointer transition-colors duration-100 ease-in-out ${theme === 'light' ? 'text-[#6A4DFC]' : 'text-white'}`} style={{ width: '16px', height: '16px' }} />
                Delete All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setChatToDelete(null);
        }}
        onConfirm={handleDeleteChat}
        title="Delete Chat"
        description="Are you sure you want to delete this chat? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        theme={theme}
      />
    </>
  );
}
