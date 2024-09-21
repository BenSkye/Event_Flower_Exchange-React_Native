import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';
import FeaturedFlowerCard from '../components/FeaturedFlowerCard';
import QuickLinkButton from '../components/QuickLinkButton';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView >
                <View style={styles.header}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter search ..."
                            placeholderTextColor="#666"
                        />
                    </View>
                    <TouchableOpacity style={styles.cartButton}>
                        <Ionicons name="cart-outline" size={24} color="black" />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>1</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Categories Section */}
            {/* <View style={styles.categoriesContainer}>
                <Text style={styles.sectionTitle}>Explore Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                    {categories.map((category) => (
                        <CategoryCard key={category.id} title={category.name} image={{ uri: category.image }} />
                    ))}
                </ScrollView>
            </View> */}

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
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.featuredList}
                />
            </View>


        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f7f7f7',
        paddingBottom: 50
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
        paddingHorizontal: 10,
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,

    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    searchIcon: {
        paddingLeft: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    cartButton: {
        padding: 5,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: -5,
        top: -5,
        backgroundColor: '#a9dfbf',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
