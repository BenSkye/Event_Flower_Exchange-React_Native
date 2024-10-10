import mongoose from 'mongoose'
import Validator from 'validator'
const { Schema } = mongoose

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema(
  {
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
    status: {
      type: String,
      enum: ['pending', 'delivering', 'delivered'],
      default: 'pending'
    },
    price: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const Order = mongoose.model(DOCUMENT_NAME, orderSchema)
export default Order
