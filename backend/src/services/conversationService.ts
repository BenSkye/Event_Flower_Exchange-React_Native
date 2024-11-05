import flowerRepository from '~/repository/flowerRepository'
import categoryRepository from '../repository/categoryRepository'
import conversationRepository from '~/repository/conversationRepository';
import { socketManager } from '~/app';
import AppError from '~/utils/appError';
import orderRepository from '~/repository/orderRepository';

class ConversationService {
  static async createConversation(flowerId: string, buyerId: string,) {
    const Flower = await flowerRepository.getFlowerById(flowerId);
    const conversation = {
      flowerId: flowerId,
      buyerId: buyerId,
      sellerId: Flower?.sellerId,
      messages: [],
      status: 'open'
    }
    const hasConversation = await conversationRepository.getOneConversation({ flowerId: flowerId, buyerId: buyerId, sellerId: Flower?.sellerId })
    if (hasConversation) {
      return hasConversation
    }
    const newConversation = await conversationRepository.createConversation(conversation)

    if (!newConversation) {
      throw new AppError('Failed to create conversation', 500)
    }

    return newConversation
  }

  static async getPersonalConversation(userId: string) {
    return await conversationRepository.getUserConversations(userId)
  }

  static async getConversationById(id: string) {
    return await conversationRepository.getConversationById(id)
  }

  static async addMessage(conversationId: string, senderId: string, text: string) {
    const conversation = await conversationRepository.addMessage(conversationId, senderId, text)
    return conversation
  }

  static async createOrderInConversation(conversationId: string, userId: string, price: number) {
    const conversation = await conversationRepository.getConversationById(conversationId)
    //chỉ người bán được tạo order trong conversation
    if (conversation?.sellerId._id.toString() !== userId.toString()) {
      throw new AppError('You are not allowed to create order in this conversation', 400)
    }
    const orderCode = Number(String(Date.now()).slice(-6));

    const newOrder = await orderRepository.createOrder({
      orderCode: orderCode,
      buyerId: conversation.buyerId,
      sellerId: conversation.sellerId,
      flowerId: conversation.flowerId,
      price: price,
      status: 'pending'
    })

    const updateConversation = await conversationRepository.updateConversation(conversationId, { orderId: newOrder._id })
    const updateFlower = await flowerRepository.updateFlower(conversation.flowerId._id.toString(), { fixedPrice: price })
    console.log('updateFlower', updateFlower)
    return updateConversation
  }

  static async cancelOrderInConversation(conversationId: string, userId: string) {
    const conversation = await conversationRepository.getConversationById(conversationId)
    if (conversation?.sellerId.toString() !== userId) {
      throw new AppError('You are not allowed to cancel order in this conversation', 400)
    }
    const updateOrder = orderRepository.updateOrder(conversation.orderId.toString(), { status: 'cancel' })
    const updateFlower = flowerRepository.updateFlower(conversation.flowerId.toString(), { fixedPrice: null })
    const updateConversation = conversationRepository.updateConversation(conversationId, { orderId: null })
    return updateConversation
  }

}
export default ConversationService