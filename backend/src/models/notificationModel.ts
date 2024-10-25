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
      type: {
        title: String,
        body: String
      },
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      //new-auction-bid: đấu giá mới gửi thông báo cho tất cả người tham gia đấu giá 
      //order-success: đơn hàng thành công gửi thông báo cho seller
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const Notification = mongoose.model(DOCUMENT_NAME, notificationSchema)
export default Notification
