import { Router } from 'express'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as cc from './coupon.controller.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import { addCouponSchema } from './coupon.validationSchemas.js'
import { isAuth } from '../../middlewares/auth.js'
import { systemRoles } from '../../utils/systemRoles.js'
const router = Router()



router.use(isAuth([systemRoles.ADMIN]))

router.post('/', validationCoreFunction(addCouponSchema), asyncHandler(cc.addCoupon))
export default router
