import { Router } from 'express'
const router = Router()

import * as cc from './category.contoller.js'
import { fileUpload } from '../../utils/multerCloud.js'
import { fileValidation } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import { isValid } from '../../middlewares/validation.js'
import * as val from './category.validationSchemas.js'
import { isAuth } from '../../middlewares/auth.js'
import { categoryRoles } from './category.endPointeRoles.js'

// get all alwoed to all 
router.get('/', asyncHandler(cc.getAllCategories))

// auth to admin only 
router.use(isAuth(categoryRoles.CREAT_CATEGPRY))

// add category
router.post(
  '/',
  fileUpload(fileValidation.Image).single('image'),
  isValid(val.createCategorySchema),
  asyncHandler(cc.createCategory),
)

// update category
router.put(
  '/',
  fileUpload(fileValidation.Image).single('image'),
  isValid(val.updateCategorySchema),
  asyncHandler(cc.updateCategory),
)

// delete category
router.delete('/', asyncHandler(cc.deleteCategroy))

export default router
