import { cartModel } from "../../../DB/Models/cart.model.js";
import { couponModel } from "../../../DB/Models/coupon.model.js";
import { orderModel } from "../../../DB/Models/order.model.js";
import { productModel } from "../../../DB/Models/product.model.js";

export const createOrder = async (req, res, next) => {
  // data
  const { phone, address, payment, coupon } = req.body
  // check coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await couponModel.findOne({ couponCode: coupon, couponStatus: 'valid' })
    if (checkCoupon) return next(new Error('invalid coupon!'))
  }

  // check cart
  const cart = await cartModel.findOne({ userId: req.authUser._id })
  const products = cart.products
  if (products.length < 0) {
    return next(new Error('cart empty!', { cause: 400 }))
  }
  let orderProducts = []
  let orderPrice = 0
  // check products
  for (const product of products) {
    const isExist = await productModel.findbyId(product.productId)
    // check existence
    if (!isExist)
      return next(new Error(`product ${product.productId} not found`))
    // check stock
    if (!isExist.inStock(product.quantity))
      return next(new Error(`product ${isExist.title} out off stock`))
    orderProducts.push({
      productId: product._id,
      quantity: product.quantity,
      name: product.title,
      itemPrice: isExist.finalPrice,
      totalPrice: isExist.finalPrice * product.quantity
    })
    orderPrice += isExist.finalPrice * product.quantity
  }

  // create order
  const order = await orderModel.create({
    user: req.authUser._id,
    phone,
    address,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.couponCode,
      discount: checkCoupon?.couponAmount
    },
    payment,
    price: orderPrice,
  })
}