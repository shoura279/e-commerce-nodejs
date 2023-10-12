import mongoose, { Schema, Types, model } from "mongoose";

const couponScehma = new Schema({
  name: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: true,
    min: 1, max: 100
  },
  expierdAt: Number,
  createdBy: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

export const couponModel =
  /*mongoose.models.Coupon||*/
  model('Coupon', couponScehma)