import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatPrice } from '../utils';
import { Image } from 'expo-image';
const ProductCard = ({ data }: { data: any }) => {
    const navigation = useNavigation();

    const renderPriceInfo = () => {
        if (data.saleType === 'fixed_price') {
            return <Text style={styles.price}> ${formatPrice(data?.fixedPrice)}</Text>;
        } else if (data.saleType === 'auction') {
            return <Text style={styles.auctionText}>Auction</Text>;
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Detail', { id: data._id })}>
                <Image
                    style={styles.image}
                    source={{ uri: data.images[0] }}
                    contentFit="cover"
                    placeholder={require('../../assets/splashDaisy.png')}
                    placeholderContentFit="contain"
                    transition={1000}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.name} numberOfLines={1}>{data.name}</Text>
                    <View style={styles.priceContainer}>
                        {renderPriceInfo()}

                    </View>
                    <View style={styles.userStatusContainer}>
                        <Text style={styles.seller} numberOfLines={1}>{data.sellerId.userName}</Text>
                        <Text style={styles.status} numberOfLines={1}>{data?.status}</Text>
                    </View>

                </View>
                <View style={[styles.freshness, styles[data.freshness]]}>
                    <Text style={styles[data.freshness]}>{data.freshness}</Text>
                </View>
            </TouchableOpacity>

        </View>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        width: '48%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    infoContainer: {
        padding: 12,
    },
    name: {
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 4,
        color: '#2c3e50',
    },
    userStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seller: {
        fontSize: 12,
        color: '#7f8c8d',
        flex: 1,
        marginRight: 8,
    },
    status: {
        fontSize: 12,
        color: '#7f8c8d',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: '#16a085',
    },
    auctionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#e74c3c',
    },
    freshness: {
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        position: 'absolute',
        top: 5,
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