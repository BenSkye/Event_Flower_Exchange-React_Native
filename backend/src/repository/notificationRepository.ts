import Notification from "~/models/notificationModel";
import { selectedObject } from "~/utils";

class NotificationRepository {
  async createNotification(notification: any) {
    return Notification.create(notification);
  }

  async findNotification(filter: any, select: any) {
    return Notification.find(filter).select(selectedObject(select)).sort({ createdAt: -1 });
  }
}

export default new NotificationRepository();
