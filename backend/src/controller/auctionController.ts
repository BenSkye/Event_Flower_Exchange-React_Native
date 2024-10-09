import AuctionService from "~/services/auctionService"
import catchAsync from "~/utils/catchAsync"

class AuctionController {
  static bidAuction = catchAsync(async (req: any, res: any, next: any) => {
    const { auctionId, amount } = req.body
    const auction = await AuctionService.bidAuction(auctionId, req.user.id, amount)
    res.status(200).json(auction)
  })
  static activeAuction = catchAsync(async (req: any, res: any, next: any) => {
    const { auctionId } = req.params
    const auction = await AuctionService.activeAuction(auctionId, req.user.id)
    res.status(200).json(auction)
  })
  static getPersonalBid = catchAsync(async (req: any, res: any, next: any) => {
    const auction = await AuctionService.getPersonalBid(req.user.id)
    res.status(200).json(auction)
  })
  static getAuctionByFlowerId = catchAsync(async (req: any, res: any, next: any) => {
    const auction = await AuctionService.getAuctionByFlowerId(req.params.flowerId)
    res.status(200).json(auction)
  })
}
export default AuctionController