import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../constant/indext';
import { formatDate, formatPrice } from '../utils';
import { MaterialIcons } from '@expo/vector-icons';

const OrderItem = ({ order }: { order: any }) => {
    console.log('order', order);
    return (
        <View style={styles.container}>
            <View style={styles.shopInfo}>
                <View style={styles.sallerContainer}>
                    <MaterialIcons name="store" size={16} color="#666" style={styles.sallerIcon} />
                    {/* <Text style={styles.saller}>{order.saller}</Text> */}
                </View>
                <Text style={[styles.orderStatus, { color: ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] }]}>
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
                </Text>
            </View>
            <View style={styles.productInfo}>
                <Image source={{ uri: order.flowerId.images[0] }} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <Text style={styles.productName}>{order.flowerId.name}</Text>
                    {order.flowerId.saleType === 'auction' && (
                        <Text style={styles.auctionTitle}>Sản phẩm đấu giá</Text>
                    )}
                    <Text>{formatDate(order.createdAt)}</Text>
                </View>
            </View>
            <View style={styles.orderTotal}>
                <Text style={styles.totalLabel}>Tổng số tiền sản phẩm:</Text>
                <Text style={styles.totalAmount}>{formatPrice(order.price)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginBottom: 10,
        padding: 15,
        borderRadius: 8,
    },
    shopInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    saller: {
        fontWeight: 'bold',
    },
    orderStatus: {
        color: 'orange',
    },
    productInfo: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    productImage: {
        width: 80,
        height: 80,
        marginRight: 10,
        borderRadius: 10,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontWeight: 'bold',
    },
    productVariant: {
        color: 'gray',
    },
    productQuantity: {
        color: 'gray',
    },
    orderTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    totalLabel: {
        color: 'gray',
    },
    totalAmount: {
        fontWeight: 'bold',
    },
    buyAgainButton: {
        borderWidth: 1,
        borderColor: 'orange',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    buyAgainText: {
        color: 'orange',
    }, sallerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }, sallerIcon: {
        marginRight: 5,
    },
    auctionTitle: {
        color: '#a9dfbf',
        marginTop: 5,
    }
});

export default OrderItem;
