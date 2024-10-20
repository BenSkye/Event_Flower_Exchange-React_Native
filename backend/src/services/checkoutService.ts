import flowerRepository from "~/repository/flowerRepository";
import orderRepository from "~/repository/orderRepository";
import FlowerService from "~/services/flowerService";
import notificationService from "~/services/notificationService";
import OrderService from "~/services/orderService";
import { createPaymentLink } from "~/services/payOsService";
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

    const paymentLink = await createPaymentLink(newOrder.orderCode, newOrder.price, flower.name)
    return paymentLink
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
      const notification = await notificationService.createNotification(updateOrder.sellerId.toString(), 'Bạn đã bán được hoa', 'Bạn đã bán được hoa ' + updateFlower.name + ' với giá ' + updateOrder.price, { orderId: updateOrder._id, flowerId: updateFlower._id }, 'order')
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