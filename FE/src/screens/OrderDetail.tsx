import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { getOrderbyOrdercode } from '../services/order';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ORDER_STATUS_LABELS } from '../constant/indext';
import { formatPrice } from '../utils';

const OrderDetail = ({ route }: { route: any }) => {
    const { orderCode, pageBack } = route.params;
    const navigation = useNavigation();
    const [orderDetails, setOrderDetails] = useState<any>(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => {
                    if (pageBack) {
                        navigation.navigate(pageBack as never);
                    } else {
                        navigation.goBack();
                    }
                }}>
                    <Icon name="arrow-back" size={24} color='#FFFFFF' style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, pageBack]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const details = await getOrderbyOrdercode(orderCode);
                setOrderDetails(details);
            } catch (error) {
                console.error('Failed to fetch order details:', error);
            }
        };

        fetchOrderDetails();
    }, [orderCode]);


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Chi tiết đơn hàng</Text>
            {orderDetails ? (
                <View style={styles.detailsContainer}>
                    {/* Delivery Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <AntDesign name="enviromento" size={24} color="#5a61c9" />
                            <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
                        </View>
                        <View style={styles.sectionContent}>
                            <Text style={styles.value}>{orderDetails.delivery.name}</Text>
                            <Text style={styles.value}>{orderDetails.delivery.phone}</Text>
                            <Text style={styles.value}>{orderDetails.delivery.address}</Text>
                        </View>
                    </View>

                    {/* Order Info Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <AntDesign name="filetext1" size={24} color="#5a61c9" />
                            <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
                        </View>
                        <View style={styles.sectionContent}>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Mã đơn hàng:</Text>
                                <Text style={styles.value}>{orderDetails.orderCode}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Giá:</Text>
                                <Text style={styles.valueHighlight}>{formatPrice(orderDetails.price)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Trạng thái:</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{ORDER_STATUS_LABELS[orderDetails.status as keyof typeof ORDER_STATUS_LABELS]}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Flower Details Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <AntDesign name="gift" size={24} color="#5a61c9" />
                            <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
                        </View>
                        <View style={styles.sectionContent}>
                            <Image
                                source={{ uri: orderDetails.flowerId.images[0] }}
                                style={styles.flowerImage}
                            />
                            <Text style={styles.flowerName}>{orderDetails.flowerId.name}</Text>
                            <Text style={styles.description}>{orderDetails.flowerId.description}</Text>
                        </View>
                    </View>
                </View>
            ) : (
                <Text style={styles.loadingText}>Loading...</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    detailsContainer: {
        gap: 16,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    sectionContent: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    label: {
        fontSize: 15,
        color: '#666',
        flex: 1,
    },
    value: {
        fontSize: 15,
        color: '#333',
        flex: 2,
    },
    valueHighlight: {
        fontSize: 16,
        fontWeight: '600',
        color: '#5a61c9',
    },
    statusBadge: {
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    statusText: {
        color: '#2e7d32',
        fontSize: 14,
        fontWeight: '500',
    },
    flowerImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    flowerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default OrderDetail;