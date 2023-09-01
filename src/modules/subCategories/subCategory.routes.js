import { Router } from 'express'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as sc from './subCategory.controller.js'
const router = Router()


router.get("/getall", asyncHandler(sc.getAllSubCategories))
router.get("/getWithBrand", asyncHandler(sc.getWithBrand))
router.post('/',
  multerCloudFunction(allowedExtensions.Image).single("image"),
  asyncHandler(sc.createSubCategory)
);
router
  .route("/:id")
  .put(
    multerCloudFunction(allowedExtensions.Image).single("image"),
    asyncHandler(sc.updateSubcategory)
  )
  .delete(asyncHandler(sc.deleteSubcategory));
export default router
