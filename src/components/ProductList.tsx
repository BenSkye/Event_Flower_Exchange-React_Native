import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import ProductCard from './ProductCard';

const ProductList = ({ products, loadMoreProducts, refreshing, onRefresh, }: { products: Array<any>, loadMoreProducts: () => void, refreshing: boolean, onRefresh: () => void }) => {
    const numColumns = 2;
    return (
        <View style={styles.container}>
            <FlatList
                key={`flatlist-${numColumns}-columns`}
                data={products as any[]}
                renderItem={({ item }) => (
                    <ProductCard
                        key={item._id}
                        data={item}
                    />
                )}
                keyExtractor={(item) => item._id}
                numColumns={numColumns}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.row}
                onEndReached={loadMoreProducts}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#9Bd35A', '#689F38']}
                    />
                }
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