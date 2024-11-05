import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import ConversationService from '../services/conversationService';
import authService from '../services/authService';

export class SocketManager {
  public io: Server;
  private chatNamespace: any;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000
    });

    this.chatNamespace = this.io.of('/api/v1/chat');

    // Sử dụng authentication middleware
    this.chatNamespace.use(async (socket: any, next: any) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const authServiceInstance = new authService();
        try {
          const currentUser = await authServiceInstance.protect(token);
          socket.data.user = currentUser;
          next();
        } catch (error) {
          next(new Error('Authentication failed'));
        }
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.chatNamespace.on('connection', (socket: any) => {
      console.log('Client connected to chat namespace:', socket.id);

      const userId = socket.data.user._id;
      socket.join(userId.toString());

      socket.on('createConversation', async (flowerId: string) => {
        try {
          const conversation = await ConversationService.createConversation(
            flowerId,
            socket.data.user._id
          );
          socket.emit('conversationCreated', conversation);
        } catch (error: any) {
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('getPersonalConversations', async () => {
        try {
          const conversations = await ConversationService.getPersonalConversation(
            socket.data.user._id
          );
          socket.emit('personalConversations', conversations);
        } catch (error: any) {
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('getConversationById', async (conversationId: string) => {
        try {
          const conversation = await ConversationService.getConversationById(
            conversationId
          );
          console.log('conversation79', conversation)
          socket.emit('conversationById', conversation);
        } catch (error: any) {
          socket.emit('error', { message: error.message });
        }
      });


      socket.on('joinRoom', (conversationId: string) => {
        socket.join(conversationId);
        console.log(`User joined room: ${conversationId}`);
      });

      socket.on('sendMessage', async (data: {
        conversationId: string;
        text: string;
      }) => {
        try {
          const conversation = await ConversationService.addMessage(
            data.conversationId,
            socket.data.user._id,
            data.text
          );
          this.chatNamespace.to(data.conversationId).emit('newMessage', conversation);

          // Lấy thông tin conversation để biết buyerId và sellerId
          const { buyerId, sellerId } = conversation as any;

          // Emit updateConversationList cho cả buyer và seller
          this.chatNamespace.to(buyerId.toString()).emit('updateConversationList');
          this.chatNamespace.to(sellerId.toString()).emit('updateConversationList');
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });

      socket.on('createOrderInConversation', async (data: { conversationId: string, price: number }) => {
        try {
          const conversation = await ConversationService.createOrderInConversation(
            data.conversationId,
            socket.data.user._id,
            data.price
          );

          // Emit to both users in the conversation
          this.chatNamespace.to(data.conversationId).emit('orderCreated', conversation);
        } catch (error: any) {
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('typing', (conversationId: string) => {
        socket.broadcast.to(conversationId).emit('userTyping');
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  public notifyNewOrder(conversationId: string, order: any) {
    this.chatNamespace.to(conversationId).emit('newOrder', order);
  }
}