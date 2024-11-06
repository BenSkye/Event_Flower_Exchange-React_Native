import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Modal
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SocketService from '../services/SocketService';
import { useAuth } from '../context/AuthContext';
import { getConversationById } from '../services/conversation';
import { formatInputPrice, formatPrice, parseInputPrice } from '../utils';
import { ORDER_STATUS_LABELS } from '../constant/indext';
import { RootStackParamList } from '../navigation/RootNavigator';

const ChatScreen = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [conversation, setConversation] = useState<any>(null);
    const [newMessage, setNewMessage] = useState('');
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderPrice, setOrderPrice] = useState('');
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<RootStackParamList>();
    const { user } = useAuth();
    const route = useRoute<any>();
    const flatListRef = useRef<FlatList>(null);
    const { conversationId, sellerId, buyerId } = route.params;

    useEffect(() => {
        SocketService.getConversationById(conversationId);

        SocketService.onConversationById((conversation: any) => {
            console.log('conversation', conversation)
            if (conversation) {
                setConversation(conversation);
                setMessages(conversation.messages);
            }
            setLoading(false);
        });

        SocketService.onOrderCreated((conversation: any) => {
            console.log('conversation47', conversation)
            setConversation(conversation);
        });

        SocketService.onCancelOrder((conversation: any) => {
            console.log('conversation51', conversation)
            setConversation(conversation);
        });

        SocketService.joinRoom(conversationId);

        // Listen for new messages
        SocketService.onNewMessage((conversation: any) => {
            console.log('conversation', conversation)
            setMessages(conversation.messages);
            flatListRef.current?.scrollToEnd();
        });

        // Cleanup when component unmounts
        return () => {
            SocketService.removeAllListeners();
        };
    }, [conversationId]);

    const handleCreateOrder = () => {
        if (!orderPrice.trim()) return;
        SocketService.createOrderInConversation(conversationId, parseInputPrice(orderPrice));
        setShowOrderModal(false);
        setOrderPrice('');
    };

    const handleSend = () => {
        if (newMessage.trim()) {
            SocketService.sendMessage(conversationId, newMessage.trim());
            setNewMessage('');
        }
    };

    useEffect(() => {
        console.log('messages62', messages)
    }, [messages])

    const otherUser = user?._id === conversation?.buyerId?._id
        ? conversation?.sellerId
        : conversation?.buyerId;

    const renderMessage = ({ item }: { item: any }) => {
        const isCurrentUser = item.senderId === user?._id;

        return (
            <View style={[
                styles.messageContainer,
                isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
            ]}>
                <Text style={[
                    styles.messageText,
                    isCurrentUser ? styles.currentUserText : styles.otherUserText
                ]}>
                    {item.text}
                </Text>
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
                <Text style={styles.userName}>{otherUser?.userName || ''}</Text>
                <Text style={styles.flowerName}>{conversation?.flowerId?.name || ''}</Text>
            </View>
            {user?._id === conversation?.sellerId?._id && !conversation?.orderId && (
                <TouchableOpacity
                    style={styles.createOrderButton}
                    onPress={() => setShowOrderModal(true)}
                >
                    <Text style={styles.createOrderButtonText}>Tạo đơn hàng</Text>
                </TouchableOpacity>
            )}
        </View>
    );


    const renderOrderInfo = () => {
        if (!conversation?.orderId) return null;
        const isPending = conversation.orderId.status === 'pending';
        const isSeller = user?._id === conversation?.sellerId?._id;

        const handleOrderPress = () => {
            if (isPending && !isSeller) {
                navigation.navigate('Checkout', {
                    flowerId: conversation.flowerId._id,
                    orderId: conversation.orderId._id
                });
            } else {
                navigation.navigate('OrderDetail', {
                    orderId: conversation.orderId._id
                });
            }
        };

        const handleCancelOrder = () => {
            if (isPending && isSeller) {
                SocketService.cancelOrderInConversation(conversationId);
            }
        };

        return (
            <TouchableOpacity
                style={styles.orderInfo}
                onPress={handleOrderPress}
            >
                <View style={styles.orderHeader}>
                    <Text style={styles.orderTitle}>#{conversation.orderId.orderCode}</Text>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: isPending ? '#FFC107' : '#4CAF50' }
                    ]}>
                        <Text style={styles.statusText}>
                            {ORDER_STATUS_LABELS[conversation.orderId.status as keyof typeof ORDER_STATUS_LABELS]}
                        </Text>
                    </View>
                </View>
                <View style={styles.orderDetails}>
                    <Text style={styles.orderPrice}>
                        {formatPrice(conversation.orderId.price)}
                    </Text>
                    {isPending && (
                        <View style={styles.orderActions}>
                            {isSeller ? (
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={handleCancelOrder}
                                >
                                    <Text style={styles.actionButtonText}>Hủy đơn</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={styles.paymentButton}
                                    onPress={handleOrderPress}
                                >
                                    <Text style={styles.actionButtonText}>Thanh toán</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };


    const renderOrderModal = () => (
        <Modal
            visible={showOrderModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowOrderModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Tạo đơn hàng</Text>
                    <TextInput
                        style={styles.priceInput}
                        value={formatInputPrice(orderPrice)}
                        onChangeText={setOrderPrice}
                        keyboardType="numeric"
                        placeholder="Nhập giá"
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setShowOrderModal(false)}
                        >
                            <Text style={styles.buttonText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={handleCreateOrder}
                        >
                            <Text style={styles.buttonText}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );


    return (
        <View style={styles.container}>

            {loading ? <ActivityIndicator size="large" color="#0084ff" /> : (
                <>
                    {renderHeader()}
                    {renderOrderInfo()}
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                    >
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            renderItem={renderMessage}
                            keyExtractor={(item, index) => index.toString()}
                            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                        />

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={newMessage}
                                onChangeText={setNewMessage}
                                placeholder="Type a message..."
                                multiline
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                                <Ionicons name="send" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                    {renderOrderModal()}

                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingTop: Platform.OS === 'ios' ? 16 : 16,
    },
    backButton: {
        marginRight: 16,
    },
    headerInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    flowerName: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    chatContainer: {
        flex: 1,
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 15,
    },
    currentUserMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#0084ff',
    },
    otherUserMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e4e6eb',
    },
    messageText: {
        fontSize: 16,
    },
    currentUserText: {
        color: '#fff',
    },
    otherUserText: {
        color: '#000',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#0084ff',
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createOrderButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 8,
    },
    createOrderButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    orderInfo: {
        backgroundColor: '#fff',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderPrice: {
        fontSize: 16,
        color: '#2196F3',
        fontWeight: 'bold',
    },
    orderActions: {
        flexDirection: 'row',
    },
    cancelButton: {
        backgroundColor: '#F44336',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
    },
    paymentButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    priceInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginLeft: 10,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default ChatScreen;