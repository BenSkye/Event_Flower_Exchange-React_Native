import { Router } from 'express'

import authController from '~/controller/authController'
const authRoute = Router()

authRoute.route('/register').post(authController.registerUser)
authRoute.route('/login').post(authController.loginUser)
authRoute.route('/google').post(authController.googleLogin)
authRoute.route('/change-password').patch(authController.protect, authController.changePassword)

export default authRoute
