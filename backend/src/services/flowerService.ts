import flowerRepository from "~/repository/flowerRepository"
import AuctionService from "~/services/auctionService"
import { roundToStartOfDay } from "~/utils";
import AppError from "~/utils/appError"

class FlowerService {
  static async createFlower(userId: string, flower: any) {
    if (flower.saleType === 'auction') {
      const currentTime = roundToStartOfDay(new Date());
      const startTime = new Date(flower.startTime);
      const endTime = new Date(flower.endTime);

      console.log('currentTime', currentTime)
      console.log('startTime', startTime)
      console.log('endTime', endTime)
      if (!(currentTime <= startTime && startTime < endTime)) {
        throw new AppError('Invalid time', 400)
      }
      flower = { ...flower, sellerId: userId, status: 'in_auction' }
    } else {
      flower = { ...flower, sellerId: userId, status: 'available' }
    }
    const newFlower = await flowerRepository.createFlower(flower)
    if (flower.saleType === 'auction') {
      if (flower.isBuyNow) {
        const auction = {
          sellerId: userId,
          flowerId: newFlower._id,
          startingPrice: flower.startingPrice,
          buyNowPrice: flower.buyNowPrice,
          startTime: flower.startTime,
          endTime: flower.endTime,
          isBuyNow: true
        }
        await AuctionService.createAuction(auction)
      } else {
        const auction = {
          sellerId: userId,
          flowerId: newFlower._id,
          startingPrice: flower.startingPrice,
          startTime: flower.startTime,
          endTime: flower.endTime
        }
        await AuctionService.createAuction(auction)
      }
    }
    return newFlower
  }
  static async getListFlower(page: number, limit: number, name: any) {
    const query = { name: { $regex: name, $options: 'i' } };
    const flowers = await flowerRepository.getFlowers((page - 1) * limit, limit, query)
    console.log('flowers', flowers)
    return flowers
  }
  static async getFlowerById(flowerId: string) {
    return flowerRepository.getFlowerById(flowerId)
  }
  static async updateFlower(flowerId: string, flower: any) {
    return flowerRepository.updateFlower(flowerId, flower)
  }
}
export default FlowerService