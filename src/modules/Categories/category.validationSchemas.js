import Joi from 'joi'

export const createCategorySchema = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
}
