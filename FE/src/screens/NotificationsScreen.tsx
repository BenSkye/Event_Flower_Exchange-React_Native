import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

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
    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NotificationItem title={item.title} message={item.message} time={item.time} />
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
