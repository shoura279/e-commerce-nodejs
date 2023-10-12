import { Router } from 'express'
import { fileUpload } from '../../utils/multerCloud.js'
import { fileValidation } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as sc from './subCategory.controller.js'
import { isValid } from '../../middlewares/validation.js'
import { createSubcategorySchema, updateSubcategorySchema } from './subCategory.validationSchemas.js'
import { isAuth } from '../../middlewares/auth.js'
import { roles } from '../../utils/enums.js'

const router = Router()
router.get('/', asyncHandler(sc.getAllSubCategories))
router.use(isAuth([roles.ADMIN, roles.SUPER_ADMIN]))
router.post(
  '/',
  fileUpload(fileValidation.Image).single('image'),
  isValid(createSubcategorySchema),
  asyncHandler(sc.createSubCategory),
)

router.put(
  '/',
  fileUpload(fileValidation.Image).single('image'),
  isValid(updateSubcategorySchema),
  asyncHandler(sc.updateSubcategory)
)
router.delete(
  '/',
  asyncHandler(sc.deleteSubcategory)
)
export default router
