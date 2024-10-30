import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Text,
} from 'react-native';
import ProductCard from './ProductCard';

interface ProductListProps {
    products: any[];
    loadMoreProducts: () => void;
    refreshing: boolean;
    onRefresh: () => void;
    hasMore: boolean;
}

const ProductList = ({
    products,
    loadMoreProducts,
    refreshing,
    onRefresh,
    hasMore,
}: ProductListProps) => {
    const renderFooter = () => {
        if (!hasMore) {
            return (
                <View style={styles.footerMessage}>
                    <Text style={styles.endMessage}>Đã tải hết sản phẩm</Text>
                </View>
            );
        }
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#4CAF50" />
            </View>
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <ProductCard data={item} />
    );

    return (
        <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContainer}
            onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.5}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#4CAF50']}
                    tintColor="#4CAF50"
                />
            }
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 8,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    footerMessage: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    endMessage: {
        color: '#666',
        fontSize: 14,
        fontStyle: 'italic',
    },
});

export default ProductList;