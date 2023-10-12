import joi from 'joi'
import { generalFields } from '../../middlewares/validation.js'

// login schema
export const loginSchema = {
  body: joi.object({
    email: generalFields.email,
    password: generalFields.password
  }).required()
}