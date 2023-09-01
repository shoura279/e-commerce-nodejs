import mongoose, { Schema, model } from 'mongoose' // err
// import mongoose from 'mongoose'
// mongoose.models // right

const categoryScehma = new Schema(
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
      type: Schema.Types.ObjectId,
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
  ref: 'subCategory',
  foreignField: 'categoryId',
  localField: '_id',
})

// export const categoryModel = mongoose.models('Category') || mongoose.model('Catgeory', categoryScehma)
export const categoryModel =
  model.Category || mongoose.model('Catgeory', categoryScehma)
