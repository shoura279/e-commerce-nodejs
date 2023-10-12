import { cartModel } from "../../../DB/Models/cart.model.js"
import { productModel } from "../../../DB/Models/product.model.js"


// add to cart
export const addToCart = async (req, res, next) => {
  const userId = req.user._id
  const { productId, quantity } = req.body
  const productCheck = await productModel.findById(productId)
  if (!productCheck) {
    return next(new Error('inavalid product', { cause: 400 }))
  }
  if (!productCheck.inStock(quantity)) {
    return next(new Error(`there are ${productCheck.stock} left in stock!`))
  }
  const isProductInCart = await cartModel.findOneAndUpdate(
    { userId, 'products.productId': productId },
    { $set: { 'products.$.quantity': quantity } }
  )
  if (!isProductInCart) {
    await cartModel.findOneAndUpdate(
      { userId },
      {
        $push: { products: { productId, quantity } }
      })
  }

  return res.status(200).json({ message: "added successfully" })

}

// get user cart
export const userCart = async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.user._id }).populate({
    path: 'products.productId',
    select: 'name '
  })
  return res.status(200).json({ result: cart, success: true })
}

// update cart
export const updateCart = async (req, res, next) => {
  // data
  const { productId, quantity } = req.body
  // check product
  const productCheck = await productModel.findById(productId)
  // check stock
  if (!productCheck.inStock(quantity)) {
    return next(new Error(`there are ${productCheck.stock} left in stock!`))
  }
  // update product
  const cart = await cartModel.findOneAndUpdate(
    {
      userId: req.user._id, 'products.productId': productId
    }
    ,
    {
      $set: { 'products.$.quantity': quantity }
    },
    {
      new: true
    }
  )
  // send response
  return res.status(200).json({ message: 'updated successfully' })
}

// remove product from cart
export const removeProduct = async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { products: { productId: req.params.productId } } },
    { new: true }
  )
  return res.status(200).json({ message: 'removed successfully', result: cart })
}

// clear cart
export const clearCart = async (req, res, next) => {
  const cart = await cartModel.findByIdAndUpdate({ userId: req.authUser._id }, { products: [] }, { new: true })
  return res.status(200).json({ message: 'clear successfully', result: cart })
}