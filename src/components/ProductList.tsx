import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';

const ProductList = ({ products, loadMoreProducts }: { products: Array<any>, loadMoreProducts: () => void }) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={products as any[]}
                renderItem={({ item }) => (
                    <ProductCard
                        key={item.id}
                        name={item.name}
                        price={`$${item.price}`}
                        image={{ uri: item.image }}
                        seller={item.seller}
                    />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.row}
                onEndReached={loadMoreProducts}
                onEndReachedThreshold={0.1}
            />
        </View>
    );
};

export default ProductList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#444',
    },
    row: {
        flex: 1,
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    listContainer: {
        paddingBottom: 80,
    },
});