import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatPrice } from '../utils';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { AUCTION_STATUS_COLORS, AUCTION_STATUS_LABELS, FRESHNESS_LABELS } from '../constant/indext';

const FRESHNESS_COLORS = {
    fresh: ['#4CAF50', '#45B649'],
    slightly_wilted: ['#FF9800', '#F7971E'],
    wilted: ['#F44336', '#E57373'],
    expired: ['#795548', '#8D6E63']
};

const ProductCard = ({ data }: { data: any }) => {
    const navigation = useNavigation();

    const renderPriceInfo = () => {
        if (data.saleType === 'fixed_price') {
            return (
                <View style={styles.priceTag}>
                    <Text style={styles.price}>{formatPrice(data?.fixedPrice)}</Text>
                </View>
            );
        } else if (data.saleType === 'auction') {
            return (
                <View style={[styles.priceTag, styles.auctionTag]}>
                    <Text style={styles.auctionText}>Đấu giá</Text>
                </View>
            );
        }
    };

    const getFreshnessColors = () => {
        return FRESHNESS_COLORS[data.freshness as keyof typeof FRESHNESS_COLORS] || FRESHNESS_COLORS.expired;
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('Detail', { id: data._id })}
            activeOpacity={0.95}
        >
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={{ uri: data.images[0] }}
                    contentFit="cover"
                    placeholder={require('../../assets/splashDaisy.png')}
                    transition={300}
                    cachePolicy="memory-disk"
                />
                <LinearGradient
                    colors={getFreshnessColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.freshnessTag}
                >
                    <Text style={styles.freshnessText}>
                        {FRESHNESS_LABELS[data.freshness as keyof typeof FRESHNESS_LABELS]}
                    </Text>
                </LinearGradient>

                <View style={[
                    styles.statusBadge,
                    { backgroundColor: AUCTION_STATUS_COLORS[data.status as keyof typeof AUCTION_STATUS_COLORS] }
                ]}>
                    <Text style={styles.statusText}>
                        {AUCTION_STATUS_LABELS[data.status as keyof typeof AUCTION_STATUS_LABELS]}
                    </Text>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={1}>
                    {data.name}
                </Text>

                <View style={styles.bottomContainer}>
                    <View style={styles.sellerContainer}>
                        <View style={styles.sellerAvatar}>
                            <Text style={styles.sellerInitial}>
                                {data.sellerId.userName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text style={styles.sellerName} numberOfLines={1}>
                            {data.sellerId.userName}
                        </Text>
                    </View>
                    {renderPriceInfo()}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        width: '48%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        aspectRatio: 1,
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        padding: 12,
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sellerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    sellerAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    sellerInitial: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4CAF50',
    },
    sellerName: {
        fontSize: 13,
        color: '#666',
        flex: 1,
    },
    priceTag: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4CAF50',
    },
    auctionTag: {
        backgroundColor: '#FFE0B2',
    },
    auctionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#F57C00',
    },
    freshnessTag: {
        position: 'absolute',
        top: 8,
        right: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    freshnessText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    statusBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default ProductCard;