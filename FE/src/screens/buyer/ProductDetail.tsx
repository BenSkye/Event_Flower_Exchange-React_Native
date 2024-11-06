import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    TextInput,
    Alert,
    RefreshControl,
    KeyboardAvoidingView,
    Platform,
    Animated
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import ImageView from "react-native-image-viewing";
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { getFlowerById } from '../../services/flower';
import { placeBid, getAuctionByFlowerId } from '../../services/auction';
import AuctionDetail from './AuctionDetail';
import ProductDetailStyle from '../../styles/ProductDetailStyle';
import { formatInputPrice, formatPrice, parseInputPrice } from '../../utils';
import { useAuth } from '../../context/AuthContext';
import {
    FRESHNESS_COLORS,
    FRESHNESS_LABELS,
    AUCTION_STATUS_COLORS,
    AUCTION_STATUS_LABELS,
    PRODUCT_STATUS_LABELS
} from '../../constant/indext';
import { createConversation } from '../../services/conversation';

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
    const scrollY = useRef(new Animated.Value(0)).current;

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
            Alert.alert('Lỗi', 'Đặt giá chưa khả dụng');
            return;
        }

        const amount = parseInputPrice(bidAmount);
        if (isNaN(amount) || amount <= auctionInfo.currentPrice) {
            Alert.alert('Lỗi', 'Vui lòng nhập giá lớn hơn giá hiện tại');
            return;
        }

        if (auctionInfo?.isBuyNow) {
            if (amount >= auctionInfo.buyNowPrice) {
                Alert.alert('Lỗi', 'Giá mua phải bé hơn giá mua ngay');
                return;
            }
        }

        try {
            const result = await placeBid(auctionInfo._id, amount);
            Alert.alert('Thành công', 'Đặt giá thành công');
            setAuctionInfo(result);
            setBidAmount('');
            onRefresh();
        } catch (error) {
            console.error('Error placing bid:', error);
            Alert.alert('Lỗi', 'Đặt giá thất bại. Vui lòng thử lại.');
        }
    };

    const handleCreateConversation = async () => {
        const result = await createConversation(product._id)
        console.log('result', result)
        if (result) {
            navigation.navigate('Chat', { conversationId: result._id })
        } else {
            Alert.alert('Lỗi', 'Tạo cuộc trò chuyện thất bại. Vui lòng thử lại.');
        }
    }

    if (!product) {
        return (
            <View style={ProductDetailStyle.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    const images = product.images.map((url: string) => ({ uri: url }));

    const getFreshnessStyle = (freshness: string) => {
        return {
            backgroundColor: FRESHNESS_COLORS[freshness as keyof typeof FRESHNESS_COLORS][0],
            color: 'white'
        };
    };

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            style={{ flex: 1, backgroundColor: '#fff' }}
        >
            <Animated.View style={[
                ProductDetailStyle.header,
                {
                    opacity: headerOpacity,
                    zIndex: 2,
                }
            ]}>
                <BlurView intensity={100} style={ProductDetailStyle.headerBlur}>
                    <TouchableOpacity onPress={handleBackPress} style={ProductDetailStyle.headerBackButton}>
                        <MaterialIcons name="arrow-back-ios" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={ProductDetailStyle.headerTitle} numberOfLines={1}>
                        {product.name}
                    </Text>
                </BlurView>
            </Animated.View>

            <ImageView
                images={images}
                imageIndex={currentImageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
                swipeToCloseEnabled
                doubleTapToZoomEnabled
            />

            <Animated.ScrollView
                ref={scrollViewRef}
                style={ProductDetailStyle.container}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#4CAF50"
                    />
                }
            >
                <TouchableOpacity
                    style={ProductDetailStyle.backButton}
                    onPress={handleBackPress}
                >
                    <MaterialIcons name="arrow-back-ios" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setIsImageViewVisible(true)}
                    activeOpacity={0.95}
                >
                    <View style={ProductDetailStyle.imageContainer}>
                        <Image
                            style={ProductDetailStyle.image}
                            source={{ uri: product.images[0] }}
                            contentFit="cover"
                            placeholder={require('../../../assets/splashDaisy.png')}
                            placeholderContentFit="contain"
                            transition={1000}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.4)']}
                            style={ProductDetailStyle.imageGradient}
                        />
                        <View style={[
                            ProductDetailStyle.freshnessTag,
                            getFreshnessStyle(product.freshness)
                        ]}>
                            <Text style={[
                                ProductDetailStyle.freshnessText,
                                { color: 'white' }
                            ]}>
                                {FRESHNESS_LABELS[product.freshness as keyof typeof FRESHNESS_LABELS]}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={ProductDetailStyle.contentContainer}>
                    <View style={ProductDetailStyle.mainInfo}>
                        <Text style={ProductDetailStyle.name}>{product.name}</Text>
                        <Text style={ProductDetailStyle.price}>
                            {product.saleType === 'fixed_price'
                                ? formatPrice(product.fixedPrice)
                                : 'Đấu giá'}
                        </Text>
                    </View>

                    <View style={ProductDetailStyle.sellerInfo}>
                        <Ionicons name="person-circle-outline" size={24} color="#666" />
                        <Text style={ProductDetailStyle.sellerName}>
                            {product.sellerId.userName}
                        </Text>
                    </View>

                    {product.saleType === 'auction' && auctionInfo && (
                        <View style={ProductDetailStyle.auctionInfoCard}>
                            <Text style={[
                                ProductDetailStyle.auctionStatus,
                                { color: AUCTION_STATUS_COLORS[auctionInfo.status as keyof typeof AUCTION_STATUS_COLORS] }
                            ]}>
                                {AUCTION_STATUS_LABELS[auctionInfo.status as keyof typeof AUCTION_STATUS_LABELS]}
                            </Text>
                            <Text style={ProductDetailStyle.auctionTitle}>Thông tin đấu giá</Text>
                            <View style={ProductDetailStyle.auctionDetails}>
                                <View style={ProductDetailStyle.auctionRow}>
                                    <Text style={ProductDetailStyle.auctionLabel}>Giá khởi điểm:</Text>
                                    <Text style={ProductDetailStyle.auctionValue}>
                                        {formatPrice(auctionInfo.startingPrice)}
                                    </Text>
                                </View>
                                {auctionInfo.isBuyNow && (
                                    <View style={ProductDetailStyle.auctionRow}>
                                        <Text style={ProductDetailStyle.auctionLabel}>Giá mua ngay:</Text>
                                        <Text style={ProductDetailStyle.auctionValue}>
                                            {formatPrice(auctionInfo.buyNowPrice)}
                                        </Text>
                                    </View>
                                )}
                                {auctionInfo.currentPrice && (
                                    <View style={ProductDetailStyle.auctionRow}>
                                        <Text style={ProductDetailStyle.auctionLabel}>Giá hiện tại:</Text>
                                        <Text style={[ProductDetailStyle.auctionValue, ProductDetailStyle.currentPrice]}>
                                            {formatPrice(auctionInfo.currentPrice)}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                    {product.saleType === 'auction' && auctionInfo?.isBuyNow && user?._id !== product.sellerId._id ? (
                        <TouchableOpacity
                            style={ProductDetailStyle.buyButton}
                            onPress={() => navigation.navigate('Checkout', { flowerId: product._id })}
                        >
                            <Text style={ProductDetailStyle.buyButtonText}>Mua ngay với giá {formatPrice(auctionInfo.buyNowPrice)}</Text>
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}
                    {user?._id !== product.sellerId._id && (
                        <TouchableOpacity
                            style={ProductDetailStyle.chatButton}
                            onPress={handleCreateConversation}
                        >
                            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                            <Text style={ProductDetailStyle.chatButtonText}>Chat với người bán</Text>
                        </TouchableOpacity>
                    )}

                    <View style={ProductDetailStyle.descriptionCard}>
                        <Text style={ProductDetailStyle.descriptionTitle}>Mô tả sản phẩm</Text>
                        <Text style={ProductDetailStyle.descriptionText}>
                            {product.description}
                        </Text>
                    </View>

                    <View style={ProductDetailStyle.detailsCard}>
                        <View style={ProductDetailStyle.detailRow}>
                            <Ionicons name="flower-outline" size={20} color="#666" />
                            <Text style={ProductDetailStyle.detailText}>
                                Danh mục: {product.categoryId.name}
                            </Text>
                        </View>
                        <View style={ProductDetailStyle.detailRow}>
                            <Ionicons name="information-circle-outline" size={20} color="#666" />
                            <Text style={ProductDetailStyle.detailText}>
                                Trạng thái: {PRODUCT_STATUS_LABELS[product.status as keyof typeof PRODUCT_STATUS_LABELS]}
                            </Text>
                        </View>
                    </View>

                    {product.saleType === 'auction' && (
                        <AuctionDetail key={auctionKey} flowerId={product._id} />
                    )}
                </View>
            </Animated.ScrollView>

            {/* Bottom Action Buttons */}
            <View style={ProductDetailStyle.bottomActions}>
                {product.saleType === 'fixed_price' && user?._id !== product.sellerId._id ? (
                    <TouchableOpacity
                        style={ProductDetailStyle.buyButton}
                        onPress={() => navigation.navigate('Checkout', { flowerId: product._id })}
                    >
                        <Text style={ProductDetailStyle.buyButtonText}>Mua ngay</Text>
                    </TouchableOpacity>
                ) : (
                    auctionInfo?.status === 'active' && user?._id !== product.sellerId._id && (
                        <View style={ProductDetailStyle.bidContainer}>
                            <TextInput
                                style={ProductDetailStyle.bidInput}
                                value={bidAmount}
                                onChangeText={handleBidAmountChange}
                                placeholder="Nhập giá đấu"
                                keyboardType="numeric"
                                placeholderTextColor="#999"
                            />
                            <TouchableOpacity
                                style={ProductDetailStyle.bidButton}
                                onPress={() => user ? handlePlaceBid() : navigation.navigate('Login')}
                            >
                                <Text style={ProductDetailStyle.bidButtonText}>Đặt giá</Text>
                            </TouchableOpacity>
                        </View>
                    )
                )}
            </View>
        </KeyboardAvoidingView >
    );
};

export default ProductDetail;