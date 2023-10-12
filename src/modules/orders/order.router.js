import { Router } from 'express'
import { isAuth } from '../../middlewares/auth.js'
import { roles } from '../../utils/enums.js'
import { isValid } from '../../middlewares/validation.js'
import * as val from './order.validation.js'
import * as oc from './order.controller.js'
const router = Router()
// create order
router.post('/',
  isAuth([roles.USER]),
  isValid(val.createOrderSchema),
  oc.createOrder
)

export default router