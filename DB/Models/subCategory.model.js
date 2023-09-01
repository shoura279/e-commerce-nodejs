import mongoose, { Schema, model } from 'mongoose' // err
// import mongoose from 'mongoose'
// mongoose.models // right

const subCategoryScehma = new Schema(
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // TODO: convert to true after usermodel generation
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Catgeory',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

  },
)
// virtiul
subCategoryScehma.virtual('brands', {
  ref: 'Brand',
  localField: "_id",
  foreignField: "brandId"
})
// export const subCategoryModel = mongoose.models('subCategory') || mongoose.model('Catgeory', subCategoryScehma)
export const subCategoryModel =
  model.subCategory || mongoose.model('subCategory', subCategoryScehma)
