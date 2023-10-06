import { Router } from 'express'
import { isAuth } from '../../middlewares/auth.js'
import { systemRoles } from '../../utils/enums.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import * as val from './order.validation.js'
import * as oc from './order.controller.js'
const router = Router()
// create order
router.post('/',
  isAuth([systemRoles.USER]),
  validationCoreFunction(val.createOrderSchema),
  oc.createOrder
)

export default router