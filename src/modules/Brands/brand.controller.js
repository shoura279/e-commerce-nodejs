import slugify from 'slugify'
import { subCategoryModel } from '../../../DB/Models/subCategory.model.js'
import cloudinary from '../../utils/coludinaryConfigrations.js'
import { categoryModel } from '../../../DB/Models/category.model.js'
import { customAlphabet } from 'nanoid'
import { brandModel } from '../../../DB/Models/brand.model.js'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

export const addBrand = async (req, res, next) => {
  const { name } = req.body
  const { subCategoryId } = req.query

  //=================== subCategory ===========
  const subCategory = await subCategoryModel.findById(subCategoryId)
  if (!subCategory) {
    return next(new Error('subCategory Id Invalid', { cause: 400 }))
  }

  const category = await categoryModel.findById(subCategory.categoryId)

  const slug = slugify(name, {
    replacement: '_',
    lower: true,
    trim: true,
  })

  if (!req.file) {
    return next(new Error('please upload your logo', { cause: 400 }))
  }
  const customId = nanoid()
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${customId}`,
    },
  )
  req.imagePath = `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${customId}`

  //   const x = 5
  //   x = 9

  const brandObject = {
    name,
    slug,
    subCategoryId,
    categoryId: subCategory.categoryId,
    customId,
    logo: { secure_url, public_id },
  }
  const brandDB = await brandModel.create(brandObject)

  if (!brandDB) {
    await cloudinary.uploader.destroy(public_id)
    await cloudinary.api.delete_folder(
      `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${customId}`,
    )
    return next(new Error('fail', { cause: 400 }))
  }

  res.status(201).json({ message: 'Done', brandDB })
}

// ========================== get all category =======================
export const getAllBrands = async (req, res, next) => {
  const Brands = await brandModel.find().populate([
    {
      path: 'subCategoryId',
      populate: [
        {
          path: 'categoryId',
        },
      ],
    },
  ])
  res.status(200).json({ message: 'Done', Brands })
}
