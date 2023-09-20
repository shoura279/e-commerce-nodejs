



import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        subTotal: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true,
    },
)


export const cartModel = mongoose.models.cart || mongoose.model('cart', cartSchema)