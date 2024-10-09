import authController from '~/controller/authController'
import { Router } from 'express'
import AuctionController from '~/controller/auctionController'

const auctionRoute = Router()

auctionRoute.route('/bid').post(authController.protect, authController.restricTO('customer'), AuctionController.bidAuction)
auctionRoute.route('/get-by-flowerId/:flowerId').get(AuctionController.getAuctionByFlowerId)
auctionRoute.route('/active-auction/:auctionId').put(authController.protect, authController.restricTO('customer'), AuctionController.activeAuction)
auctionRoute.route('/get-personal-bid').get(authController.protect, authController.restricTO('customer'), AuctionController.getPersonalBid)
export default auctionRoute
