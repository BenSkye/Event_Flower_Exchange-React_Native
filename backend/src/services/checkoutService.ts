import auctionRepository from "~/repository/auctionRepository";
import flowerRepository from "~/repository/flowerRepository";
import orderRepository from "~/repository/orderRepository";
import FlowerService from "~/services/flowerService";
import notificationService from "~/services/notificationService";
import OrderService from "~/services/orderService";
import { createPaymentLink } from "~/services/payOsService";
import { convertToObjectID } from "~/utils";
import AppError from "~/utils/appError";

class CheckoutService {

  static async CheckoutFixedFlower(userId: string, flowerId: string, delivery: any) {
    //tạo order với flowerId
    console.log('flowerId', flowerId)
    const flower = await flowerRepository.getFlowerById(flowerId);
    console.log('flower', flower)
    if (!flower || flower.status !== 'available' || flower.saleType === 'auction') {
      throw new AppError('Flower is not available', 404);
    }
    const orderCode = Number(String(Date.now()).slice(-6))
    const order = {
      orderCode: orderCode,
      buyerId: userId,
      sellerId: flower.sellerId._id,
      flowerId: flowerId,
      price: flower.fixedPrice,
      delivery: delivery
    }
    const newOrder = await OrderService.createOrder(order)
    //tạo payment link với orderCode
    if (!newOrder) {
      throw new AppError('Create order failed', 404);
    }

    const paymentLink = await createPaymentLink(newOrder.orderCode, newOrder.price, flower.name, 'handle-payos-cancel', 'handle-payos-return')
    return paymentLink
  }

  static async CheckoutBuyNowAuction(userId: string, auctionId: string, delivery: any) {
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
      price: auction.buyNowPrice,
      auctionId: auctionId,
      delivery: delivery
    });
    console.log('newOrder', newOrder)

    const paymentLink = await createPaymentLink(newOrder.orderCode, newOrder.price, 'Thanh toán mua ngay', 'handle-buy-now-auction-payos-cancel', 'handle-buy-now-auction-payos-return')
    console.log('paymentLink', paymentLink)
    return paymentLink
  }


  static async getPayosCancelBuyNowAuction(reqQuery: any) {
    const deleteOrder = await orderRepository.deleteOrder({ orderCode: reqQuery.orderCode })
    return null
  }


  static async getPayosReturnBuyNowAuction(reqQuery: any) {
    if (reqQuery.code === '00') {
      const updateOrder = await orderRepository.updateOrder({ orderCode: reqQuery.orderCode }, { status: 'completed' })
      if (!updateOrder) {
        throw new AppError('Update order failed', 400)
      }
      const auction = await auctionRepository.getAuctionById(updateOrder.auctionId?.toString() ?? '')
      if (!auction) {
        throw new AppError('Auction not found', 404)
      }
      auction.buyNowUser = convertToObjectID(updateOrder.buyerId.toString());
      auction.status = 'sold'
      auction.winner = convertToObjectID(updateOrder.buyerId.toString())
      const updateAuction = await auctionRepository.updateAuction(auction._id.toString(), auction)
      if (!updateAuction) {
        throw new AppError('Update auction failed', 400)
      }
      const updateFlower = await flowerRepository.updateFlower(updateAuction.flowerId.toString(), { status: 'sold' })
      if (!updateFlower) {
        throw new AppError('Update flower failed', 400)
      }
      return updateOrder
    } else {
      //xóa order 
      const deleteOrder = await orderRepository.deleteOrder({ orderCode: reqQuery.orderCode })
      return null
    }

  }

  static async getPayosReturn(reqQuery: any) {
    console.log('reqQueryPayosReturn:::', reqQuery);
    if (reqQuery.code === '00') {
      //update status order thành completed

      const updateOrder = await orderRepository.updateOrder({ orderCode: reqQuery.orderCode }, { status: 'completed' })

      const updateFlower = await FlowerService.updateFlower(updateOrder.flowerId.toString(), { status: 'sold' })
      console.log('updateFlower', updateFlower)

      if (!updateFlower) {
        throw new AppError('Update flower failed', 404);
      }
      //gửi thông báo cho seller
      const notification = await notificationService.createNotification(updateOrder.sellerId.toString(), 'Hoa được bán', 'Bạn đã bán được hoa ' + updateFlower.name + ' với giá ' + updateOrder.price, { orderId: updateOrder._id, flowerId: updateFlower._id, orderCode: updateOrder.orderCode }, 'order-success')
      return updateOrder
    } else {
      //xóa order 
      const deleteOrder = await orderRepository.deleteOrder({ orderCode: reqQuery.orderCode })
      return null
    }
  }

  static async getPayosCancel(reqQuery: any) {
    console.log('reqQueryPayosCancel:::', reqQuery);
    const deleteOrder = await orderRepository.deleteOrder({ orderCode: reqQuery.orderCode })
    return null
  }

}
export default CheckoutService