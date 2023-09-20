import { cartModel } from "../../../DB/Models/cart.model.js"
import { productModel } from "../../../DB/Models/product.model.js"



export const addToCart = async (req, res, next) => {
    const userId = req.authUser._id
    const { productId, quantity } = req.body
    const productCheck = await productModel.findOne({
        _id: productId,
        stock: { $gte: quantity }
    })
    console.log(productCheck);
    if (!productCheck) {
        return next(new Error('inavalid product', { cause: 400 }))
    }
    const cart = await cartModel.findOne({ userId })

    // let subTotal = 0
    // for (const product of req.body.products) {
    //     const productCheck = await productModel.findOne({
    //         _id: product.productId,
    //         stock: { $gte: product.quantity }
    //     })
    //     subTotal += productCheck.priceAfterDisacount * product.quantity
    // }

    if (!cart) {
        const cartObject = {
            userId,
            products: [{ productId, quantity }],
            subTotal: productCheck.priceAfterDiscount * quantity
        }

        const cartdb = await cartModel.create(cartObject)
        // handle by hook , setTimeOut
        // productCheck.stock -= quantity
        // await productCheck.save()
        return res.json({ message: "Done", cartdb })
    }

    //=================== if cart exists =======================

}