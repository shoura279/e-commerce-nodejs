import { Router } from 'express'
const router = Router()

import * as cc from './category.contoller.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import { createCategorySchema, updateCategorySchema } from './category.validationSchemas.js'
import { isAuth } from '../../middlewares/auth.js'
import { categoryRoles } from './category.endPointeRoles.js'

// get all alwoed to all 
router.get('/', asyncHandler(cc.getAllCategories))

// auth to admin only 
router.use(isAuth(categoryRoles.CREAT_CATEGPRY))

// add category
router.post(
  '/',
  multerCloudFunction(allowedExtensions.Image).single('image'),
  validationCoreFunction(createCategorySchema),
  asyncHandler(cc.createCategory),
)

// update category
router.put(
  '/',
  multerCloudFunction(allowedExtensions.Image).single('image'),
  validationCoreFunction(updateCategorySchema),
  asyncHandler(cc.updateCategory),
)

// delete category
router.delete('/', asyncHandler(cc.deleteCategroy))

export default router
