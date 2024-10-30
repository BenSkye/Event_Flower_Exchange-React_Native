import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import ProductList from '../components/ProductList';
import Header from '../components/Header';
import { getFlowers } from '../services/flower';
import useDebounce from '../hooks/useDebounce';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 100);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async (pageNumber: number, refresh: boolean = false) => {
        try {
            const { flowers, hasMore } = await getFlowers(pageNumber, 10, search);
            if (refresh) {
                setProducts(flowers);
            } else {
                setProducts((prevProducts: any[]) => [...prevProducts, ...flowers]);
            }
            setHasMore(hasMore);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setProducts([]);
        fetchData(1);
    }, [debouncedSearch]);


    const loadMoreProducts = () => {
        if (hasMore) {
            fetchData(page + 1);
            setPage(page + 1);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setProducts([]);
        setPage(1);
        fetchData(1, true);
    }, []);

    const handleSearch = (search: string) => {
        setSearch(search);
        fetchData(1, true);
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header setSearch={handleSearch} />
            <ProductList
                products={products}
                loadMoreProducts={loadMoreProducts}
                refreshing={refreshing}
                onRefresh={onRefresh}
                hasMore={hasMore}
            />
            {!hasMore && products.length > 0 && (
                <Text style={styles.endMessage}>Đã hết sản phẩm</Text>
            )}
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ebedef',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    endMessage: {
        textAlign: 'center',
        padding: 10,
        color: '#888',
    },
});
