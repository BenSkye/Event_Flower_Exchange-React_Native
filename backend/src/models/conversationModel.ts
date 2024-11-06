import mongoose from 'mongoose';
const { Schema } = mongoose;

const DOCUMENT_NAME = 'Conversation';
const COLLECTION_NAME = 'Conversations';

const conversationSchema = new Schema(
  {
    flowerId: {
      type: Schema.Types.ObjectId,
      ref: 'Flower',
      required: true
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    messages: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: 'User' },
        text: String,
        timestamp: { type: Date, default: Date.now }
      }
    ],
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open'
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

const Conversation = mongoose.model(DOCUMENT_NAME, conversationSchema);
export default Conversation;