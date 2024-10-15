import notificationService from "~/services/notificationService"
import catchAsync from "~/utils/catchAsync"

class NotificationController {
  static getPersonalNotification = catchAsync(async (req: any, res: any, next: any) => {
    const notification = await notificationService.getPersonalNotification(req.user.id)
    res.status(200).json(notification)
  })
}
export default NotificationController