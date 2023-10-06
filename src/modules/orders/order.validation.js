import joi from "joi"
import { payMethods } from "../../utils/enums.js"
// create order schema
export const createOrderSchema = {
  body: joi.object({
    phone: joi.string().length(11).required(),
    address: joi.string().required(),
    coupon: joi.string(),
    payment: joi.string().valid(payMethods.CASH, payMethods.VISA).required()
  }).required()
}