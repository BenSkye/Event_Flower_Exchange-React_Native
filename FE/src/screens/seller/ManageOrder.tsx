import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Alert,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    StatusBar,
    Platform
} from 'react-native';
import { Text, Image } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { getPersonalSellOrder, changeOrderStatus } from '../../services/order';

interface OrderDetails {
    _id: string;
    orderCode: string;
    status: string;
    price: number;
    flowerId: {
        name: string;
        images: string[];
    };
}

interface StatusOption {
    label: string;
    value: string;
}

const ManageOrder = ({ navigation }) => {
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
                Alert.alert('Lỗi', 'Không thể tải thông tin đơn hàng');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, []);

    const getAvailableStatuses = (currentStatus: string): StatusOption[] => {
        switch (currentStatus) {
            case 'delivering':
                return [
                    { label: 'Đang vận chuyển', value: 'delivering' },
                    { label: 'Đã giao', value: 'delivered' },
                    { label: 'Hủy đơn', value: 'cancel' }
                ];
            case 'delivered':
                return [
                    { label: 'Đã giao', value: 'delivered' }
                ];
            default:
                return [];
        }
    };

    const canUpdateStatus = (currentStatus: string): boolean => {
        return currentStatus === 'delivering';
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
    };

    const handleUpdateStatus = async () => {
        if (!canUpdateStatus(orderDetails?.status || '')) {
            Alert.alert('Thông báo', 'Không thể cập nhật trạng thái đơn hàng này');
            return;
        }

        try {
            setIsLoading(true);
            await changeOrderStatus(orderDetails?._id || '', selectedStatus);
            setOrderDetails(prev => prev ? { ...prev, status: selectedStatus } : null);
            Alert.alert('Thành công', `Đã cập nhật trạng thái đơn hàng thành ${getStatusText(selectedStatus)}`);
        } catch (error) {
            console.error('Failed to update order status:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng');
        } finally {
            setIsLoading(false);
        }
    };

    const confirmUpdateStatus = () => {
        if (!canUpdateStatus(orderDetails?.status || '')) return;

        Alert.alert(
            'Xác nhận',
            'Bạn có chắc muốn cập nhật trạng thái đơn hàng?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Đồng ý',
                    onPress: handleUpdateStatus,
                },
            ],
            { cancelable: false }
        );
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'completed': return 'Đã thanh toán';
            case 'delivering': return 'Đang vận chuyển';
            case 'delivered': return 'Đã giao';
            case 'cancel': return 'Đã hủy';
            default: return status;
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'completed': return '#4CAF50';
            case 'delivering': return '#2196F3';
            case 'delivered': return '#9C27B0';
            case 'cancel': return '#F44336';
            default: return '#757575';
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    if (!orderDetails) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#757575" />
                <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#4A90E2" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.orderCard}>
                        <View style={styles.orderHeader}>
                            <Text style={styles.orderCode}>Đơn hàng #{orderDetails.orderCode}</Text>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(orderDetails.status) }
                            ]}>
                                <Text style={styles.statusText}>
                                    {getStatusText(orderDetails.status)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.productInfo}>
                            <Image
                                source={{ uri: orderDetails.flowerId.images[0] }}
                                style={styles.productImage}
                                PlaceholderContent={<ActivityIndicator />}
                            />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>{orderDetails.flowerId.name}</Text>
                                <Text style={styles.price}>
                                    {orderDetails.price.toLocaleString()} VNĐ
                                </Text>
                            </View>
                        </View>

                        <View style={styles.statusSection}>
                            <Text style={styles.sectionTitle}>Cập nhật trạng thái</Text>

                            {canUpdateStatus(orderDetails.status) ? (
                                <>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={selectedStatus}
                                            onValueChange={handleStatusChange}
                                            style={styles.picker}
                                            enabled={canUpdateStatus(orderDetails.status)}
                                        >
                                            {getAvailableStatuses(orderDetails.status).map((status) => (
                                                <Picker.Item
                                                    key={status.value}
                                                    label={status.label}
                                                    value={status.value}
                                                />
                                            ))}
                                        </Picker>
                                    </View>

                                    <TouchableOpacity
                                        style={[
                                            styles.updateButton,
                                            { opacity: isLoading ? 0.7 : 1 }
                                        ]}
                                        onPress={confirmUpdateStatus}
                                        disabled={isLoading || !canUpdateStatus(orderDetails.status)}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.updateButtonText}>
                                                Cập nhật trạng thái
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.statusLocked}>
                                    <Ionicons name="lock-closed" size={20} color="#757575" />
                                    <Text style={styles.statusLockedText}>
                                        Không thể cập nhật trạng thái đơn hàng này
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        marginLeft: 12,
    },
    scrollView: {
        flex: 1,
    },
    orderCard: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    orderCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    productInfo: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 16,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    productDetails: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4A90E2',
    },
    statusSection: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
    },
    updateButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#757575',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: '#757575',
    },
    statusLocked: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    statusLockedText: {
        marginLeft: 8,
        color: '#757575',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ManageOrder;