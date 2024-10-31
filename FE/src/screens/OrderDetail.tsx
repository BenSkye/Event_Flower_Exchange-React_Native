import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { getOrderbyOrdercode } from '../services/order';
import { Button, Text, Image } from 'react-native-elements';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ORDER_STATUS_LABELS } from '../constant/indext';
import { formatPrice } from '../utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


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

    const renderSection = (title: string, icon: string, content: React.ReactNode) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name={icon} size={24} color="#5a61c9" />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <View style={styles.sectionContent}>
                {content}
            </View>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {orderDetails ? (
                <View style={styles.detailContainer}>
                    {renderSection("Thông tin giao hàng", "local-shipping", (
                        <>
                            <View style={styles.infoRow}>
                                <FontAwesome name="user" size={16} color="#666" style={styles.rowIcon} />
                                <Text style={styles.label}>Người nhận:</Text>
                                <Text style={styles.value}>{orderDetails.delivery.name}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <FontAwesome name="phone" size={16} color="#666" style={styles.rowIcon} />
                                <Text style={styles.label}>Số điện thoại:</Text>
                                <Text style={styles.value}>{orderDetails.delivery.phone}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <FontAwesome name="map-marker" size={16} color="#666" style={styles.rowIcon} />
                                <Text style={styles.label}>Địa chỉ:</Text>
                                <Text style={styles.value}>{orderDetails.delivery.address}</Text>
                            </View>
                        </>
                    ))}

                    {renderSection("Thông tin đơn hàng", "receipt", (
                        <>
                            <View style={styles.infoRow}>
                                <MaterialIcons name="confirmation-number" size={16} color="#666" style={styles.rowIcon} />
                                <Text style={styles.label}>Mã đơn:</Text>
                                <Text style={styles.value}>{orderDetails.orderCode}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <MaterialIcons name="attach-money" size={16} color="#666" style={styles.rowIcon} />
                                <Text style={styles.label}>Giá:</Text>
                                <Text style={styles.valueHighlight}>{formatPrice(orderDetails.price)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <MaterialIcons name="pending-actions" size={16} color="#666" style={styles.rowIcon} />
                                <Text style={styles.label}>Trạng thái:</Text>
                                <Text style={[styles.value, { color: orderDetails.status === 'completed' ? '#4CAF50' : '#FF9800' }]}>
                                    {ORDER_STATUS_LABELS[orderDetails.status as keyof typeof ORDER_STATUS_LABELS] || orderDetails.status}
                                </Text>
                            </View>
                        </>
                    ))}

                    {renderSection("Thông tin sản phẩm", "local-florist", (
                        <>
                            <Image
                                source={{ uri: orderDetails.flowerId.images[0] }}
                                style={styles.flowerImage}
                                PlaceholderContent={<Text>Loading...</Text>}
                            />
                            <Text style={styles.flowerName}>{orderDetails.flowerId.name}</Text>
                            <Text style={styles.description}>{orderDetails.flowerId.description}</Text>
                        </>
                    ))}
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
    sectionContent: {
        gap: 8,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    section: {
        marginBottom: 24,
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
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    rowIcon: {
        marginRight: 8,
        width: 20,
    },
    label: {
        fontSize: 15,
        color: '#666',
        width: 100,
    },
    value: {
        fontSize: 15,
        color: '#333',
        flex: 1,
    },
    valueHighlight: {
        fontSize: 16,
        fontWeight: '600',
        color: '#5a61c9',
        flex: 1,
    },
    flowerImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
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
});

export default OrderDetail;
