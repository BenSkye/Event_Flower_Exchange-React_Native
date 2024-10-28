import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import PagerView from 'react-native-pager-view';

import OrderItem from '../components/OrderItem';
import { getPersonalBuyOrder } from '../services/order';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';



const OrdersScreen = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [orders, setOrders] = useState([]);
    const pagerRef = useRef<PagerView>(null);
    const navigation = useNavigation<RootStackParamList>();

    useFocusEffect(
        useCallback(() => {
            const fetchOrder = async () => {
                try {
                    const response = await getPersonalBuyOrder();
                    console.log('response Order', response);
                    setOrders(response);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };

            fetchOrder();

            return () => {

            };
        }, [])
    );

    const tabs = [
        { key: 'pending', label: 'Chờ xác nhận' },
        { key: 'completed', label: 'Xác nhận' },
        { key: 'delivering', label: 'Đang giao' },
        { key: 'delivered', label: 'Đã giao' },
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
            <TouchableOpacity
                onPress={() => {
                    if (item.status === 'pending') {
                        navigation.navigate('Checkout', { flowerId: item.flowerId._id });
                    }
                    if (item.status === 'completed') {
                        navigation.navigate('OrderDetail', { orderCode: item.orderCode });

                    }
                }}
            >
                <OrderItem order={item} />
            </TouchableOpacity>
        </View>
    );

    const renderOrderList = (status: string) => {
        const filteredOrders = orders.filter(order => order.status === status);
        return (
            <FlatList
                data={filteredOrders}
                renderItem={renderOrder}
                keyExtractor={item => item._id}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text>No orders found</Text>
                    </View>
                }
                ListFooterComponent={
                    filteredOrders.length > 0 ? (
                        <View style={styles.footer}>
                            <Text>Hết đơn hàng</Text>
                        </View>
                    ) : null
                }
            />
        );
    };

    return (
        <View style={styles.container}>

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
                <View key="completed">{renderOrderList('completed')}</View>
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
