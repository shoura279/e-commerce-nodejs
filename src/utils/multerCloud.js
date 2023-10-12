import multer from 'multer'
import { fileValidation } from './allowedExtensions.js'

export const fileUpload = (allowedExtensionsArr) => {
  if (!allowedExtensionsArr) {
    allowedExtensionsArr = fileValidation.Image
  }
  //================================== Storage =============================
  const storage = multer.diskStorage({})

  //================================== File Filter =============================
  const fileFilter = function (req, file, cb) {
    if (allowedExtensionsArr.includes(file.mimetype)) {
      return cb(null, true)
    }
    cb(new Error('invalid extension', { cause: 400 }), false)
  }

  const fileUpload = multer({
    fileFilter,
    storage,
  })
  return fileUpload
}
