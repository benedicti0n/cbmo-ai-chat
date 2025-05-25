import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type MessageRole = 'user' | 'ai';

export interface ChatMessage {
    id: string;
    content: string;
    role: MessageRole;
    timestamp: Date;
    conversationId?: string;
    userId?: string;
}

export interface Conversation {
    id: string;
    title: string;
    clerkId: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatHistoryState {
    // Current active conversation
    currentConversationId: string | null;

    // All conversations
    conversations: Conversation[];

    // Actions
    setAllConversations: (conversations: Conversation[]) => void;
    setCurrentConversation: (conversationId: string | null) => void;
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
    updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
    deleteMessage: (messageId: string) => void;
    createConversation: (title: string, clerkId: string) => string;
    deleteConversation: (conversationId: string) => void;
    removeConversation: (conversationId: string) => void;
    updateConversationTitle: (conversationId: string, title: string) => void;
    clearAll: () => void;
}

const useChatHistoryStore = create<ChatHistoryState>()(
    persist(
        (set) => ({
            currentConversationId: null,
            conversations: [],

            setAllConversations: (conversations) =>
                set({
                    conversations: conversations.map(conv => ({
                        ...conv,
                        // Ensure clerkId exists, default to empty string if not provided
                        clerkId: conv.clerkId || ''
                    }))
                }),

            setCurrentConversation: (conversationId) =>
                set({ currentConversationId: conversationId }),

            addMessage: (message) => {
                const { conversationId, userId, ...rest } = message;
                const newMessage: ChatMessage = {
                    ...rest,
                    id: crypto.randomUUID(),
                    timestamp: new Date(),
                    conversationId,
                    userId,
                };

                let newConversationId = conversationId;

                set((state) => {
                    // If no conversationId is provided, create a new conversation
                    if (!conversationId) {
                        const newConversation: Conversation = {
                            id: crypto.randomUUID(),
                            title: message.content.slice(0, 30) + (message.content.length > 30 ? '...' : ''),
                            clerkId: userId || '',
                            messages: [newMessage],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        newConversationId = newConversation.id;

                        return {
                            conversations: [...state.conversations, newConversation],
                            currentConversationId: newConversation.id,
                        };
                    }

                    // Update existing conversation
                    const updatedConversations = state.conversations.map((conv) => {
                        if (conv.id === conversationId) {
                            return {
                                ...conv,
                                messages: [...conv.messages, newMessage],
                                updatedAt: new Date(),
                            };
                        }
                        return conv;
                    });

                    return {
                        conversations: updatedConversations,
                        currentConversationId: conversationId,
                    };
                });

                return newConversationId || '';
            },

            updateMessage: (messageId, updates) => {
                set((state) => ({
                    conversations: state.conversations.map((conv) => ({
                        ...conv,
                        messages: conv.messages.map((msg) =>
                            msg.id === messageId ? { ...msg, ...updates } : msg
                        ),
                        updatedAt: new Date(),
                    })),
                }));
            },

            deleteMessage: (messageId) => {
                set((state) => ({
                    conversations: state.conversations.map((conv) => ({
                        ...conv,
                        messages: conv.messages.filter((msg) => msg.id !== messageId),
                        updatedAt: new Date(),
                    })),
                }));
            },

            createConversation: (title, clerkId) => {
                const newConversation: Conversation = {
                    id: crypto.randomUUID(),
                    title,
                    clerkId,
                    messages: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                set((state) => ({
                    conversations: [...state.conversations, newConversation],
                    currentConversationId: newConversation.id,
                }));
                return newConversation.id;
            },

            deleteConversation: (conversationId) => {
                set((state) => ({
                    conversations: state.conversations.filter(
                        (conv) => conv.id !== conversationId
                    ),
                    currentConversationId:
                        state.currentConversationId === conversationId
                            ? null
                            : state.currentConversationId,
                }));
            },
            removeConversation: (conversationId) => {
                set((state) => ({
                    conversations: state.conversations.filter(
                        (conv) => conv.id !== conversationId
                    ),
                    currentConversationId:
                        state.currentConversationId === conversationId
                            ? null
                            : state.currentConversationId,
                }));
            },

            updateConversationTitle: (conversationId, title) => {
                set((state) => ({
                    conversations: state.conversations.map((conv) =>
                        conv.id === conversationId
                            ? { ...conv, title, updatedAt: new Date() }
                            : conv
                    ),
                }));
            },

            clearAll: () => {
                set({
                    conversations: [],
                    currentConversationId: null,
                });
            },
        }),
        {
            name: 'chat-history-storage',
            storage: createJSONStorage(() => localStorage),
            // Only persist the conversations and current conversation ID
            partialize: (state) => ({
                conversations: state.conversations,
                currentConversationId: state.currentConversationId,
            }),
        }
    )
);

export default useChatHistoryStore;
