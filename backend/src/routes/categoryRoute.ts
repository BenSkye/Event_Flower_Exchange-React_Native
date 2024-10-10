import userController from '~/controller/userController'
import authController from '~/controller/authController'
import { Router } from 'express'
import CategoryController from '~/controller/categoryController'

const categoryRoute = Router()

categoryRoute.route('/').get(CategoryController.getCategory)
categoryRoute.route('/create').post(authController.protect, authController.restricTO('admin'), CategoryController.createCategory)
export default categoryRoute
