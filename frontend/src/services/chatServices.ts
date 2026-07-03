import api from '@/libs/axios'
import {ConversationResponse, Message} from '@/types/chat'

export const chatService = {
    async fetchConversations(): Promise<ConversationResponse>{
        const res = await api.get("/conversations")
        return res.data
    }
}