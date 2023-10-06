import { Router } from 'express'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as sc from './subCategory.controller.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import { createSubcategorySchema, updateSubcategorySchema } from './subCategory.validationSchemas.js'
import { isAuth } from '../../middlewares/auth.js'
import { systemRoles } from '../../utils/enums.js'

const router = Router()
router.get('/', asyncHandler(sc.getAllSubCategories))
router.use(isAuth([systemRoles.ADMIN, systemRoles.SUPER_ADMIN]))
router.post(
  '/',
  multerCloudFunction(allowedExtensions.Image).single('image'),
  validationCoreFunction(createSubcategorySchema),
  asyncHandler(sc.createSubCategory),
)

router.put(
  '/',
  multerCloudFunction(allowedExtensions.Image).single('image'),
  validationCoreFunction(updateSubcategorySchema),
  asyncHandler(sc.updateSubcategory)
)
router.delete(
  '/',
  asyncHandler(sc.deleteSubcategory)
)
export default router
