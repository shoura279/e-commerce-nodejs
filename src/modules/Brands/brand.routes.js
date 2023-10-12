import { Router } from 'express'
import { fileUpload } from '../../utils/multerCloud.js'
import { fileValidation } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as bc from './brand.controller.js'
import { isAuth } from '../../middlewares/auth.js'
import { roles } from '../../utils/enums.js'
const router = Router()

// get all brand
router.get('/', asyncHandler(bc.getAllBrands))

// auth 
router.use(isAuth([roles.ADMIN]))

// add brand
router.post(
  '/',
  fileUpload(fileValidation.Image).single('logo'),
  asyncHandler(bc.addBrand),
)

// update brand
router.put('/',
  fileUpload(fileValidation.Image).single('logo'),
  asyncHandler(bc.updateBrand)
)

// delete brand
router.delete('/',
  asyncHandler(bc.deleteBrand)
)
export default router
