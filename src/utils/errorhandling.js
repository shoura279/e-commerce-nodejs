import cloudinary from './coludinaryConfigrations.js'

export const asyncHandler = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch(async (err) => {
      console.log(err)
      //============================= cloud ======================
      if (req.method !== 'GET') {
        if (req.imagePath) {
          await cloudinary.api.delete_resources_by_prefix(req.imagePath)
          await cloudinary.api.delete_folder(req.imagePath)
        }
      }
      //========================= db ====================
      // handle insertMany case
      if (req.failedDocument) {
        const { model, _id } = req.failedDocument
        await model.findByIdAndDelete(_id)
      }
      //============================= db fail array ===============
      // let arr = []
      // for (const product of req.productArr) {
      //   arr.push(product._id)
      // }
      // await model.deleteMany({ _id: { $in: arr } })

      return next(new Error(err.message || err, { cause: 500 }))
    })
  }
}

export const globalResponse = (err, req, res, next) => {
  if (err) {
    if (req.validationErrorArr) {
      return res
        .status(err['cause'])
        .json({ message: 'Validationerror', Errors: req.validationErrorArr })
    }
    return res.status(err['cause'] || 500).json({ message: err.message || err })
  }
}