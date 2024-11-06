import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { getPersonalNotification } from '../services/notification';
import { Link, useFocusEffect, useNavigation } from '@react-navigation/native';
import { formatDateTime } from '../utils';

interface NotificationItemProps {
    title: string;
    message: string;
    time: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ title, message, time }) => (
    <View style={styles.notificationItem}>
        <View style={styles.notificationIcon}>
            <Text style={styles.iconText}>🔔</Text>
        </View>
        <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.time}>{new Date(time).toLocaleDateString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })}</Text>
        </View>
    </View>
);

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await getPersonalNotification();
            setNotifications(response);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
            return () => { };
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.touchable}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Detail', { id: item?.data?.flowerId?.toString() })}
                    >
                        <NotificationItem
                            title={item.message.title}
                            message={item.message.body}
                            time={item.createdAt}
                        />
                    </TouchableOpacity>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#FF6B6B']}
                        tintColor="#FF6B6B"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
                    </View>
                }
                ListFooterComponent={
                    notifications.length > 0 ?
                        <Text style={styles.footerText}>Đã hết thông báo</Text> : null
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        marginLeft: 4,
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    notificationItem: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFE8E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconText: {
        fontSize: 20,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    message: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    time: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
    touchable: {
        transform: [{ scale: 1 }],
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    footerText: {
        textAlign: 'center',
        color: '#999',
        padding: 16,
        fontSize: 14,
    },
});

export default NotificationsScreen;