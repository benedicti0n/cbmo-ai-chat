import axios from 'axios';
import { Conversation } from '@/stores/useChatHistoryStore';
import { toast } from 'sonner';

export const fetchChatHistory = async (userId: string): Promise<Conversation[]> => {
    try {
        const response = await axios.get(`/api/v1/chat/history?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat history:', error);
        throw error; // Re-throw to allow error handling where the function is called
    }
};

export const deleteChat = async (conversationId: string): Promise<boolean> => {
    try {
        const response = await axios.delete(`/api/v1/chat/deleteConversation?conversationId=${conversationId}`);
        if (response.data?.success) {
            toast.success('Chat deleted successfully');
            return true;
        } else {
            throw new Error(response.data?.error || 'Failed to delete chat');
        }
    } catch (error) {
        console.error('Error deleting chat:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        toast.error(`Error deleting chat: ${errorMessage}`);
        return false;
    }
};
