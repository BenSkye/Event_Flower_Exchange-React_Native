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
}
export default OrderService