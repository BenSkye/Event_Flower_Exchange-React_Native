import mongoose from 'mongoose'
import Validator from 'validator'
const { Schema } = mongoose

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
    },
    information: {
      type: Object,
      required: true
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const Notification = mongoose.model(DOCUMENT_NAME, notificationSchema)
export default Notification
