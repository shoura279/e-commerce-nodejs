import { Router } from 'express'
import { fileUpload } from '../../utils/multerCloud.js'
import { fileValidation } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as pc from './prodcut.controller.js'
import { isValid } from '../../middlewares/validation.js'
import * as val from './product.validationSchemas.js'
import { isAuth } from '../../middlewares/auth.js'
import { roles } from '../../utils/enums.js'


const router = Router()
// get all product
router.get('/', asyncHandler(pc.listProducts))

// get specific product
router.get('/:productId',
  asyncHandler(pc.getSpecific)
)
// auth
router.use(isAuth([roles.SUPER_ADMIN, roles.ADMIN]))
// add product
router.post(
  '/',
  fileUpload(fileValidation.Image).array('image', 2),
  isValid(val.addProductScheme),
  asyncHandler(pc.addProduct),
)

// update product
router.put(
  '/',
  fileUpload(fileValidation.Image).array('image', 2),
  isValid(val.updateProductScheme),
  asyncHandler(pc.updateProduct),
)

// delete product
router.delete(
  '/',
  asyncHandler(pc.deleteProduct)
)
export default router
