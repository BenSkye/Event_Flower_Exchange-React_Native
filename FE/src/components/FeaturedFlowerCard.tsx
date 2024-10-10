import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface FeaturedFlowerCardProps {
    name: string;
    price: string;
    image: any;
}

const FeaturedFlowerCard: React.FC<FeaturedFlowerCardProps> = ({ name, price, image }) => {
    return (
        <View style={styles.featuredCard}>
            <Image source={image} style={styles.featuredImage} />
            <Text style={styles.featuredTitle}>{name}</Text>
            <Text style={styles.featuredPrice}>{price}</Text>
        </View>
    );
};

export default FeaturedFlowerCard;

const styles = StyleSheet.create({
    featuredCard: {
        width: 100,
        alignItems: 'center',
    },
    featuredImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    featuredTitle: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
        color: '#444',
    },
    featuredPrice: {
        fontSize: 12,
        color: '#888',
    },
});
