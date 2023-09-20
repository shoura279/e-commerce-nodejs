import { Router } from 'express'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as cc from './cart.controller.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import { isAuth } from '../../middlewares/auth.js'
import { systemRoles } from '../../utils/systemRoles.js'
const router = Router()



router.post('/', isAuth([systemRoles.USER]), asyncHandler(cc.addToCart))

export default router
