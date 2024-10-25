import CheckoutService from "~/services/checkoutService"
import catchAsync from "~/utils/catchAsync"

class CheckoutController {
  static checkoutFixedFlower = catchAsync(async (req: any, res: any, next: any) => {
    const paymentLink = await CheckoutService.CheckoutFixedFlower(req.user._id, req.body.flowerId, req.body.delivery)
    console.log('paymentLink', paymentLink)
    res.status(200).json(paymentLink)
  })

  static checkoutBuyNowAuction = catchAsync(async (req: any, res: any, next: any) => {
    const paymentLink = await CheckoutService.CheckoutBuyNowAuction(req.user._id, req.body.auctionId, req.body.delivery)
    res.status(200).json(paymentLink)
  })

  static handlePayosReturn = catchAsync(async (req: any, res: any, next: any) => {
    const updateOrder = await CheckoutService.getPayosReturn(req.query)
    res.status(200).json(updateOrder)
  })

  static handlePayosCancel = catchAsync(async (req: any, res: any, next: any) => {
    const deleteOrder = await CheckoutService.getPayosCancel(req.query)
    res.status(200).json(deleteOrder)
  })

  static handleBuyNowAuctionPayosReturn = catchAsync(async (req: any, res: any, next: any) => {
    const updateOrder = await CheckoutService.getPayosReturnBuyNowAuction(req.query)
    res.status(200).json(updateOrder)
  })

  static handleBuyNowAuctionPayosCancel = catchAsync(async (req: any, res: any, next: any) => {
    const deleteOrder = await CheckoutService.getPayosCancelBuyNowAuction(req.query)
    res.status(200).json(deleteOrder)
  })




}
export default CheckoutController