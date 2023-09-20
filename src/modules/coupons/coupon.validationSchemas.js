import Joi from "joi";
import { generalFields } from "../../middlewares/validation.js";




export const addCouponSchema = {
    body: Joi.object({
        couponCode: Joi.string().min(5).max(10).required(),
        couponAmount: Joi.number().required(),
        fromDate: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).required(),
        toDate: Joi.date().greater(Joi.ref('fromDate')).required(),
        isPercentage: Joi.boolean(),
        isFixedAmount: Joi.boolean(),
        couponAssginedToUsers: Joi.array().items(
            Joi.object({
                userId: generalFields._id.required(),
                maxUsage: Joi.number().required()
            })).required()
    }).required()
}

