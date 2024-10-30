import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { getOrderbyOrdercode } from '../services/order';
import { Button, Text, Image } from 'react-native-elements';
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
                <Button
                    icon={<Icon name="arrow-back" size={24} color='#FFFFFF' />}
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    onPress={() => {
                        if (pageBack) {
                            navigation.navigate(pageBack as never);
                        } else {
                            navigation.goBack();
                        }
                    }}
                />
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
            {orderDetails ? (
                <View style={styles.detailContainer}>
                    <Text style={styles.title}>Thông tin đơn hàng</Text>
                    <Text style={styles.label}>Mã đơn hàng:</Text>
                    <Text style={styles.value}>{orderDetails.orderCode}</Text>
                    <Text style={styles.label}>Giá:</Text>
                    <Text style={styles.value}>{orderDetails.price} vnđ</Text>
                    <Text style={styles.label}>Trạng thái đơn hàng:</Text>
                    <Text style={styles.value}>
                        {orderDetails.status === 'completed' ? 'Đã thanh toán' : orderDetails.status}
                    </Text>
                    <Text style={styles.label}>Tên:</Text>
                    <Text style={styles.value}>{orderDetails.flowerId.name}</Text>
                    <Text style={styles.label}>Mô tả:</Text>
                    <Text style={styles.value}>{orderDetails.flowerId.description}</Text>
                    <Image
                        source={{ uri: orderDetails.flowerId.images[0] }}
                        style={styles.flowerImage}
                        PlaceholderContent={<Text>Loading...</Text>}
                    />
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
        backgroundColor: '#f8f9fa',
    },
    detailContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
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
