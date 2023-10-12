import mongoose, { Schema, model, Types } from "mongoose";
// schema
const orderSchema = new Schema({
  user: { type: Types.ObjectId, ref: "user", required: true },
  products: [{
    _id: false,
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, min: 1 },
    name: String,
    itemPrice: Number,
    totalPrice: Number
  }],
  invoice: String,
  address: { type: String, required: true },
  phone: { type: String, required: true },
  price: { type: Number, required: true },
  coupon: {
    id: { type: Types.ObjectId, ref: 'Coupon' },
    name: String,
    discount: Number
  },
  status: {
    type: String,
    enum: ['placed', 'shipped', 'delivered', 'canceled', 'refunded'],
    default: 'placed'
  },
  payment: {
    type: String,
    enum: ['visa', 'cash'],
    default: 'cash'
  }
},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)
// virtual
orderSchema.virtual('finalPrice').get(function () {
  return this.coupon
    ? Number.parseFloat(this.price - (this.price * this.coupon.discount) / 100).toFixed(2)
    : this.price
})
// model
export const orderModel = /*mongoose.models.Order ||*/ model('Order', orderSchema)