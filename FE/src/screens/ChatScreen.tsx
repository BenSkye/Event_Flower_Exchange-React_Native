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

const ChatScreen = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [conversation, setConversation] = useState<any>(null);
    const [newMessage, setNewMessage] = useState('');
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderPrice, setOrderPrice] = useState('');
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
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
        return (
            <View style={styles.orderInfo}>
                <Text style={styles.orderTitle}>Đơn hàng #{conversation.orderId.orderCode}</Text>
                <Text style={styles.orderPrice}>
                    Giá: {formatPrice(conversation.orderId.price)}
                </Text>
                <Text style={styles.orderStatus}>
                    Trạng thái: {conversation.orderId.status}
                </Text>
            </View>
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
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderPrice: {
        fontSize: 14,
        color: '#2196F3',
        marginTop: 4,
    },
    orderStatus: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
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
    cancelButton: {
        backgroundColor: '#666',
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