import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import ProductCard from './ProductCard';

const ProductList = ({ products, loadMoreProducts, refreshing, onRefresh, hasMore }: { products: Array<any>, loadMoreProducts: () => void, refreshing: boolean, onRefresh: () => void, hasMore: boolean }) => {
    const numColumns = 2;

    const renderFooter = () => {
        if (!hasMore) return (<Text style={styles.endMessage}>Đã hết sản phẩm</Text>);
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        );
    };

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
                ListFooterComponent={renderFooter}
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
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    }, endMessage: {
        textAlign: 'center',
        padding: 10,
        color: '#888',
    },
});
