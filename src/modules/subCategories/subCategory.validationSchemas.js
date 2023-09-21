import Joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

// create subcategory schema
export const createSubcategorySchema = {
    body: Joi.object({
        name: Joi.string().required()
    }).required(),
    file: Joi.object({
        image: generalFields.file.required()
    }).required(),
    query: Joi.object({
        categoryId: generalFields._id.required()
    }).required()
}

// update subcategory schema
export const updateSubcategorySchema = {
    body: Joi.object({
        name: Joi.string()
    }).required(),
    file: Joi.object({
        image: generalFields.file
    }).required(),
    query: Joi.object({
        subcategoryId: generalFields._id.required()
    }).required()
}

