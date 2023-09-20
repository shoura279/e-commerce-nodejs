import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    // ======================= Text section ====================
    title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    desc: String,

    // ====================== price ==================
    price: {
      type: Number,
      required: true,
    },
    appliedDiscount: {
      type: Number,
      default: 0,
    },
    priceAfterDiscount: {
      type: Number,
      default: 0,
    },

    //====================== quantity ================
    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    //====================== images ============
    Images: [
      {
        secure_url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    customId: String,

    //==================== Ids ==================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // TODO: convert to true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    //====================== specifictions ==========
    colors: [String],
    sizes: [String],
  },
  {
    timestamps: true,
  },
)

export const productModel =
  mongoose.models.Product || mongoose.model('Product', productSchema)
