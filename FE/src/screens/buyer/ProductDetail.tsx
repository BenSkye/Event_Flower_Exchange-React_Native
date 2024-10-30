import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, TextInput, Alert, RefreshControl, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import ImageView from "react-native-image-viewing";
import { Image } from 'expo-image';

import { getFlowerById } from '../../services/flower';
import { placeBid, getAuctionByFlowerId } from '../../services/auction';
import AuctionDetail from './AuctionDetail';
import ProductDetailStyle from '../../styles/ProductDetailStyle';
import { formatInputPrice, formatPrice, parseInputPrice } from '../../utils';
import { useAuth } from '../../context/AuthContext';
import { FLOWER_FRENSHNESS_LABELS, FLOWER_STATUS_LABELS } from '../../constant/indext';

type ParamList = {
    Detail: {
        id: string;
    };
};

const { width: screenWidth } = Dimensions.get('window');

const ProductDetail = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<ParamList, 'Detail'>>();
    const scrollViewRef = useRef<ScrollView>(null);
    const [product, setProduct] = useState<any>(null);
    const [isImageViewVisible, setIsImageViewVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bidAmount, setBidAmount] = useState('');
    const [auctionInfo, setAuctionInfo] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [auctionKey, setAuctionKey] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const { user } = useAuth();

    const fetchProductData = useCallback(async () => {
        try {
            const data = await getFlowerById(route.params.id);
            setProduct(data);
            if (data.saleType === 'auction') {
                const auctionData = await getAuctionByFlowerId(data._id);
                setAuctionInfo(auctionData);
                setAuctionKey(prevKey => prevKey + 1);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            Alert.alert('Error', 'Failed to load product data. Please try again.');
        }
    }, [route.params.id]);

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchProductData();
        setRefreshing(false);
    }, [fetchProductData]);

    const handleBackPress = () => {
        navigation.goBack();
    };
    const handleBidAmountChange = (value: string) => {
        const formattedValue = formatInputPrice(value);
        setBidAmount(formattedValue);
    };

    const handlePlaceBid = async () => {
        if (!auctionInfo) {
            Alert.alert('Error', 'Auction information not available');
            return;
        }

        const amount = parseInputPrice(bidAmount);
        if (isNaN(amount) || amount <= auctionInfo.currentPrice) {
            Alert.alert('Invalid Bid', 'Please enter a valid amount higher than the current price');
            return;
        }

        try {
            const result = await placeBid(auctionInfo._id, amount);
            Alert.alert('Bid Placed', 'Your bid has been placed successfully');
            // Update auction info
            setAuctionInfo(result);
            setBidAmount('');
            onRefresh();
        } catch (error) {
            console.error('Error placing bid:', error);
            Alert.alert('Error', 'Failed to place bid. Please try again.');
        }
    };


    const renderImageItem = ({ item, index }: { item: string; index: number }) => (
        <TouchableOpacity
            onPress={() => {
                setCurrentImageIndex(index);
                setIsImageViewVisible(true);
            }}
        >
            <Image
                style={[
                    ProductDetailStyle.slideImage,
                    activeIndex === index && ProductDetailStyle.activeSlideImage
                ]}
                source={{ uri: item }}
                contentFit="cover"
                transition={1000}
            />
        </TouchableOpacity>
    );


    if (!product) {
        return (
            <View style={ProductDetailStyle.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const images = product.images.map((url: string) => ({ uri: url }));

    const getFreshnessStyle = (freshness: string) => {
        const validFreshnessStyles = ['fresh', 'slightly_wilted', 'wilted', 'expired'];
        return validFreshnessStyles.includes(freshness) ? ProductDetailStyle[freshness as keyof typeof ProductDetailStyle] : {};
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ImageView
                images={images}
                imageIndex={currentImageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
            />
            <ScrollView
                ref={scrollViewRef}
                style={ProductDetailStyle.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <TouchableOpacity style={ProductDetailStyle.backButton} onPress={handleBackPress}>
                    <Text style={ProductDetailStyle.backButtonText}>←</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>
                    <View style={ProductDetailStyle.imageContainer}>
                        <FlatList
                            data={product.images}
                            renderItem={renderImageItem}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={e => {
                                const x = e.nativeEvent.contentOffset.x;
                                setActiveIndex(Math.round(x / screenWidth));
                            }}
                            snapToInterval={screenWidth}
                            decelerationRate="fast"
                            keyExtractor={(_, index) => index.toString()}
                        />
                        <View style={ProductDetailStyle.pagination}>
                            {product.images.map((_: string, index: number) => (
                                <View
                                    key={index}
                                    style={[
                                        ProductDetailStyle.paginationDot,
                                        index === activeIndex && ProductDetailStyle.paginationDotActive
                                    ]}
                                />
                            ))}
                        </View>
                        <View style={[ProductDetailStyle.freshness, getFreshnessStyle(product.freshness)]}>
                            <Text style={getFreshnessStyle(product.freshness)}>
                                {FLOWER_FRENSHNESS_LABELS[product.freshness as keyof typeof FLOWER_FRENSHNESS_LABELS]}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={ProductDetailStyle.infoContainer}>
                    <Text style={ProductDetailStyle.name}>{product.name}</Text>
                    <Text style={ProductDetailStyle.price}>
                        {product.saleType === 'fixed_price'
                            ? `${formatPrice(product.fixedPrice)}`
                            : 'Đấu giá'}
                    </Text>
                    {product.saleType === 'auction' && auctionInfo && (
                        <View style={ProductDetailStyle.auctionInfo}>
                            <Text style={ProductDetailStyle.auctionInfoText}>
                                Giá khởi điểm: {formatPrice(auctionInfo.startingPrice)}
                            </Text>
                            {auctionInfo.isBuyNow && (
                                <Text style={ProductDetailStyle.auctionInfoText}>
                                    Giá mua ngay: {formatPrice(auctionInfo.buyNowPrice)}
                                </Text>
                            )}
                            {auctionInfo.currentPrice && (
                                <Text style={ProductDetailStyle.auctionInfoText}>
                                    Giá hiện tại: {formatPrice(auctionInfo.currentPrice)}
                                </Text>)
                            }
                        </View>
                    )}
                    <Text style={ProductDetailStyle.seller}>Người bán: {product.sellerId.userName}</Text>
                    <Text style={ProductDetailStyle.description}>Mô tả: {product.description}</Text>
                    <View style={ProductDetailStyle.detailsContainer}>
                        <Text style={ProductDetailStyle.detailItem}>Danh mục: {product.categoryId.name}</Text>
                        <Text style={ProductDetailStyle.detailItem}>Trạng thái: {FLOWER_STATUS_LABELS[product.status as keyof typeof FLOWER_STATUS_LABELS]}</Text>
                    </View>
                </View>
                {product.saleType === 'auction' && auctionInfo?.status === 'active' && auctionInfo.isBuyNow && user?._id !== product.sellerId._id && (
                    <TouchableOpacity
                        style={ProductDetailStyle.button}
                        onPress={() => {
                            navigation.navigate('Checkout', { flowerId: product._id });
                        }}
                    >
                        <Text style={ProductDetailStyle.buttonTextBuyNow}>
                            Mua ngay trong đấu giá với {formatPrice(auctionInfo.buyNowPrice)}
                        </Text>
                    </TouchableOpacity>
                )}
                {product.saleType === 'auction' && (
                    <AuctionDetail key={auctionKey} flowerId={product._id} />
                )}

            </ScrollView>
            {product.saleType === 'fixed_price' && user?._id !== product.sellerId._id ? (
                <TouchableOpacity
                    style={ProductDetailStyle.button}
                    onPress={() => {
                        navigation.navigate('Checkout', { flowerId: product._id });
                    }}
                >
                    <Text style={ProductDetailStyle.buttonText}>
                        Mua ngay
                    </Text>
                </TouchableOpacity>
            ) : (
                auctionInfo?.status === 'active' && user?._id !== product.sellerId._id && (
                    <View>
                        <TextInput
                            style={ProductDetailStyle.input}
                            value={bidAmount}
                            onChangeText={handleBidAmountChange}
                            placeholder="Nhập giá đấu"
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={ProductDetailStyle.button} onPress={() => {
                            if (user) {
                                handlePlaceBid();
                            } else {
                                navigation.navigate('Login');
                            }
                        }}>
                            <Text style={ProductDetailStyle.buttonText}>
                                Đặt giá
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            )}

        </KeyboardAvoidingView >
    );
};

export default ProductDetail;
