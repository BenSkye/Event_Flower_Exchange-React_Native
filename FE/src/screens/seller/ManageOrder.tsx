import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { Card, Button, Text, Image } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install and import this if using Expo
import { getPersonalSellOrder, changeOrderStatus } from '../../services/order';

const ManageOrder = ({ navigation }) => {
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orders = await getPersonalSellOrder();
                if (orders.length > 0) {
                    setOrderDetails(orders[0]);
                    setSelectedStatus(orders[0].status);
                }
            } catch (error) {
                console.error('Failed to fetch order details:', error);
            }
        };

        fetchOrderDetails();
    }, []);

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
    };

    const handleUpdateStatus = async () => {
        try {
            await changeOrderStatus(orderDetails._id, selectedStatus);
            setOrderDetails({ ...orderDetails, status: selectedStatus }); // Update order status in the state
            Alert.alert('Success', `Order status updated to ${selectedStatus}`);
        } catch (error) {
            console.error('Failed to update order status:', error);
            Alert.alert('Error', 'Failed to update order status');
        }
    };

    const confirmUpdateStatus = () => {
        Alert.alert(
            'Confirm',
            'Bạn có muốn cập nhật trạng thái đơn hàng?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: handleUpdateStatus,
                },
            ],
            { cancelable: false }
        );
    };

    if (!orderDetails) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#5a61c9" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quản lý sản phẩm</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Card>
                    <Card.Title>{orderDetails.flowerId.name}</Card.Title>
                    <Card.Divider />
                    <View style={styles.row}>
                        <Image
                            source={{ uri: orderDetails.flowerId.images[0] }}
                            style={styles.flowerImage}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Mã đơn hàng: {orderDetails.orderCode}</Text>
                            <Text style={styles.label}>Giá: {orderDetails.price} vnđ</Text>
                            <Text style={styles.label}>
                                Trạng thái hiện tại:
                                {orderDetails.status === 'completed' ? 'Đã thanh toán' :
                                    orderDetails.status === 'delivering' ? 'Đang vận chuyển' :
                                        orderDetails.status === 'delivered' ? 'Đã vận chuyển' :
                                            orderDetails.status === 'cancel' ? 'Hủy đơn' :
                                                orderDetails.status}
                            </Text>
                        </View>
                    </View>
                    <Picker
                        selectedValue={selectedStatus}
                        onValueChange={(itemValue) => handleStatusChange(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Đang vận chuyển" value="delivering" />
                        <Picker.Item label="Đã vận chuyển" value="delivered" />
                        <Picker.Item label="Hủy đơn" value="cancel" />
                    </Picker>
                    <Button
                        title="Cập nhật trạng thái"
                        onPress={confirmUpdateStatus}
                        buttonStyle={styles.updateButton}
                    />
                </Card>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContainer: {
        padding: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginTop: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        marginTop: 10,
    },
    updateButton: {
        marginTop: 10,
        backgroundColor: '#007bff',
    },
    flowerImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#999',
    },
});

export default ManageOrder;
