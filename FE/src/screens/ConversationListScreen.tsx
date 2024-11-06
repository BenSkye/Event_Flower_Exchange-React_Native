import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
    RefreshControl,
    Platform,
    StatusBar
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getPersonalConversation } from '../services/conversation';
import { RootStackParamList } from '../navigation/RootNavigator';
import { formatDateTime } from '../utils';
import SocketService from '../services/SocketService';

const ConversationListScreen = () => {
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<RootStackParamList>();
    const { user } = useAuth();

    const setupSocketListener = useCallback(() => {
        SocketService.onPersonalConversations((conversations: any[]) => {
            console.log('conversations received', conversations);
            setConversations(conversations);
            setLoading(false);
            setRefreshing(false);
        });
    }, []);

    const fetchConversations = useCallback(() => {
        setupSocketListener();

        SocketService.getPersonalConversations();

        SocketService.onUpdateConversationList(() => {
            SocketService.getPersonalConversations();
        });
    }, [setupSocketListener]);

    useFocusEffect(
        useCallback(() => {
            fetchConversations();
            return () => {
                SocketService.removePersonalConversationsListener();
            };
        }, [fetchConversations])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchConversations();
    }, [fetchConversations]);

    const renderConversationItem = ({ item }: any) => {
        const otherUser = user?._id === item.buyerId._id ? item.sellerId : item.buyerId;
        const lastMessage = item.messages[item.messages.length - 1];
        const isUnread = lastMessage && !lastMessage.read && lastMessage.senderId !== user?._id;

        return (
            <TouchableOpacity
                style={[styles.conversationItem, isUnread && styles.unreadContainer]}
                onPress={() => navigation.navigate('Chat', {
                    conversationId: item._id,
                    sellerId: item.sellerId._id,
                    buyerId: item.buyerId._id
                })}
                activeOpacity={0.7}
            >
                <Image
                    source={otherUser.avatar ? { uri: otherUser.avatar } : require('../../assets/splashDaisy.png')}
                    style={styles.avatar}
                />
                <View style={styles.conversationInfo}>
                    <View style={styles.headerRow}>
                        <Text style={styles.userName}>{otherUser.userName}</Text>
                        <Text style={styles.flowerName}>• {item.flowerId.name}</Text>
                    </View>
                    {lastMessage && (
                        <View style={styles.messageRow}>
                            <Text
                                style={[styles.lastMessage, isUnread && styles.unreadMessage]}
                                numberOfLines={1}
                            >
                                {lastMessage.text}
                            </Text>
                            <Text style={[styles.timestamp, isUnread && styles.unreadTimestamp]}>
                                {formatDateTime.timeMessage(lastMessage.timestamp)}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
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
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tin nhắn</Text>
            </View>
            <FlatList
                data={conversations}
                renderItem={renderConversationItem}
                keyExtractor={item => item._id}
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
                        <Image
                            source={require('../../assets/splashDaisy.png')}
                            style={styles.emptyIcon}
                        />
                        <Text style={styles.emptyText}>Không có cuộc trò chuyện nào</Text>
                        <Text style={styles.emptySubtext}>Hãy bắt đầu trò chuyện với người bán</Text>
                    </View>
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
        backgroundColor: '#FFFFFF'
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#4CAF50',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: 0.5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    listContainer: {
        flexGrow: 1,
    },
    conversationItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5',
        backgroundColor: '#FFFFFF',
    },
    unreadContainer: {
        backgroundColor: '#FFF8F8',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 16,
        backgroundColor: '#F5F5F5'
    },
    conversationInfo: {
        flex: 1,
        justifyContent: 'center'
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        letterSpacing: 0.1
    },
    flowerName: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 8,
        fontWeight: '500'
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    lastMessage: {
        fontSize: 14,
        color: '#666666',
        flex: 1,
        marginRight: 12,
        lineHeight: 20
    },
    unreadMessage: {
        color: '#1A1A1A',
        fontWeight: '500'
    },
    timestamp: {
        fontSize: 12,
        color: '#999999',
        marginLeft: 'auto'
    },
    unreadTimestamp: {
        color: '#FF6B6B',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 60
    },
    emptyIcon: {
        width: 120,
        height: 120,
        marginBottom: 24,
        opacity: 0.8
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        letterSpacing: 0.3
    }
});

export default ConversationListScreen;