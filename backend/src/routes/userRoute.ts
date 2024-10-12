import { Router } from 'express'
import userController from '~/controller/userController'
import authController from '~/controller/authController'

const userRoute = Router()

userRoute.route('/update').put(authController.protect, userController.updateUser)
userRoute.route('/check-email-exist').post(userController.checkEmailExist)
userRoute.route('/personal-information').get(authController.protect, userController.getPersonal)
userRoute.route('/admin/manage_people').get(userController.getAllUser)
userRoute.route('/check-phone-exist').get(authController.protect, userController.checkPhoneExist)
userRoute.route('/update-phone').put(authController.protect, userController.updatePhone)
userRoute.route('/update-push-token').put(authController.protect, userController.updatePushToken)
userRoute.route('/').get(userController.getAllUser)
export default userRoute
