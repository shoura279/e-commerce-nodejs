import mongoose from 'mongoose' // err

const categoryScehma = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    Image: {
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // TODO: convert to true after usermodel generation
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

categoryScehma.virtual('subCategories', {
  ref: 'SubCategory',
  foreignField: 'categoryId',
  localField: '_id',
})

export const categoryModel = /*mongoose.models.Category||*/mongoose.model('Category', categoryScehma)



