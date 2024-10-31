import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getFlowerById } from '../services/flower';
import { useAddress } from '../context/AddressContext';
import { formatPrice } from '../utils';
import AntDesign from '@expo/vector-icons/AntDesign';
import { cancelBuyNowAuctionPayment, cancelPayment, cancelWinAuctionPayment, checkBuyNowAuctionPaymentStatus, checkoutBuyNowAuction, checkoutFixedFlower, checkoutWinAuction, checkPaymentStatus, returnWinAuctionPayment } from '../services/checkout';
import * as Linking from 'expo-linking';
import Button from '../components/Button';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getAuctionByFlowerId } from '../services/auction';

const Checkout = () => {
    const { selectedAddress } = useAddress();
    const route = useRoute();
    const navigation = useNavigation<RootStackParamList>();
    const routeParams = route.params;
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [flower, setFlower] = useState<any>(null);
    const [auction, setAuction] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFlower = useCallback(async () => {
        const response = await getFlowerById(routeParams.flowerId.toString());
        setFlower(response);
        if (response?.saleType === 'auction') {
            const auctionResponse = await getAuctionByFlowerId(routeParams.flowerId.toString());
            setAuction(auctionResponse);
            if (auctionResponse && auctionResponse.isBuyNow) {
                response.fixedPrice = auctionResponse.buyNowPrice
                setFlower(response);
            }
        }

    }, [routeParams.flowerId]);

    useFocusEffect(
        useCallback(() => {
            fetchFlower();
            setIsLoading(false);
        }, [fetchFlower])
    );

    const handleCheckout = async () => {
        if (!selectedAddress) {
            alert('Vui lòng chọn địa chỉ nhận hàng');
            return;
        }
        setIsProcessing(true);
        try {
            if (flower?.saleType === 'fixed_price') {
                const paymentLink = await checkoutFixedFlower(routeParams.flowerId.toString(), selectedAddress);
                // console.log('paymentLink', paymentLink)
                if (paymentLink) {
                    setPaymentUrl(paymentLink.checkoutUrl);
                } else {
                    alert('Có lỗi xảy ra khi tạo đơn hàng');
                }
            } else if (flower?.saleType === 'auction' && auction && auction.isBuyNow) {
                // console.log('auction', auction)
                const paymentLink = await checkoutBuyNowAuction(auction._id.toString(), selectedAddress);
                // console.log('paymentLink', paymentLink)
                if (paymentLink) {
                    setPaymentUrl(paymentLink.checkoutUrl);
                } else {
                    alert('Có lỗi xảy ra khi tạo đơn hàng');
                }
            } else if (flower?.saleType === 'auction' && auction && !auction.isBuyNow) {
                const paymentLink = await checkoutWinAuction(auction.flowerId.toString(), selectedAddress);
                // console.log('paymentLink', paymentLink)
                if (paymentLink) {
                    setPaymentUrl(paymentLink.checkoutUrl);
                } else {
                    alert('Có lỗi xảy ra khi tạo đơn hàng');
                }
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại sau');
        }
        setIsProcessing(false);
    };


    const handleNavigationStateChange = (navState: any) => {
        const url = navState.url;
        if (url.includes('handle-payos-return') || url.includes('handle-payos-cancel') || url.includes('handle-buy-now-auction-payos-return') || url.includes('handle-buy-now-auction-payos-cancel')
            || url.includes('handle-win-auction-payos-return') || url.includes('handle-win-auction-payos-cancel')
        ) {
            setPaymentUrl(null);
        }
    };

    const handleSpecialUrls = (event: any) => {
        // console.log('event', event)
        const { url } = event;
        // console.log('url115', url)
        const queryParams = Linking.parse(url).queryParams as Record<string, string>;
        if (url.startsWith('https://dl.vietqr.io/pay')) {
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
            return false; // Ngăn WebView load URL này
        }
        if (url.includes('handle-payos-return') || url.includes('handle-buy-now-auction-payos-return') || url.includes('handle-win-auction-payos-return')) {
            // Xử lý payment success
            if (url.includes('handle-payos-return')) {
                checkPaymentStatus(queryParams);
            } else if (url.includes('handle-buy-now-auction-payos-return')) {
                checkBuyNowAuctionPaymentStatus(queryParams);
            } else {
                returnWinAuctionPayment(queryParams);
            }
            if (queryParams.code === '00') {
                navigation.navigate('OrderDetail', {
                    orderCode: queryParams.orderCode,
                    pageBack: 'Orders'
                });
            } else {
                alert('Có lỗi xảy ra khi xác nhận thanh toán');
            }
            return false;
        }
        if (url.includes('handle-payos-cancel') || url.includes('handle-buy-now-auction-payos-cancel') || url.includes('handle-win-auction-payos-cancel')) {
            if (url.includes('handle-payos-cancel')) {
                cancelPayment(queryParams);
            } else if (url.includes('handle-buy-now-auction-payos-cancel')) {
                cancelBuyNowAuctionPayment(queryParams);
            } else {
                cancelWinAuctionPayment(queryParams);
            }
            alert('Thanh toán đã bị hủy');
            navigation.goBack();
            return false;
        }
        return true;
    };

    if (paymentUrl) {
        return (
            <WebView
                source={{ uri: paymentUrl }}
                style={{ flex: 1 }}
                onNavigationStateChange={handleNavigationStateChange}
                onShouldStartLoadWithRequest={handleSpecialUrls}
            />
        );
    }



    return (
        <View style={styles.wrapper}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#5a61c9" />
            ) : (
                <>
                    <ScrollView contentContainerStyle={styles.container}>
                        <TouchableOpacity onPress={() => { navigation.navigate('ChooseOrderAddress') }}>
                            <View style={styles.sectionAddress}>
                                <AntDesign name="enviromento" size={24} color="#5a61c9" style={styles.sallerIcon} />
                                <View style={styles.addressContent}>
                                    <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
                                    {selectedAddress ? (
                                        <>
                                            <Text style={styles.text} numberOfLines={1}>
                                                {selectedAddress.name} | {selectedAddress.phone}
                                            </Text>
                                            <Text style={styles.text} numberOfLines={2}>
                                                {selectedAddress.address}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text style={styles.text}>Chưa có địa chỉ nhận hàng</Text>
                                    )}
                                </View>
                                <View style={styles.rightIcon}>
                                    <AntDesign name="right" size={24} color="black" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>
                            {flower ? (
                                <View style={styles.productRow}>
                                    <Image source={{ uri: flower.images[0] }} style={styles.image} />
                                    <View style={styles.productDetails}>
                                        <Text style={styles.textName}>{flower.name}</Text>
                                        {flower?.saleType === 'fixed_price' && <Text style={styles.text}>{formatPrice(flower.fixedPrice)}</Text>}
                                        {flower?.saleType === 'auction' && auction && auction.isBuyNow && <Text style={styles.text}>{formatPrice(auction?.buyNowPrice)}</Text>}
                                        {flower?.saleType === 'auction' && auction && <Text style={styles.text}>{formatPrice(auction?.currentPrice)}</Text>}
                                    </View>
                                </View>
                            ) : (
                                <Text style={styles.text}>Đang tải thông tin sản phẩm...</Text>
                            )}
                        </View>
                    </ScrollView>

                    <View style={styles.fixedBottom}>
                        <TouchableOpacity
                            style={[styles.checkoutButton, isProcessing && styles.disabledButton]}
                            onPress={handleCheckout}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.checkoutText}>Thanh Toán</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        height: '100%',
    },
    sectionAddress: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'flex-start', // Changed from center to flex-start
    },
    container: {
        padding: 16,
        marginTop: 16,
        backgroundColor: '#f5f5f5',
        paddingBottom: 80, // To avoid overlap with the button
        height: '100%',
    },
    section: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    }, addressContent: {
        flex: 1,
        marginRight: 8, // Add margin to prevent text from touching the right arrow
    },
    // sectionAddress: {
    //     marginBottom: 24,
    //     padding: 16,
    //     backgroundColor: '#fff',
    //     borderRadius: 8,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 8,
    //     elevation: 2,
    //     flexDirection: 'row'
    // },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    text: {
        fontSize: 16,
        color: '#909497',
        marginBottom: 4,
    },
    textName: {
        fontSize: 16,
        marginBottom: 4,
    },
    productRow: {
        flexDirection: 'row',
    },
    image: {
        width: '30%',
        height: 110,
        resizeMode: 'cover',
        borderRadius: 8,
        marginRight: 16,
    },
    productDetails: {
        flex: 1,
    },
    sallerIcon: {
        marginRight: 10,
    },
    fixedBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    checkoutButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    rightIcon: {
        marginLeft: 'auto',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#a0a0a0',
    },
});

export default Checkout;
