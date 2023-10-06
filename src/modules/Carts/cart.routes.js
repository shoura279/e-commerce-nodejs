import { Router } from 'express'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as cc from './cart.controller.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import { isAuth } from '../../middlewares/auth.js'
import { systemRoles } from '../../utils/enums.js'
import { cartSchema, removeProductSchema } from './cart.validation.js'
const router = Router()


// add cart
router.post('/', isAuth([systemRoles.USER]), validationCoreFunction(cartSchema), asyncHandler(cc.addToCart))

// user cart
router.get('/', isAuth([systemRoles.USER]), cc.userCart)

// update cart
router.patch('/', isAuth([systemRoles.USER]), validationCoreFunction(cartSchema), cc.updateCart)

// clear cart
router.patch('/clear', isAuth([systemRoles.USER]), cc.clearCart)

// remove from cart
router.patch('/:productId', isAuth([systemRoles.USER]), validationCoreFunction(removeProductSchema), cc.removeProduct)

export default router
