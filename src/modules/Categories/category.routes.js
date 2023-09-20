import { Router } from 'express'
const router = Router()

import * as cc from './category.contoller.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import { createCategorySchema } from './category.validationSchemas.js'
import { isAuth } from '../../middlewares/auth.js'
import { categoryRoles } from './category.endPointeRoles.js'


router.use(isAuth(categoryRoles.CREAT_CATEGPRY))
router.post(
  '/',
  multerCloudFunction(allowedExtensions.Image).single('image'),
  validationCoreFunction(createCategorySchema),
  asyncHandler(cc.createCategory),
)
router.put(
  '/',
  multerCloudFunction(allowedExtensions.Image).single('image'),
  asyncHandler(cc.updateCategory),
)
router.delete('/', asyncHandler(cc.deleteCategroy))
router.get('/', asyncHandler(cc.getAllCategories))
export default router
