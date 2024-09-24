import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';
import FeaturedFlowerCard from '../components/FeaturedFlowerCard';
import QuickLinkButton from '../components/QuickLinkButton';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();

    // State to hold data
    const [categories, setCategories] = useState([]);
    const [featuredFlowers, setFeaturedFlowers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from MockAPI
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryResponse = await axios.get('https://66eaaa3d55ad32cda479e676.mockapi.io/categorys');
                const flowerResponse = await axios.get('https://66eaaa3d55ad32cda479e676.mockapi.io/flowerslist');
                setCategories(categoryResponse.data);
                setFeaturedFlowers(flowerResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBrowseFlowers = () => {
        // navigation.navigate('BrowseFlowersScreen');
    };

    const handleCreateListing = () => {
        // navigation.navigate('CreateListingScreen');
    };

    const handleFlowerPress = (flower) => {
        navigation.navigate('ProductDetail', { flower });
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
        <ScrollView contentContainerStyle={styles.container}>
            {/* Welcome Section */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Welcome to Event Flower Exchange</Text>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for flowers..."
                    placeholderTextColor="#aaa"
                />
            </View>

            {/* Categories Section */}
            <View style={styles.categoriesContainer}>
                <Text style={styles.sectionTitle}>Explore Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                    {categories.map((category) => (
                        <CategoryCard key={category.id} title={category.name} image={{ uri: category.image }} />
                    ))}
                </ScrollView>
            </View>

            {/* Featured Listings */}
            <View style={styles.featuredContainer}>
                <Text style={styles.sectionTitle}>Featured Listings</Text>
                <FlatList
                    data={featuredFlowers}
                    renderItem={({ item }) => (
                        <FeaturedFlowerCard
                            key={item.id}
                            name={item.name}
                            price={`$${item.price}`}
                            image={{ uri: item.image }}
                            onPress={() => handleFlowerPress(item)}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    horizontal
                    contentContainerStyle={styles.featuredList}
                />
            </View>

            {/* Quick Links */}
            <View style={styles.quickLinksContainer}>
                <Text style={styles.sectionTitle}>Quick Links</Text>
                <View style={styles.quickLinks}>
                    <QuickLinkButton text="Browse Flowers" onPress={handleBrowseFlowers} />
                    <QuickLinkButton text="Create a Listing" onPress={handleCreateListing} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f7f7f7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        marginBottom: 24,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    searchBar: {
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    categoriesContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#444',
    },
    categoryList: {
        flexDirection: 'row',
    },
    featuredContainer: {
        marginBottom: 24,
    },
    featuredList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickLinksContainer: {
        marginBottom: 24,
    },
    quickLinks: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default HomeScreen;
