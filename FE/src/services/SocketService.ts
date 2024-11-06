import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, TOKEN_KEY } from './api';

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public async connect() {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);

            this.socket = io(`${BASE_URL}/chat`, {
                auth: {
                    token
                },
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 20000,
                forceNew: true
            });

            this.socket.on('connect', () => {
                console.log('Connected to socket server');
            });

            this.socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                console.error('Error stack:', error.stack);
            });

            this.socket.on('error', (error) => {
                console.error('Socket error:', error);
            });

        } catch (error) {
            console.error('Error connecting to socket:', error);
        }
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
    public createConversation(flowerId: string) {
        if (this.socket) {
            this.socket.emit('createConversation', flowerId);
        }
    }

    public onConversationCreated(callback: (conversation: any) => void) {
        if (this.socket) {
            this.socket.on('conversationCreated', callback);
        }
    }

    public getPersonalConversations() {
        if (this.socket) {
            this.socket.emit('getPersonalConversations');
        }
    }

    public onPersonalConversations(callback: (conversations: any[]) => void) {
        if (this.socket) {
            this.socket.on('personalConversations', callback);
        }
    }

    public getConversationById(conversationId: string) {
        if (this.socket) {
            this.socket.emit('getConversationById', conversationId);
        }
    }

    public onConversationById(callback: (conversation: any) => void) {
        if (this.socket) {
            this.socket.on('conversationById', callback);
        }
    }

    public createOrderInConversation(conversationId: string, price: number) {
        if (this.socket) {
            this.socket.emit('createOrderInConversation', { conversationId, price });
        }
    }

    public onOrderCreated(callback: (order: any) => void) {
        if (this.socket) {
            this.socket.on('orderCreated', callback);
        }
    }

    public cancelOrderInConversation(conversationId: string) {
        if (this.socket) {
            this.socket.emit('cancelOrderInConversation', conversationId);
        }
    }

    public onCancelOrder(callback: (order: any) => void) {
        if (this.socket) {
            this.socket.on('cancelOrder', callback);
        }
    }




    public joinRoom(conversationId: string) {
        if (this.socket) {
            this.socket.emit('joinRoom', conversationId);
        }
    }

    public sendMessage(conversationId: string, text: string) {
        if (this.socket) {
            this.socket.emit('sendMessage', {
                conversationId,
                text
            });
        }
    }

    public onNewMessage(callback: (message: any) => void) {
        if (this.socket) {
            this.socket.on('newMessage', callback);
        }
    }

    public onNewOrder(callback: (order: any) => void) {
        if (this.socket) {
            this.socket.on('newOrder', callback);
        }
    }

    public onUserTyping(callback: () => void) {
        if (this.socket) {
            this.socket.on('userTyping', callback);
        }
    }

    public emitTyping(conversationId: string) {
        if (this.socket) {
            this.socket.emit('typing', conversationId);
        }
    }

    // Cleanup method to remove all listeners
    public removeAllListeners() {
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    }

    public removePersonalConversationsListener() {
        if (this.socket) {
            this.socket.off('personalConversations');
        }
    }

    public removeConversationByIdListener() {
        if (this.socket) {
            this.socket.off('conversationById');
        }
    }

    public removeNewMessageListener() {
        if (this.socket) {
            this.socket.off('newMessage');
        }
    }

    public onUpdateConversationList(callback: () => void) {
        if (this.socket) {
            this.socket.on('updateConversationList', callback);
        }
    }

    public removeUpdateConversationListListener() {
        if (this.socket) {
            this.socket.off('updateConversationList');
        }
    }
}

export default SocketService.getInstance();