import mongoose from 'mongoose'
import Validator from 'validator'
const { Schema } = mongoose

const DOCUMENT_NAME = 'Category';
const COLLECTION_NAME = 'Categories';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const Category = mongoose.model(DOCUMENT_NAME, categorySchema)
export default Category
