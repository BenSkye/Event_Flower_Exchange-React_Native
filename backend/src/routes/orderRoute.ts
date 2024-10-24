import authController from '~/controller/authController'
import { Router } from 'express'
import OrderController from '~/controller/orderController'

const orderRoute = Router()

orderRoute.route('/get-personal-buy-order').get(authController.protect, OrderController.getPersonalBuyOrder)
orderRoute.route('/get-order-by-id/:id').get(authController.protect, OrderController.getOrderbyId);
orderRoute.route('/get-order-by-ordercode/:orderCode').get(authController.protect, OrderController.getOrderbyOrdercode);
export default orderRoute
