import React from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';

const orders = [
    { id: '1', orderNumber: '1001', items: 'Roses, Tulips', price: '$30', status: 'Delivered' },
    { id: '2', orderNumber: '1002', items: 'Sunflowers', price: '$15', status: 'In Progress' },
    { id: '3', orderNumber: '1003', items: 'Orchids', price: '$50', status: 'Shipped' },
    { id: '4', orderNumber: '1004', items: 'Lilies', price: '$25', status: 'Cancelled' },
];

const OrderItem = ({ orderNumber, items, price, status }) => (
    <View style={styles.orderItem}>
        <Image
            source={{ uri: 'https://example.com/avatar.png' }} // Replace with your avatar URL
            style={styles.avatar}
        />
        <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
            <Text style={styles.items}>{items}</Text>
            <Text style={styles.price}>Total: {price}</Text>
        </View>
        <Text style={[styles.status, getStatusStyle(status)]}>{status}</Text>
    </View>
);

const getStatusStyle = (status) => {
    switch (status) {
        case 'Delivered':
            return { color: 'green' };
        case 'In Progress':
            return { color: 'orange' };
        case 'Shipped':
            return { color: '#007bff' };
        case 'Cancelled':
            return { color: 'red' };
        default:
            return { color: 'black' };
    }
};

const OrdersScreen = () => {
    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <OrderItem
                        orderNumber={item.orderNumber}
                        items={item.items}
                        price={item.price}
                        status={item.status}
                    />
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
    orderItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center', // Align items vertically
    },
    avatar: {
        width: 50, // Width of the avatar
        height: 50, // Height of the avatar
        borderRadius: 25, // Make it circular
        marginRight: 16, // Space between avatar and order info
    },
    orderInfo: {
        flex: 1,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    items: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
    },
    price: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default OrdersScreen;
