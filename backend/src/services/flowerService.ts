import flowerRepository from "~/repository/flowerRepository"
import AuctionService from "~/services/auctionService"
import { roundToStartOfDay } from "~/utils";
import AppError from "~/utils/appError"
import { parseISO, isAfter, isBefore } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';

class FlowerService {
  static async createFlower(userId: string, flower: any) {
    console.log('flower', flower)
    const timeZone = 'Asia/Ho_Chi_Minh';
    const currentTime = toZonedTime(new Date(), timeZone);
    let startTime;
    let endTime;
    //
    if (flower.saleType === 'auction') {
      startTime = toZonedTime(parseISO(flower?.startTime), timeZone);
      endTime = toZonedTime(parseISO(flower?.endTime), timeZone);
      console.log('currentTime', currentTime)
      console.log('startTime', startTime)
      console.log('endTime', endTime)

      console.log('currentTime', format(currentTime, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone }));
      console.log('startTime', format(startTime, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone }));
      console.log('endTime', format(endTime, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone }));

      if (!(isAfter(startTime, currentTime) && isBefore(startTime, endTime))) {
        throw new AppError('Invalid time', 400);
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
          startTime: startTime,
          endTime: endTime,
          isBuyNow: true
        }
        await AuctionService.createAuction(auction)
      } else {
        const auction = {
          sellerId: userId,
          flowerId: newFlower._id,
          startingPrice: flower.startingPrice,
          startTime: startTime,
          endTime: endTime
        }
        await AuctionService.createAuction(auction)
      }
    }
    return newFlower
  }
  static async getListFlower(page: number, limit: number, name: any) {
    const query = {
      name: { $regex: name, $options: 'i' },
      status: { $nin: ['unavailable', 'sold'] }
    };
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
  static async getFlowerBySellerId(sellerId: string) {
    return flowerRepository.getFlowerBySellerId(sellerId)
  }
  static async deleteFlower(flowerId: string) {
    return flowerRepository.deleteFlower(flowerId)
  }
}
export default FlowerService