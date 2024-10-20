import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import ImageView from "react-native-image-viewing";
import { getFlowerById } from '../../services/flower';
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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getFlowerById(route.params.id);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [route.params.id]);

    const handleBackPress = () => {
        navigation.goBack();
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
            <ScrollView>
                <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>
                    <Image source={{ uri: product.images[0] }} style={ProductDetailStyle.image} />
                </TouchableOpacity>
                <View style={ProductDetailStyle.infoContainer}>
                    <Text style={ProductDetailStyle.name}>{product.name}</Text>
                    <Text style={ProductDetailStyle.price}>
                        {product.saleType === 'fixed_price'
                            ? `${formatPrice(product.fixedPrice)}`
                            : 'Auction'}
                    </Text>
                    <Text style={ProductDetailStyle.seller}>Seller: {product.sellerId.userName}</Text>
                    <Text style={ProductDetailStyle.description}>{product.description}</Text>
                    <View style={ProductDetailStyle.detailsContainer}>
                        <Text style={ProductDetailStyle.detailItem}>Category: {product.categoryId.name}</Text>
                        <Text style={ProductDetailStyle.detailItem}>Status: {product.status}</Text>
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
                    </TouchableOpacity>) : (

                    <TouchableOpacity style={ProductDetailStyle.button}>
                        <Text style={ProductDetailStyle.buttonText}>
                            Đặt giá
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={[ProductDetailStyle.freshness, getFreshnessStyle(product.freshness)]}>
                    <Text style={getFreshnessStyle(product.freshness)}>{product.freshness}</Text>
                </View>
                {product.saleType === 'auction' && (
                    <AuctionDetail flowerId={product._id} />
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
