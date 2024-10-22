import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, TextInput, Alert, RefreshControl } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import ImageView from "react-native-image-viewing";
import { getFlowerById } from '../../services/flower';
import { placeBid, getAuctionByFlowerId } from '../../services/auction';
import AuctionDetail from './AuctionDetail';
import ProductDetailStyle from '../../styles/ProductDetailStyle';
import { formatPrice } from '../../utils';

type ParamList = {
    Detail: {
        id: string;
    };
};

const { width: screenWidth } = Dimensions.get('window');

const ProductDetail = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<ParamList, 'Detail'>>();
    const [product, setProduct] = useState<any>(null);
    const [isImageViewVisible, setIsImageViewVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bidAmount, setBidAmount] = useState('');
    const [auctionInfo, setAuctionInfo] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [auctionKey, setAuctionKey] = useState(0);

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

    const handlePlaceBid = async () => {
        if (!auctionInfo) {
            Alert.alert('Error', 'Auction information not available');
            return;
        }
        
        const amount = parseFloat(bidAmount);
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
        } catch (error) {
            console.error('Error placing bid:', error);
            Alert.alert('Error', 'Failed to place bid. Please try again.');
        }
    };

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
        <View style={ProductDetailStyle.container}>
            <TouchableOpacity style={ProductDetailStyle.backButton} onPress={handleBackPress}>
                <Text style={ProductDetailStyle.backButtonText}>←</Text>
            </TouchableOpacity>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>
                    <Image source={{ uri: product.images[0] }} style={ProductDetailStyle.image} />
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
                            <Text style={ProductDetailStyle.auctionInfoText}>
                                Giá mua ngay: {formatPrice(auctionInfo.buyNowPrice)}
                            </Text>
                            <Text style={ProductDetailStyle.auctionInfoText}>
                                Giá hiện tại: {formatPrice(auctionInfo.currentPrice)}
                            </Text>
                        </View>
                    )}
                    <Text style={ProductDetailStyle.seller}>Người bán: {product.sellerId.userName}</Text>
                    <Text style={ProductDetailStyle.description}>Mô tả: {product.description}</Text>
                    <View style={ProductDetailStyle.detailsContainer}>
                        <Text style={ProductDetailStyle.detailItem}>Danh mục: {product.categoryId.name}</Text>
                        <Text style={ProductDetailStyle.detailItem}>Trạng thái: {product.status}</Text>
                    </View>
                </View>
                {product.saleType === 'fixed_price' ? (
                    <TouchableOpacity style={ProductDetailStyle.button}
                        onPress={() => {
                            navigation.navigate('Checkout', { flowerId : product._id });
                        }}
                    >
                        <Text style={ProductDetailStyle.buttonText}>
                            Mua ngay
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View>
                        <TextInput
                            style={ProductDetailStyle.input}
                            value={bidAmount}
                            onChangeText={setBidAmount}
                            placeholder="Nhập giá đấu"
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={ProductDetailStyle.button} onPress={handlePlaceBid}>
                            <Text style={ProductDetailStyle.buttonText}>
                                Đặt giá
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={[ProductDetailStyle.freshness, getFreshnessStyle(product.freshness)]}>
                    <Text style={getFreshnessStyle(product.freshness)}>{product.freshness}</Text>
                </View>
                {product.saleType === 'auction' && (
                    <AuctionDetail key={auctionKey} flowerId={product._id} auctionInfo={auctionInfo} />
                )}
            </ScrollView>
            <ImageView
                images={images}
                imageIndex={currentImageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
            />
        </View>
    );
};

export default ProductDetail;
