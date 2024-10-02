import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProductCard = ({ name, price, image, seller }: { name: string, price: string, image: object, seller: string }) => {
    return (
        <View style={styles.container}>
            <Image source={image} style={styles.image} />
            <Text style={styles.name}>{name}</Text>
            <View style={styles.sellerAndPrice}>
                <Text style={styles.price}>{price}</Text>
                <Text style={styles.seller}>{seller}</Text>
            </View>
        </View>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        width: '48%',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    name: {
        fontSize: 14,
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        color: '#16a085',
        margin: 4

    },
    seller: {
        fontSize: 10,
        color: '#7f8c8d',
        margin: 4
    },
    sellerAndPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 4
    },
});