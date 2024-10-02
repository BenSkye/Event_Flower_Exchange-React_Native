import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';
import FeaturedFlowerCard from '../components/FeaturedFlowerCard';
import QuickLinkButton from '../components/QuickLinkButton';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ProductList from '../components/ProductList';
import Header from '../components/Header';
const HomeScreen = () => {
    const navigation = useNavigation();

    // State to hold data
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1); const [loading, setLoading] = useState(true);

    const fetchData = async (page: number) => {
        try {
            const categoryResponse = await axios.get('https://66eaaa3d55ad32cda479e676.mockapi.io/categorys');
            const flowerResponse = await axios.get(`https://66f4360577b5e8897098c4c6.mockapi.io/Flower?page=${page}&limit=10`);
            setCategories(categoryResponse.data);
            const newProducts = flowerResponse.data;
            setProducts((prevProducts: any[]) => [...prevProducts, ...newProducts]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from MockAPI
    useEffect(() => {
        fetchData(1);
    }, []);

    const loadMoreProducts = () => {
        console.log('loadMoreProducts')
        fetchData(page + 1);
        setPage(page + 1);
    };


    const handleBrowseFlowers = () => {
        // navigation.navigate('BrowseFlowersScreen');
    };

    const handleCreateListing = () => {
        // navigation.navigate('CreateListingScreen');
    };

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
            <Header />
            <ProductList products={products} loadMoreProducts={loadMoreProducts} />
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ebedef',
        paddingBottom: 50
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
