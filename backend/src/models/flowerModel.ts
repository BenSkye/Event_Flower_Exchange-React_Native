import mongoose from 'mongoose'
import Validator from 'validator'
const { Schema } = mongoose

const DOCUMENT_NAME = 'Flower';
const COLLECTION_NAME = 'Flowers';

const flowerSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    images: [
      {
        type: String,
        required: true
      }
    ],
    saleType: {
      type: String,
      enum: ['fixed_price', 'auction'],
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'in_auction', 'sold', 'unavailable'],
      default: 'available'
    },
    freshness: {
      type: String,
      enum: ['fresh', 'slightly_wilted', 'wilted', 'expired'],
      default: 'fresh'
    },
    fixedPrice: { type: Number },
    lastSoldPrice: { type: Number },
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const Flower = mongoose.model(DOCUMENT_NAME, flowerSchema)
export default Flower
