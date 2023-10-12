import { Router } from 'express'
import { asyncHandler } from '../../utils/errorhandling.js'
import { isValid } from '../../middlewares/validation.js'
import { isAuth } from '../../middlewares/auth.js'
import { roles } from '../../utils/enums.js'
import * as val from './coupon.validationSchemas.js'
import * as cc from './coupon.controller.js'
const router = Router()

// CRUD
// all coupons
router.get('/', asyncHandler(cc.allcoupons)
)

// create coupon
router.post(
  '/',
  isAuth([roles.ADMIN, roles.SUPER_ADMIN]),
  isValid(val.createCouponSchema),
  (cc.createCoupon)
)
// update coupon
router.put(
  '/:code',
  isAuth([roles.ADMIN, roles.SUPER_ADMIN]),
  isValid(val.updateCouponSchema),
  (cc.updateCoupon)
)
// delete coupon
router.delete(
  '/:code',
  isAuth([roles.ADMIN, roles.SUPER_ADMIN]),
  isValid(val.deleteCouponSchema),
  (cc.deleteCoupon)
)

export default router
