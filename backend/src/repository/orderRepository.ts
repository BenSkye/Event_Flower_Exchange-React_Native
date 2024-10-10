import Order from "~/models/orderModel"


class OrderRepository {
  async createOrder(order: any) {
    return await Order.create(order)
  }
}

export default new OrderRepository()
