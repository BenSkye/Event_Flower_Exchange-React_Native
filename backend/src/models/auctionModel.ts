import mongoose from 'mongoose'
import Validator from 'validator'
const { Schema } = mongoose

const DOCUMENT_NAME = 'Auction';
const COLLECTION_NAME = 'Auctions';

const auctionSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    flowerId: { type: Schema.Types.ObjectId, ref: 'Flower', required: true },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number },
    buyNowPrice: { type: Number },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'active', 'ended', 'sold'],
      default: 'pending'
    },
    bids: [{
      bidder: { type: Schema.Types.ObjectId, ref: 'User' },
      amount: Number,
      time: Date
    }
    ],
    winner: { type: Schema.Types.ObjectId, ref: 'User' },
    isBuyNow: { type: Boolean, default: false },
    buyNowUser: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const Auction = mongoose.model(DOCUMENT_NAME, auctionSchema)
export default Auction
