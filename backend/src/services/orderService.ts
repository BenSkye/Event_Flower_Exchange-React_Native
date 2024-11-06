import { toZonedTime, format } from "date-fns-tz";
import auctionRepository from "~/repository/auctionRepository";
import orderRepository from "~/repository/orderRepository";


class OrderService {
  static async createOrder(order: any) {
    const newOrder = await orderRepository.createOrder({
      orderCode: order.orderCode,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      flowerId: order.flowerId,
      price: order.price,
      delivery: order.delivery
    });
    return newOrder;
  }


  static async changeOrderStatus(orderId: string, status: string) {
    const updateOrder = await orderRepository.updateOrder({ _id: orderId }, { status: status })
    return updateOrder
  }

  static async getPersonalOrderByBuyerId(userId: string) {
    const orders = await orderRepository.findOrder({ buyerId: userId }, [])
    console.log('orders', orders)
    return orders
  }

  static async getPersonalOrderBySellerId(userId: string) {
    const orders = await orderRepository.findOrder({ sellerId: userId }, [])
    return orders
  }
  static async getOrderById(orderId: string) {
    const order = await orderRepository.findOrderById(orderId, [])
    return order
  }
  static async getOrderbyOrdercode(orderCode: string) {
    const order = await orderRepository.findOneOrder({ orderCode: orderCode }, [])
    return order
  }


  static async endTimeOrder() {
    const timeZone = 'Asia/Ho_Chi_Minh';
    //lấy currentTime là time của 1 tiếng trước
    const currentTime = toZonedTime(new Date(Date.now() - 1 * 60 * 60 * 1000), timeZone);
    console.log('currentTime', currentTime)
    console.log('currentTime', format(currentTime, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone }));

    const endOrders = await orderRepository.findOrder({
      status: { $in: ['pending'] },
      createdAt: { $lte: currentTime }
    }, [])

    for (const order of endOrders) {
      const auction = await auctionRepository.getAuctionByFlowerId(order.flowerId._id.toString())
      //update order với người mua là người đấu giá đứng sau người đấu giá hiện tại tức là buyerId trong order
      if (auction) {
        const bids = auction.bids
        let buyerId = null;
        if (bids.length > 0) {
          //lấy ra bid đứng đằng trước order.buyerId trong bids
          buyerId = bids[bids.findIndex((bid: any) => bid.bidder === order.buyerId) - 1]?.bidder
          if (buyerId) {
            return null;
          }
        }

        const updateOrder = await orderRepository.updateOrder({ _id: order._id }, { buyerId: buyerId })
        //update winner in auction
        const updateAution = await auctionRepository.updateAuction(auction._id.toString(), { winner: buyerId })
      }
    }
    return endOrders
  }
}
export default OrderService