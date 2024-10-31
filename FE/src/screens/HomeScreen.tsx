import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';
import ProductList from '../components/ProductList';
import { getFlowers } from '../services/flower';
import useDebounce from '../hooks/useDebounce';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { AUCTION_STATUS_COLORS, AUCTION_STATUS_LABELS } from '../constant/indext';

const FRESHNESS_OPTIONS = {
    all: 'Tất cả',
    fresh: 'Tươi',
    slightly_wilted: 'Hơi héo',
    wilted: 'Héo'
};

const SALE_TYPE_OPTIONS = {
    all: 'Tất cả',
    fixed_price: 'Giá cố định',
    auction: 'Đấu giá'
};

const FRESHNESS_COLORS = {
    fresh: '#4CAF50',
    slightly_wilted: '#FF9800',
    wilted: '#F44336'
};

const HomeScreen = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 100);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [filterStatus, setFilterStatus] = useState('all');
    const [filterFreshness, setFilterFreshness] = useState('all');
    const [filterSaleType, setFilterSaleType] = useState('all');

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

    const filterProducts = useCallback((products: any[]) => {
        return products.filter(product => {
            const statusMatch = filterStatus === 'all' || product.status === filterStatus;
            const freshnessMatch = filterFreshness === 'all' || product.freshness === filterFreshness;
            const saleTypeMatch = filterSaleType === 'all' || product.saleType === filterSaleType;
            return statusMatch && freshnessMatch && saleTypeMatch;
        });
    }, [filterStatus, filterFreshness, filterSaleType]);

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
    }

    const resetFilters = () => {
        setFilterStatus('all');
        setFilterFreshness('all');
        setFilterSaleType('all');
    };

    const getActiveFilterCount = () => {
        return [
            filterStatus !== 'all',
            filterFreshness !== 'all',
            filterSaleType !== 'all'
        ].filter(Boolean).length;
    };

    const renderActiveFilters = () => {
        const activeFilters = [];
        if (filterStatus !== 'all') {
            activeFilters.push({
                type: 'Trạng thái',
                value: AUCTION_STATUS_LABELS[filterStatus as keyof typeof AUCTION_STATUS_LABELS],
                color: AUCTION_STATUS_COLORS[filterStatus as keyof typeof AUCTION_STATUS_COLORS]
            });
        }
        if (filterFreshness !== 'all') {
            activeFilters.push({
                type: 'Độ tươi',
                value: FRESHNESS_OPTIONS[filterFreshness as keyof typeof FRESHNESS_OPTIONS],
                color: FRESHNESS_COLORS[filterFreshness as keyof typeof FRESHNESS_COLORS]
            });
        }
        if (filterSaleType !== 'all') {
            activeFilters.push({
                type: 'Loại bán',
                value: SALE_TYPE_OPTIONS[filterSaleType as keyof typeof SALE_TYPE_OPTIONS],
                color: '#4CAF50'
            });
        }

        return activeFilters.length > 0 ? (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.activeFiltersScroll}
            >
                {activeFilters.map((filter, index) => (
                    <View
                        key={index}
                        style={[
                            styles.activeFilterTag,
                            { borderColor: filter.color }
                        ]}
                    >
                        <Text style={[styles.activeFilterType, { color: filter.color }]}>
                            {filter.type}:
                        </Text>
                        <Text style={[styles.activeFilterText, { color: filter.color }]}>
                            {filter.value}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        ) : null;
    };


    const renderHeader = () => (
        <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerContainer}
        >
            <View style={styles.headerTop}>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.title}>AE Shop</Text>
                    <Text style={styles.subtitle}>Tìm kiếm những bông hoa tươi đẹp nhất</Text>
                </View>
            </View>

            <View style={styles.searchWrapper}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search-outline" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm hoa..."
                        placeholderTextColor="#999"
                        value={search}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>
        </LinearGradient>
    );


    const renderFilterSummary = () => (
        <View style={styles.filterSummaryContainer}>
            <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilters(true)}
            >
                <MaterialIcons name="filter-list" size={24} color="#4CAF50" />
                <Text style={styles.filterButtonText}>Bộ lọc</Text>
                {getActiveFilterCount() > 0 && (
                    <View style={styles.filterBadge}>
                        <Text style={styles.filterBadgeText}>
                            {getActiveFilterCount()}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
            {renderActiveFilters()}
        </View>
    );

    const renderFilterModal = () => (
        <Modal
            visible={showFilters}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowFilters(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Bộ lọc</Text>
                        <TouchableOpacity
                            onPress={() => setShowFilters(false)}
                            style={styles.closeButton}
                        >
                            <MaterialIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalBody}>
                        {/* Status Filters */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Trạng thái:</Text>
                            <View style={styles.filterOptions}>
                                {['all', 'available', 'in_auction', 'sold'].map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        style={[
                                            styles.filterOption,
                                            filterStatus === status && [
                                                styles.filterOptionActive,
                                                {
                                                    borderColor: status !== 'all'
                                                        ? AUCTION_STATUS_COLORS[status as keyof typeof AUCTION_STATUS_COLORS]
                                                        : '#4CAF50'
                                                }
                                            ]
                                        ]}
                                        onPress={() => setFilterStatus(status)}
                                    >
                                        <Text style={[
                                            styles.filterOptionText,
                                            filterStatus === status && [
                                                styles.filterOptionTextActive,
                                                {
                                                    color: status !== 'all'
                                                        ? AUCTION_STATUS_COLORS[status as keyof typeof AUCTION_STATUS_COLORS]
                                                        : '#4CAF50'
                                                }
                                            ]
                                        ]}>
                                            {status === 'all' ? 'Tất cả' : AUCTION_STATUS_LABELS[status as keyof typeof AUCTION_STATUS_LABELS]}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Freshness Filters */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Độ tươi:</Text>
                            <View style={styles.filterOptions}>
                                {Object.keys(FRESHNESS_OPTIONS).map((freshness) => (
                                    <TouchableOpacity
                                        key={freshness}
                                        style={[
                                            styles.filterOption,
                                            filterFreshness === freshness && [
                                                styles.filterOptionActive,
                                                {
                                                    borderColor: freshness !== 'all'
                                                        ? FRESHNESS_COLORS[freshness as keyof typeof FRESHNESS_COLORS]
                                                        : '#4CAF50'
                                                }
                                            ]
                                        ]}
                                        onPress={() => setFilterFreshness(freshness)}
                                    >
                                        <Text style={[
                                            styles.filterOptionText,
                                            filterFreshness === freshness && [
                                                styles.filterOptionTextActive,
                                                {
                                                    color: freshness !== 'all'
                                                        ? FRESHNESS_COLORS[freshness as keyof typeof FRESHNESS_COLORS]
                                                        : '#4CAF50'
                                                }
                                            ]
                                        ]}>
                                            {FRESHNESS_OPTIONS[freshness as keyof typeof FRESHNESS_OPTIONS]}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Sale Type Filters */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Loại bán:</Text>
                            <View style={styles.filterOptions}>
                                {Object.keys(SALE_TYPE_OPTIONS).map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.filterOption,
                                            filterSaleType === type && styles.filterOptionActive
                                        ]}
                                        onPress={() => setFilterSaleType(type)}
                                    >
                                        <Text style={[
                                            styles.filterOptionText,
                                            filterSaleType === type && styles.filterOptionTextActive
                                        ]}>
                                            {SALE_TYPE_OPTIONS[type as keyof typeof SALE_TYPE_OPTIONS]}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={resetFilters}
                        >
                            <Text style={styles.resetButtonText}>Đặt lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={() => setShowFilters(false)}
                        >
                            <Text style={styles.applyButtonText}>Áp dụng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF97C1" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderFilterSummary()}
            {renderFilterModal()}
            <ProductList
                products={filterProducts(products)}
                loadMoreProducts={loadMoreProducts}
                refreshing={refreshing}
                onRefresh={onRefresh}
                hasMore={hasMore}
            />
            {/* {!hasMore && products.length > 0 && (
                <Text style={styles.endMessage}>Đã hết sản phẩm</Text>
            )} */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: 60,
    },
    headerContainer: {
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    headerTop: {
        marginBottom: 20,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 14,
        color: '#E8F5E9',
        opacity: 0.9,
    },
    searchWrapper: {
        paddingHorizontal: 8,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    notificationButton: {
        padding: 8,
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#FF5252',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    notificationBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cartButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 12,
        borderRadius: 12,
    },
    filterSummaryContainer: {
        padding: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    filterButtonText: {
        marginLeft: 8,
        color: '#4CAF50',
        fontWeight: '500',
    },
    filterBadge: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    filterBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    activeFiltersScroll: {
        flexGrow: 0,
    },
    activeFilterTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
    },
    activeFilterType: {
        fontSize: 12,
        fontWeight: '600',
        marginRight: 4,
    },
    activeFilterText: {
        fontSize: 12,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 16,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    resetButton: {
        flex: 1,
        padding: 12,
        marginRight: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    resetButtonText: {
        color: '#4CAF50',
        textAlign: 'center',
        fontWeight: '500',
    },
    applyButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
    },
    applyButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '500',
    },
    filterGroup: {
        marginBottom: 16,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    filterOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        margin: 4,
    },
    filterOptionActive: {
        backgroundColor: '#E8F5E9',
        borderWidth: 1,
    },
    filterOptionText: {
        color: '#666',
        fontSize: 14,
    },
    filterOptionTextActive: {
        fontWeight: '500',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#ebedef',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    endMessage: {
        textAlign: 'center',
        color: '#666',
        padding: 16,
        fontStyle: 'italic',
    },
});

export default HomeScreen;