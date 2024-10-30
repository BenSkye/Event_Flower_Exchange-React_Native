import userController from '~/controller/userController'
import authController from '~/controller/authController'
import { Router } from 'express'
import FlowerController from '~/controller/flowerController'

const flowerRoute = Router()

flowerRoute.route('/create').post(authController.protect, authController.restricTO('customer'), FlowerController.createFlower)
flowerRoute.route('/get-list').get(FlowerController.getListFlower)
flowerRoute.route('/get-flower-by-id/:flowerId').get(FlowerController.getFlowerById)
flowerRoute.route('/update/:flowerId').put(authController.protect, authController.restricTO('customer'), FlowerController.updateFlower)
flowerRoute.route('/delete/:flowerId').delete(authController.protect, authController.restricTO('customer'), FlowerController.deleteFlower)
flowerRoute.route('/get-flower-by-seller-id').get(authController.protect, authController.restricTO('customer'), FlowerController.getFlowerBySellerId)
export default flowerRoute
