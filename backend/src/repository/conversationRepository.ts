import Conversation from "~/models/conversationModel"

class conversationRepository {
  async createConversation(conversation: any) {
    return Conversation.create(conversation)
  }
  async getConversationById(id: string) {
    return Conversation.findById(id).populate('flowerId').populate('buyerId').populate('sellerId').populate('orderId')
  }
  async getUserConversations(userId: string) {
    return await Conversation.find({
      $or: [{ buyerId: userId }, { sellerId: userId }]
    })
      .populate('flowerId')
      .populate('buyerId', 'userName avatar')
      .populate('sellerId', 'userName avatar')
      .sort({ updatedAt: -1 });
  }
  async addMessage(conversationId: string, senderId: string, text: string) {
    return Conversation.findByIdAndUpdate(conversationId, {
      $push: {
        messages: {
          senderId,
          text,
          timestamp: new Date()
        }
      }
    },
      { new: true }
    )
  }
  async getOneConversation(query: any) {
    return Conversation.findOne(query)
  }
  async getConversations(query: any) {
    return Conversation.find(query)
  }
  async updateConversation(conversationId: string, update: any) {
    return Conversation.findByIdAndUpdate(conversationId, update, { new: true }).populate('flowerId').populate('buyerId').populate('sellerId').populate('orderId')
  }
}
export default new conversationRepository()