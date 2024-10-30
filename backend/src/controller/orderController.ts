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
  static changeOrderStatus = catchAsync(async (req: any, res: any, next: any) => {
    const { status } = req.body
    const order = await OrderService.changeOrderStatus(req.params.id, status)
    res.status(200).json(order)
    notificationService.sendNotification(req.user.id, 'Your order status has been updated')
  })
  static getPersonalSellOrder = catchAsync(async (req: any, res: any, next: any) => {
    const orders = await OrderService.getPersonalOrderBySellerId(req.user.id)
    console.log('orderssss', orders)
    res.status(200).json(orders)
  })
}
export default OrderController