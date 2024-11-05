import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
    RefreshControl
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

    // useEffect(() => {
    //     fetchConversations();
    //     return () => {
    //         SocketService.removePersonalConversationsListener();
    //     };
    // }, [fetchConversations]);

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

        return (
            <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => navigation.navigate('Chat', {
                    conversationId: item._id,
                    sellerId: item.sellerId._id,
                    buyerId: item.buyerId._id
                })}
            >
                <Image
                    source={otherUser.avatar ? { uri: otherUser.avatar } : require('../../assets/splashDaisy.png')}
                    style={styles.avatar}
                />
                <View style={styles.conversationInfo}>
                    <Text style={styles.userName}>{otherUser.userName}</Text>
                    <Text style={styles.flowerName}>{item.flowerId.name}</Text>
                    {lastMessage && (
                        <>
                            <Text style={styles.lastMessage} numberOfLines={1}>
                                {lastMessage.text}
                            </Text>
                            <Text style={styles.timestamp}>
                                {formatDateTime.timeMessage(lastMessage.timestamp)}
                            </Text>
                        </>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0084ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
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
                    <Text style={styles.emptyText}>Không có cuộc trò chuyện nào</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    conversationItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15
    },
    conversationInfo: {
        flex: 1,
        justifyContent: 'center'
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4
    },
    flowerName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4
    },
    timestamp: {
        fontSize: 12,
        color: '#999'
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666'
    }
});

export default ConversationListScreen;