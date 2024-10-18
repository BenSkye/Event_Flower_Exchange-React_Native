import authController from '~/controller/authController'
import { Router } from 'express'
import OrderController from '~/controller/orderController'

const orderRoute = Router()

orderRoute.route('/get-personal-buy-order').get(authController.protect, OrderController.getPersonalBuyOrder)
export default orderRoute
