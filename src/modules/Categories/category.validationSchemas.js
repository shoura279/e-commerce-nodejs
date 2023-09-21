import Joi from 'joi'
import { generalFields } from '../../middlewares/validation.js'

// create category schema
export const createCategorySchema = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
  file: Joi.object({
    image: generalFields.file.required()
  }).required()
}

// update category schema
export const updateCategorySchema = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
  file: Joi.object({
    image: generalFields.file.required()
  }).required()
}
