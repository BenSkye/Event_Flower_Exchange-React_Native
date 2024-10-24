import notificationService from "~/services/notificationService"
import OrderService from "~/services/orderService"
import catchAsync from "~/utils/catchAsync"

class OrderController {
  static getPersonalBuyOrder = catchAsync(async (req: any, res: any, next: any) => {
    const orders = await OrderService.getPersonalOrderByBuyerId(req.user.id)
    res.status(200).json(orders)
  })
  static getOrderbyId = catchAsync(async (req: any, res: any, next: any) => {
    const order = await OrderService.getOrderById(req.params.id)
    res.status(200).json(order)
  })
  static getOrderbyOrdercode = catchAsync(async (req: any, res: any, next: any) => {
    const order = await OrderService.getOrderbyOrdercode(req.params.orderCode)
    res.status(200).json(order)
  })
}
export default OrderController