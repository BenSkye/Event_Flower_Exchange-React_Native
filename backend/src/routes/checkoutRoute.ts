import authController from '~/controller/authController'
import { Router } from 'express'
import CheckoutController from '~/controller/checkoutController'

const checkoutRoute = Router()

checkoutRoute.route('/checkout-fixed-flower').post(authController.protect, CheckoutController.checkoutFixedFlower)
checkoutRoute.route('/handle-payos-return').get(CheckoutController.handlePayosReturn)
checkoutRoute.route('/handle-payos-cancel').get(CheckoutController.handlePayosCancel)
checkoutRoute.route('/checkout-buy-now-auction').post(authController.protect, CheckoutController.checkoutBuyNowAuction)
checkoutRoute.route('/handle-buy-now-auction-payos-return').get(CheckoutController.handleBuyNowAuctionPayosReturn)
checkoutRoute.route('/handle-buy-now-auction-payos-cancel').get(CheckoutController.handleBuyNowAuctionPayosCancel)
export default checkoutRoute
