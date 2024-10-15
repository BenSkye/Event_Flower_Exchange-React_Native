import authController from '~/controller/authController'
import { Router } from 'express'
import NotificationController from '~/controller/notificationController'

const notificationRoute = Router()

notificationRoute.route('/get-personal-notification').get(authController.protect, NotificationController.getPersonalNotification)
export default notificationRoute
