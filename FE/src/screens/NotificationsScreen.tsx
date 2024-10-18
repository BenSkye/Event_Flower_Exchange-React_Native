import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getPersonalNotification } from '../services/notification';
import { Link, useFocusEffect, useNavigation } from '@react-navigation/native';

const notifications = [
    { id: '1', title: 'New Message', message: 'Đơn hàng của bạn đang trên đường.', time: '2 minutes ago' },
    { id: '2', title: 'Discount', message: 'Bạn có mã giảm giá 20%', time: '10 minutes ago' },
    { id: '3', title: 'New Listing', message: 'A new flower listing has been added.', time: '1 hour ago' },
    { id: '4', title: 'Promotion', message: 'Get 20% off on your next purchase!', time: '1 day ago' },
];

interface NotificationItemProps {
    title: string;
    message: string;
    time: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ title, message, time }) => (

    <View style={styles.notificationItem}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.time}>{time}</Text>
    </View>
);

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState([])
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const fetchNotifications = async () => {
                try {
                    const response = await getPersonalNotification();
                    console.log('response notifications', response);
                    setNotifications(response);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };

            fetchNotifications();

            return () => {

            };
        }, [])
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Detail', { id: item?.data?.flowerId?.toString() })}>
                        <NotificationItem title={item.message.title} message={item.message.body} time={item.createdAt} />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 16,
    },
    notificationItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    message: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
    },
    time: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
});

export default NotificationsScreen;
