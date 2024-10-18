import mongoose from 'mongoose'
const { Schema } = mongoose

const DOCUMENT_NAME = 'Address';
const COLLECTION_NAME = 'Address';

const addressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    information: {
      type: [{
        name: { type: String },
        phone: { type: String },
        address: { type: String },
      }]
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const Address = mongoose.model(DOCUMENT_NAME, addressSchema)
export default Address
