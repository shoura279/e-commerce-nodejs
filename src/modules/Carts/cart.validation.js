import joi from "joi";
import { generalFields } from "../../middlewares/validation.js";
// cart schema
export const cartSchema = {
  body: joi.object({
    productId: generalFields._id,
    quantity: joi.number().min(1).required()
  }).required()
}

// remove product from cart
export const removeProductSchema = {
  body: joi.object({
    productId: generalFields._id,
  }).required()
}