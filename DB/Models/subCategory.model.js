import mongoose from 'mongoose'

const subCategoryScehma = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'docModel',
      required: true,
    },
    docModel: {
      type: String,
      required: true,
      enum: ['Catgeory', 'Brand'],
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
)

subCategoryScehma.virtual('brands', {
  ref: 'Brand',
  foreignField: 'subCategoryId',
  localField: '_id',
  // justOne: true,
})

export const subCategoryModel =
  mongoose.models.SubCategory ||
  mongoose.model('SubCategory', subCategoryScehma)
