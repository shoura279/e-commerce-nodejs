import Joi from 'joi'
import { generalFields } from '../../middlewares/validation.js'

export const addProductScheme = {
  body: Joi.object({
    title: Joi.string().min(4).max(55).required(),
    desc: Joi.string().min(4).max(255) ,
    colors: Joi.array().items(Joi.string().required()).required(),
    sizes: Joi.array().items(Joi.string().required()) ,
    price: Joi.number().positive().required(),
    appliedDiscount: Joi.number().min(1).max(100).positive() ,
    stock: Joi.number().positive().required(),
  }).required(),
  query: Joi.object({
    categoryId: generalFields._id,
    subCategoryId: generalFields._id,
    brandId: generalFields._id,
  })
    .required()
    .options({ presence: 'required' }),
}

export const updateProductScheme = {
  body: Joi.object({
    title: Joi.string().min(4).max(55) ,
    desc: Joi.string().min(4).max(255) ,
    colors: Joi.array().items(Joi.string().required()) ,
    sizes: Joi.array().items(Joi.string().required()) ,
    price: Joi.number().positive() ,
    appliedDiscount: Joi.number().min(1).max(100).positive() ,
    stock: Joi.number().positive() ,
  }).required(),
  query: Joi.object({
    productId: generalFields._id.required(),
    categoryId: generalFields._id ,
    subCategoryId: generalFields._id,
    brandId: generalFields._id ,
  }).required(),
  files:Joi.array().items(generalFields.file)
}
