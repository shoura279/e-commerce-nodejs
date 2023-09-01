import * as allRouter from './modules/index.routes.js'
import { connectionDB } from '../DB/connection.js'
import { globalResponse } from './utils/errorhandling.js'

export const initiateApp = (express, app) => {
  const port = process.env.PORT || 5000

  app.use(express.json())
  connectionDB()
  app.use('/category', allRouter.categoryRouter)
  app.use('/subCategory', allRouter.subCategoryRouter)
  app.use('/brand', allRouter.brandRouter)
  app.use(globalResponse)

  app.get('/', (req, res) => res.send('Hello World!'))

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
