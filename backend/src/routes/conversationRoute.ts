import userController from '~/controller/userController'
import authController from '~/controller/authController'
import { Router } from 'express'
import ConversationController from '~/controller/conversationController'

const conversationRoute = Router()

conversationRoute.route('/create-conversation/:flowerId').post(authController.protect, authController.restricTO('customer'), ConversationController.createConversation)
conversationRoute.route('/get-personal-conversation').get(authController.protect, ConversationController.getPersonalConversation)
conversationRoute.route('/get-conversation-by-id/:id').get(authController.protect, ConversationController.getConversationById)
export default conversationRoute
