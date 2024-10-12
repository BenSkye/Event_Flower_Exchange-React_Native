import Notification from "~/models/notificationModel";

class NotificationRepository {
  async createNotification(notification: any) {
    return Notification.create(notification);
  }
}



export default new NotificationRepository();
