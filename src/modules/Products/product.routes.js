import { Router } from 'express'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as pc from './prodcut.controller.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import {
  addProductScheme,
  updateProductScheme,
} from './product.validationSchemas.js'
const router = Router()

router.post(
  '/',
  multerCloudFunction(allowedExtensions.Image).array('image', 2),
  validationCoreFunction(addProductScheme),
  asyncHandler(pc.addProduct),
)
router.put(
  '/',
  multerCloudFunction(allowedExtensions.Image).array('image', 2),
  validationCoreFunction(updateProductScheme),
  asyncHandler(pc.updateProduct),
)

router.get('/', asyncHandler(pc.listProducts))
export default router
