import mongoose from 'mongoose'
import Validator from 'validator'
const { Schema } = mongoose

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema(
  {
    orderCode: {
      type: Number,
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
    flowerId: {
      type: Schema.Types.ObjectId,
      ref: 'Flower',
      required: true
    },
    auctionId: {
      type: Schema.Types.ObjectId,
      ref: 'Auction',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'delivering', 'delivered', 'cancel', 'boom'],
      default: 'pending'
    },
    price: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
    },
    delivery: {
      type: Object
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const Order = mongoose.model(DOCUMENT_NAME, orderSchema)
export default Order
