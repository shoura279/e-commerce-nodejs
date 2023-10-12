import mongoose from 'mongoose'

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subCategory',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    logo: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    customId: String,
  },
  {
    timestamps: true,
  },
)


export const brandModel = mongoose.model('Brand', brandSchema)