import auctionRepository from "~/repository/auctionRepository";
import flowerRepository from "~/repository/flowerRepository";
import orderRepository from "~/repository/orderRepository";
import userRepository from "~/repository/userRepository";
import notificationService from "~/services/notificationService";
import { convertToObjectID } from "~/utils";
import AppError from "~/utils/appError";


class AuctionService {
  static async createAuction(auction: any) {
    return await auctionRepository.createAuction(auction)
  }

  static async getAuctionByFlowerId(flowerId: string) {
    const auctions = await auctionRepository.getAuctionByFlowerId(flowerId)
    console.log('auctions', auctions)
    return auctions
  }

  static async getAuctionById(id: string) {
    return await auctionRepository.getAuctionById(id)
  }

  static async activeAuction(auctionId: string, userId: string) {
    const auction = await auctionRepository.getAuctionById(auctionId)
    if (!auction || auction.sellerId.toString() !== userId) {
      throw new AppError('Auction not found', 400)
    }
    return await auctionRepository.updateAuction(auctionId, { status: 'active' })
  }

  static async bidAuction(auctionId: string, userId: string, amount: number) {
    const auction = await auctionRepository.getAuctionById(auctionId)
    if (!auction) {
      throw new AppError('Auction not found', 404)
    }
    if (auction.sellerId.toString() === userId) {
      throw new AppError('You are the seller of this auction', 400)
    }
    if (auction.status !== 'active') {
      throw new AppError('Auction is not active', 400)
    }
    if (auction.currentPrice) {
      if (amount <= auction.currentPrice) {
        throw new AppError('Bid amount must be greater than current price', 400)
      }
    }
    if (auction.startingPrice > amount) {
      throw new AppError('Bid amount must be greater than starting price', 400)
    }
    const currentTime = new Date();
    console.log('currentTime', currentTime)
    auction.bids.push({ bidder: userId, amount, time: currentTime })
    auction.currentPrice = amount
    const updateAuction = await auctionRepository.updateAuction(auctionId, auction)
    const userRepositoryInstance = new userRepository();
    const user = await userRepositoryInstance.findUser({ _id: userId }, ['userName']);
    const flower = await flowerRepository.getFlowerById(auction.flowerId.toString())
    notificationService.createNotification(auction.sellerId.toString(), 'Đặt giá mới', `${user?.userName} đã đặt giá ${amount} cho ${flower?.name}`, { auctionId: auction?._id, flowerId: flower?._id }, 'new-auction-bid')
    return updateAuction
  }

  static async checkoutBuyNowAuction(auctionId: string, userId: string) {
    const auction = await auctionRepository.getAuctionById(auctionId)
    if (!auction) {
      throw new AppError('Auction not found', 404)
    }
    if (auction.sellerId.toString() === userId) {
      throw new AppError('You are the seller of this auction', 400)
    }
    if (auction.status !== 'active') {
      throw new AppError('Auction is not active', 400)
    }
    //thực hiện cấu hình thanh toán

  }

  static async buyNowAuction(auctionId: string, userId: string) {
    const auction = await auctionRepository.getAuctionById(auctionId)
    if (!auction) {
      throw new AppError('Auction not found', 404)
    }
    if (auction.sellerId.toString() === userId) {
      throw new AppError('You are the seller of this auction', 400)
    }
    if (auction.status !== 'active') {
      throw new AppError('Auction is not active', 400)
    }
    if (auction.isBuyNow !== true) {
      throw new AppError('Auction is not buy now', 400)
    }
    auction.buyNowUser = convertToObjectID(userId)
    auction.status = 'sold'
    auction.winner = convertToObjectID(userId)
    const updateAuction = await auctionRepository.updateAuction(auctionId, auction)
    if (!updateAuction) {
      throw new AppError('Update auction failed', 400)
    }
    const updateFlower = await flowerRepository.updateFlower(updateAuction.flowerId.toString(), { status: 'sold' })
    if (!updateFlower) {
      throw new AppError('Update flower failed', 400)
    }
    return {
      auction: updateAuction,
      flower: updateFlower
    }
  }

  static async getPersonalBid(userId: string) {
    return await auctionRepository.getPersonalBid(userId)
  }

  static async endTimeAuction() {
    const currentTime = new Date();
    const endedAuctions = await auctionRepository.getAuctions({
      status: 'active',
      endTime: { $lte: currentTime }
    });
    const updatePromises = endedAuctions.map(async (auction: any) => {
      // Tìm người đặt giá cao nhất
      const highestBid = auction.bids.find((bid: any) => bid.amount === auction.currentPrice)

      const updateData: any = {
        status: 'ended'
      };

      // Nếu có người thắng, cập nhật winner
      if (highestBid.bidder) {
        updateData.winner = highestBid.bidder;
      }

      // Cập nhật auction
      const updatedAuction = await auctionRepository.updateAuction(auction._id, updateData);

      // Cập nhật trạng thái của hoa
      await flowerRepository.updateFlower(auction.flowerId, {
        status: highestBid.bidder ? 'sold' : 'available'
      });

      // Nếu có người thắng, tạo order
      if (updatedAuction) {
        await orderRepository.createOrder({
          buyerId: updatedAuction.winner,
          sellerId: updatedAuction.sellerId,
          flowerId: updatedAuction.flowerId,
          price: updatedAuction.currentPrice,
          status: 'pending_payment'
        });
      }
      return updatedAuction;
    });
    const updatedAuctions = await Promise.all(updatePromises);
    return updatedAuctions;
  }
}
export default AuctionService