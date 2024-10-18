import authController from '~/controller/authController'
import { Router } from 'express'
import AddressController from '~/controller/addressController'

const addressRoute = Router()

addressRoute.route('/get-personal-address').get(authController.protect, AddressController.getAddressByUserId)
addressRoute.route('/add-address').put(authController.protect, AddressController.addAddress)
export default addressRoute
