import joi from 'joi'
import { generalFields } from '../../middlewares/validation.js'

// create category schema
export const createCategorySchema = {
  body: joi.object({
    name: joi.string().required(),
  })
}

// update category schema
export const updateCategorySchema = {
  body: joi.object({
    name: joi.string().required(),
  }),
}
