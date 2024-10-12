import mongoose from 'mongoose'
import Validator from 'validator'
const { Schema } = mongoose

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: [true, 'Email không được để trống'],
      unique: true,
      validate: [Validator.isEmail, 'Email không hợp lệ']
    },
    userPhone: {
      type: Number,
      default: ''
      // required: true
    },
    userAddress: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    passwordChangeAt: Date,
    pushToken: {
      type: String,
      default: ''
    }
  },
  { timestamps: true, collection: COLLECTION_NAME } // Change 'timeStamp' to 'timestamps'
)

const User = mongoose.model(DOCUMENT_NAME, userSchema)
export default User
