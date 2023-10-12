import joi from 'joi'
// create coupon schema
export const createCouponSchema = {
  body: joi.object().keys({
    discount: joi.number().min(0).max(100).required(),
    expierdAt: joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).required()
  }).required()
}

// update coupon schema
export const updateCouponSchema = {
  body: joi.object().keys({
    discount: joi.number().min(0).max(100),
    expierdAt: joi.date().greater(Date.now() - 24 * 60 * 60 * 1000)
  }).required(),
  params: joi.object().keys({
    code: joi.string().length(5).required()
  }).required()
}

// delete coupon schema
export const deleteCouponSchema = {
  params: joi.object().keys({
    code: joi.string().length(5).required()
  }).required()
}
