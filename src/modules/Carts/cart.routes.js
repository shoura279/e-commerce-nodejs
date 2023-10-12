import { Router } from 'express'
import { fileValidation } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as cc from './cart.controller.js'
import { isValid } from '../../middlewares/validation.js'
import { isAuth } from '../../middlewares/auth.js'
import { roles } from '../../utils/enums.js'
import { cartSchema, removeProductSchema } from './cart.validation.js'
const router = Router()


// add cart
router.post('/', isAuth([roles.USER]), isValid(cartSchema), asyncHandler(cc.addToCart))

// user cart
router.get('/', isAuth([roles.USER]), cc.userCart)

// update cart
router.patch('/', isAuth([roles.USER]), isValid(cartSchema), cc.updateCart)

// clear cart
router.patch('/clear', isAuth([roles.USER]), cc.clearCart)

// remove from cart
router.patch('/:productId', isAuth([roles.USER]), isValid(removeProductSchema), cc.removeProduct)

export default router
