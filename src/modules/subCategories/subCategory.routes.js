import { Router } from 'express'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as sc from './subCategory.controller.js'
const router = Router()

router.post(
  '/',
  multerCloudFunction(allowedExtensions.Image).single('image'),
  asyncHandler(sc.createSubCategory),
)
router.get('/', asyncHandler(sc.getAllSubCategories))
export default router
