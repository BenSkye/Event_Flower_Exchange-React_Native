import notificationRepository from "~/repository/notificationRepository";
import Expo, { ExpoPushMessage } from "expo-server-sdk";
import userRepository from "~/repository/userRepository";

class NotificationService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async createNotification(userId: string, title: string, body: string, data: any, type: string) {
    const notification = { userId, message: { title, body }, data, type };
    const newNotification = await notificationRepository.createNotification(notification);
    await this.sendNotification(userId, newNotification)
    return newNotification
  }


  async sendNotification(userId: string, notification: any) {
    // Giả sử bạn có một cách để lấy pushToken từ userId
    const userRepositoryInstance = new userRepository();
    const user = await userRepositoryInstance.findUser({ _id: userId }, ['pushToken']);
    if (user?.pushToken === '') {
      console.log('pushToken is empty')
      return;
    }

    const pushToken = user?.pushToken;

    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      return;
    }

    const message: ExpoPushMessage = {
      to: pushToken,
      sound: 'default',
      title: notification.message.title,
      body: notification.message.body,
      data: { notification },
    };

    try {
      const ticket = await this.expo.sendPushNotificationsAsync([message]);
      console.log('Notification sent:', ticket);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async getPersonalNotification(userId: string) {
    const notification = await notificationRepository.findNotification({ userId }, []);
    console.log('notification', notification)
    return notification;
  }

}

export default new NotificationService();