import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import PagerView from 'react-native-pager-view';

import OrderItem from '../components/OrderItem';

const sampleOrders = [
    {
        id: '1',
        saller: 'BenDan',
        status: 'pending',
        productName: 'Hoa đám cưới cần thanh lý',
        productImage: 'https://f131flower.com/imgdata/images/WHHSCF6756762511851433.jpg',
        quantity: 1,
        itemCount: 1,
        totalAmount: 27,
    },
    {
        id: '2',
        saller: 'Luanlil',
        status: 'delivering',
        productName: 'Hoa thôi nôi',
        productImage: 'https://stc.hoatuoihoangnga.com/data/uploads/products/1472/gio-hoa-gau-trang-dang-yeu.1.jpg?v=1704352647?v=1704352647',
        quantity: 1,
        itemCount: 1,
        totalAmount: 27.1,
    }, {

        id: '3',
        saller: 'Tyty',
        status: 'delivered',
        productName: 'Hoa hồng trắng',
        productImage: 'https://hoathangtu.com/wp-content/uploads/2023/01/IMG_0147-scaled.jpg',
        quantity: 1,
        itemCount: 1,
        totalAmount: 15.35,
    }, {
        id: '4',
        saller: 'Khanho',
        status: 'delivered',
        productName: 'Hoa cúng rằm',
        productImage: 'https://ttol.vietnamnetjsc.vn/images/2022/01/17/08/58/ram-thang-chap-4.jpg',
        quantity: 1,
        itemCount: 1,
        totalAmount: 10,
    }, {
        id: '5',
        saller: 'quanga',
        status: 'delivered',
        productName: 'Hoa tết',
        productImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJv7R0eE5V6fS-484wv37rVExTTGvgNdSG3Q&s',
        quantity: 1,
        itemCount: 1,
        totalAmount: 10,
    }, {
        id: '6',
        saller: 'Tyty',
        status: 'delivered',
        productName: 'Hoa mặt trời',
        productImage: 'https://sanvemaybay.vn/includes/uploads/2021/12/hoa-huong-duong_112958596-1-e1639571024309.jpg',
        quantity: 1,
        itemCount: 1,
        totalAmount: 10,
    },
    // Thêm các đơn hàng khác cho trạng thái này
]

const OrdersScreen = () => {
    const [activeTab, setActiveTab] = useState(0);
    const pagerRef = useRef<PagerView>(null);

    const tabs = [
        { key: 'pending', label: 'Pending' },
        { key: 'delivering', label: 'Delivering' },
        { key: 'delivered', label: 'Delivered' },
    ];

    // useEffect(() => {
    //     if (pagerRef.current && pagerRef.current.setPage) {
    //         pagerRef.current.setPage(activeTab);
    //     }
    // }, [activeTab]);

    const handleTabPress = useCallback((index: number) => {
        setActiveTab(index);
        if (pagerRef.current) {
            if (typeof pagerRef.current.setPage === 'function') {
                pagerRef.current.setPage(index);
            } else if (typeof pagerRef.current.setPageWithoutAnimation === 'function') {
                pagerRef.current.setPageWithoutAnimation(index);
            } else {
                console.warn('PagerView ref does not have expected methods');
            }
        } else {
            console.warn('PagerView ref is not available');
        }
    }, []);

    const renderTab = (tab: typeof tabs[0], index: number) => (
        <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => {
                handleTabPress(index);
            }}
        >
            <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
                {tab.label}
            </Text>
        </TouchableOpacity>
    );

    const renderOrder = ({ item }: { item: any }) => (
        <View style={styles.orderItem}>
            <OrderItem order={item} />
        </View>
    );

    const renderOrderList = (status: string) => {
        const filteredOrders = sampleOrders.filter(order => order.status === status);
        return (
            <FlatList
                data={filteredOrders}
                renderItem={renderOrder}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text>No orders found</Text>
                    </View>
                }
                ListFooterComponent={
                    filteredOrders.length > 0 ? (
                        <View style={styles.footer}>
                            <Text>No more orders</Text>
                        </View>
                    ) : null
                }
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Orders</Text>
            </View>
            <View style={styles.tabContainer}>
                {tabs.map((tab, index) => renderTab(tab, index))}
            </View>
            <PagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={e => setActiveTab(e.nativeEvent.position)}
            >
                <View key="pending">{renderOrderList('pending')}</View>
                <View key="delivering">{renderOrderList('delivering')}</View>
                <View key="delivered">{renderOrderList('delivered')}</View>
            </PagerView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    header: {
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingVertical: 10,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#4CAF50',
    },
    tabText: {
        color: '#333',
    },
    activeTabText: {
        color: '#4CAF50',
    },
    pagerView: {
        flex: 1,
    },
    orderItem: {
        marginBottom: 5,
        paddingHorizontal: 15,
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 60,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
});

export default OrdersScreen;
