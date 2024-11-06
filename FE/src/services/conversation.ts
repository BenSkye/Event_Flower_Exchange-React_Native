import apiClient from "./api"

const createConversation = async (flowerId: string) => {
    try {
        const response = await apiClient.post(`/conversation/create-conversation/${flowerId}`)
        return response.data
    } catch (error) {
        return error
    }
}

const getConversationById = async (conversationId: string) => {
    try {
        const response = await apiClient.get(`/conversation/get-conversation-by-id/${conversationId}`)
        return response.data
    } catch (error) {
        return error
    }
}

const getPersonalConversation = async () => {
    try {
        const response = await apiClient.get(`/conversation/get-personal-conversation`)
        return response.data
    } catch (error) {
        return error
    }
}

export { createConversation, getConversationById, getPersonalConversation }
