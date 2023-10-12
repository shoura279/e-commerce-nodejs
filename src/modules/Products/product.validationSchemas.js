import joi from 'joi'
import { generalFields } from '../../middlewares/validation.js'

// export const arrayParse = (value, helper) => {
//   value = JSON.parse(value)
//   const numberSchema = joi.object({
//     value: joi.array().items(joi.string()).required()
//   })
//   const validationRes = numberSchema.validate({ value })
//   if (validationRes.error) {
//     // console.log(validationRes);
//     return helper.message(validationRes.error.details[0].context.label)
//   }
//   return true
// }
export const addProductScheme = {
  body: joi.object({
    title: joi.string().min(4).max(55).required(),
    desc: joi.string().min(4).max(255),
    colors: joi.array().items(joi.string().required()).required(),
    sizes: joi.array().items(joi.string().required()),
    price: joi.number().positive().required(),
    appliedDiscount: joi.number().min(1).max(100).positive(),
    stock: joi.number().positive().required(),
  }).required(),
  query: joi.object({
    categoryId: generalFields._id,
    subCategoryId: generalFields._id,
    brandId: generalFields._id,
  })
    .required()
}

export const updateProductScheme = {
  body: joi.object({
    title: joi.string().min(4).max(55),
    desc: joi.string().min(4).max(255),
    colors: joi.array().items(joi.string().required()),
    sizes: joi.array().items(joi.string().required()),
    price: joi.number().positive(),
    appliedDiscount: joi.number().min(1).max(100).positive(),
    stock: joi.number().positive(),
  }).required(),
  query: joi.object({
    productId: generalFields._id.required(),
    categoryId: generalFields._id,
    subCategoryId: generalFields._id,
    brandId: generalFields._id,
  }).required()
}
