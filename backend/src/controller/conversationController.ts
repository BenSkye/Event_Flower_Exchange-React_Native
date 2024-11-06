import { Request, Response } from 'express';
import ConversationService from '../services/conversationService';
import catchAsync from '~/utils/catchAsync';

class ConversationController {
  static createConversation = catchAsync(async (req: any, res: any, next: any) => {
    const { flowerId } = req.params;
    const conversation = await ConversationService.createConversation(flowerId, req.user._id)
    res.status(200).json(conversation)
  })

  static getPersonalConversation = catchAsync(async (req: any, res: any, next: any) => {
    const conversations = await ConversationService.getPersonalConversation(req.user._id)
    res.status(200).json(conversations)
  })

  static getConversationById = catchAsync(async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const conversation = await ConversationService.getConversationById(id)
    res.status(200).json(conversation)
  })

}

export default ConversationController;