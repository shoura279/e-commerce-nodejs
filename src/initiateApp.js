import * as allRouter from './modules/index.routes.js'
import { connectionDB } from '../DB/connection.js'
import { globalResponse } from './utils/errorhandling.js'
import morgan from 'morgan'
// import { userModel } from '../DB/Models/user.model.js'

export const initiateApp = (express, app) => {
  const port = process.env.PORT || 5000
  // morgan
  if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'))
  }
  app.use(express.json())
  connectionDB()
  app.use(`/category`, allRouter.categoryRouter)
  app.use('/subCategory', allRouter.subCategoryRouter)
  app.use('/brand', allRouter.brandRouter)
  app.use('/product', allRouter.prodcutRouter)
  app.use('/auth', allRouter.authRouter)
  app.use('/coupon', allRouter.couponRouter)
  app.use('/cart', allRouter.cartRouter)
  app.use('/order', allRouter.orderRouter)

  app.use(globalResponse)

  app.get('/', (req, res) => res.send('Hello World!'))

  //====================================== test hooks ============================
  // app.get('/user/delete/:_id', async (req, res) => {
  //   // =============================================================================== doc
  //   const user = new userModel({ _id: req.params._id })
  //   console.log({ user });
  //   const test = await user.deleteOne({})

  //   // =============================================================================== query
  //   // const user = await userModel.deleteOne({ _id: req.params._id })
  //   return res.json({ message: "done" })
  // }
  // )
  // app.get('/user/update', async (req, res) => {
  //   // =============================================================================== doc
  //   // const user = new userModel({ _id: req.params._id })
  //   // console.log({ user });
  //   // const test = await user.deleteOne({})

  //   // =============================================================================== query
  //   const user = await userModel.updateOne({ _id: req.query._id }, { userName: 'test' })
  //   return res.json({ message: "done" })
  // }
  // )

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
