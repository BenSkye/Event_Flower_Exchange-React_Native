import React, { useEffect, useRef } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import RootNavigator, { RootStackParamList } from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import * as Notifications from 'expo-notifications';
import { AddressProvider } from './src/context/AddressContext';
import OrderDetail from './src/screens/OrderDetail';
import * as Linking from 'expo-linking';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default function App() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  useEffect(() => {

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification)
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('data', data.notification.data);
      if (data) {
        if (navigationRef.isReady()) {
          switch (data.notification.type) {
            case 'Notifications':
              navigationRef.navigate('Notifications');
              break;
            case 'new-auction-bid':
              if (data.notification) {
                navigationRef.navigate('Detail', { id: data.notification.data.flowerId });
              }
              break;
            // Thêm các case khác tùy theo nhu cầu của bạn
            default:
              console.log('Unknown screen:', data.screen);
          }
        }
      }
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };

  }, []);

  return (
    <AuthProvider>
      <AddressProvider>
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
        </NavigationContainer>
      </AddressProvider>
    </AuthProvider>
  );
}
