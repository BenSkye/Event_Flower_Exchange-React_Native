import notificationService from "~/services/notificationService"
import OrderService from "~/services/orderService"
import catchAsync from "~/utils/catchAsync"

class OrderController {
  static getPersonalBuyOrder = catchAsync(async (req: any, res: any, next: any) => {
    const orders = await OrderService.getPersonalOrderByBuyerId(req.user.id)
    res.status(200).json(orders)
  })
}
export default OrderController