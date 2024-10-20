import Order from "~/models/orderModel"
import { selectedObject } from "~/utils"


class OrderRepository {
  async createOrder(order: any) {
    return await Order.create(order)
  }
  async updateOrder(query: any, order: any) {
    return await Order.findOneAndUpdate(query, order, { upsert: true, new: true })
  }
  async findOrder(query: any, select: any) {
    return await Order.find(query).select(selectedObject(select)).populate('flowerId')
  }

  async deleteOrder(query: any) {
    return await Order.findOneAndDelete(query)
  }
}

export default new OrderRepository()
