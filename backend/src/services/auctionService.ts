import auctionRepository from "~/repository/auctionRepository";
import flowerRepository from "~/repository/flowerRepository";
import orderRepository from "~/repository/orderRepository";
import userRepository from "~/repository/userRepository";
import notificationService from "~/services/notificationService";
import OrderService from "~/services/orderService";
import { convertToISOString, convertToObjectID } from "~/utils";
import AppError from "~/utils/appError";
import { parseISO, isAfter, isBefore } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';


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
    for (const bidder of auction.bids) {
      if (bidder.bidder && bidder.bidder.toString() !== userId) {
        notificationService.createNotification(bidder.bidder.toString(), 'Đặt giá mới', `${user?.userName} đã đặt giá ${amount} cho ${flower?.name}`, { auctionId: auction?._id, flowerId: flower?._id }, 'new-auction-bid')
      }
    }
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
    if (auction.isBuyNow !== true) {
      throw new AppError('Auction is not buy now', 400)
    }
    //thực hiện cấu hình order
    // lấy ngày giờ hiện tại để generate orderCode với orderCode là number
    const orderCode = Number(String(Date.now()).slice(-6));
    const newOrder = await OrderService.createOrder({
      orderCode: orderCode,
      buyerId: userId,
      sellerId: auction.sellerId,
      flowerId: auction.flowerId,
      price: auction.buyNowPrice
    });

    //thực hiện update auction và flower
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
  }

  static async getPersonalBid(userId: string) {
    return await auctionRepository.getPersonalBid(userId)
  }

  static async endTimeStartTimeAuction() {
    const timeZone = 'Asia/Ho_Chi_Minh';
    const currentTime = toZonedTime(new Date(), timeZone);
    console.log('currentTime', currentTime)
    console.log('currentTime', format(currentTime, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone }));

    const endedAuctions = await auctionRepository.getAuctions({
      status: { $in: ['active', 'pending'] },
      endTime: { $lte: currentTime }
    });

    const updatePromises = endedAuctions.map(async (auction: any) => {
      const updateData: any = {
        status: 'ended'
      };
      if (auction.bids.length > 0) {
        // Tìm người đặt giá cao nhất
        const highestBid = auction.bids.find((bid: any) => bid.amount === auction.currentPrice)
        // Nếu có người thắng, cập nhật winner
        if (highestBid.bidder) {
          updateData.winner = highestBid.bidder;
        }
        // Cập nhật trạng thái của hoa
        await flowerRepository.updateFlower(auction.flowerId, {
          status: highestBid.bidder ? 'sold' : 'available'
        });
      }
      // Cập nhật auction
      const updatedAuction = await auctionRepository.updateAuction(auction._id, updateData);

      // Nếu có người thắng, tạo order
      const currentTime = new Date();
      const orderCode = currentTime.getTime();
      if (updatedAuction && updatedAuction.winner) {
        await orderRepository.createOrder({
          orderCode: orderCode,
          buyerId: updatedAuction.winner,
          sellerId: updatedAuction.sellerId,
          flowerId: updatedAuction.flowerId,
          price: updatedAuction.currentPrice,
          status: 'pending'
        });
      }
      // gửi thông báo tới người thắng

      return updatedAuction;
    });
    const updatedAuctions = await Promise.all(updatePromises);

    const startAuctions = await auctionRepository.getAuctions({
      status: 'pending',
      startTime: { $lte: currentTime }
    });


    const updatePromisesStart = startAuctions.map(async (auction: any) => {
      const updateData: any = {
        status: 'active'
      };
      const updatedAuction = await auctionRepository.updateAuction(auction._id, updateData);
      return updatedAuction;
    });
    const updatedAuctionsStart = await Promise.all(updatePromisesStart);

    return { updatedAuctions, updatedAuctionsStart };
  }


}
export default AuctionService