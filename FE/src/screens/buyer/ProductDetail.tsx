import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { getFlowerById } from '../../services/flower';
// import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Ionicons } from '@expo/vector-icons';
import AuctionDetail from './AuctionDetail';

type ParamList = {
    Detail: {
        id: string;
    };
};

const { width: screenWidth } = Dimensions.get('window');

const ProductDetail = () => {
    const route = useRoute<RouteProp<ParamList, 'Detail'>>();
    const [product, setProduct] = useState<any>(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = useRef(null);

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

    if (!product) {
        return (<View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>);
    }

    const renderCarouselItem = ({ item, index }: { item: any, index: number }) => {
        return (
            <Image
                source={{ uri: item }}
                style={styles.carouselImage}
            />
        );
    };
    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: product.images[0] }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>
                    {product.saleType === 'fixed_price'
                        ? `$${product.fixedPrice.toFixed(2)}`
                        : 'Auction'}
                </Text>
                <Text style={styles.seller}>Seller: {product.sellerId.userName}</Text>
                <Text style={styles.description}>{product.description}</Text>
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailItem}>Category: {product.categoryId.name}</Text>
                    <Text style={styles.detailItem}>Status: {product.status}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>
                    {product.saleType === 'fixed_price' ? 'Add to Cart' : 'Place Bid'}
                </Text>
            </TouchableOpacity>
            <View style={[styles.freshness, styles[product.freshness]]}>
                <Text style={styles[product.freshness]}>{product.freshness}</Text>
            </View>
            {product.saleType === 'auction' && (
                <AuctionDetail flowerId={product._id} />
            )}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 400,
        resizeMode: 'cover',
    },
    carouselContainer: {
        height: 300,
    },
    carouselImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 0,
        paddingVertical: 10,
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
    },
    infoContainer: {
        padding: 20,
    },
    name: {
        fontSize: 18,
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: '#16a085',
        marginBottom: 10,
    },
    seller: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    detailsContainer: {
        marginBottom: 20,
    },
    detailItem: {
        fontSize: 14,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    freshness: {
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        position: 'absolute',
        top: 15,
        right: 5,
    },
    fresh: {
        backgroundColor: '#e8f5e9',
        color: '#4caf50',
        borderRadius: 12,
    },
    slightly_wilted: {
        backgroundColor: '#fff3e0',
        color: '#ff9800',
        borderRadius: 12,
    },
    wilted: {
        backgroundColor: '#ffebee',
        color: '#f44336',
        borderRadius: 12,
    },
    expired: {
        backgroundColor: '#efebe9',
        color: '#795548',
        borderRadius: 12,
    },
});

export default ProductDetail;