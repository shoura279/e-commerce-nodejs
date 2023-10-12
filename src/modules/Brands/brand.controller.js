import slugify from 'slugify'
import { subCategoryModel } from '../../../DB/Models/subCategory.model.js'
import cloudinary from '../../utils/coludinaryConfigrations.js'
import { categoryModel } from '../../../DB/Models/category.model.js'
import { customAlphabet } from 'nanoid'
import { brandModel } from '../../../DB/Models/brand.model.js'
import { Apifeatures } from '../../utils/apiFeatures.js'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)
// ================= add brand ======================
export const addBrand = async (req, res, next) => {
  const { name } = req.body
  const { subCategoryId } = req.query

  //=================== subCategory ===========
  const subCategory = await subCategoryModel.findById(subCategoryId)
  if (!subCategory) {
    return next(new Error('subCategory Id Invalid', { cause: 400 }))
  }

  // const category = await categoryModel.findById(subCategory.categoryId)

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
// ========================== update brands ====================
export const updateBrand = async (req, res, next) => {
  // data 
  const { name } = req.body
  // check existence
  const brandExist = await brandModel.findById(req.query.brandId)
  if (!brandExist) {
    return next(new Error('brand not exist ', { cause: 400 }))
  }
  if (name == brandExist.name) {
    return next(new Error('name the same', { cause: 400 }))
  }
  // check name existence
  const isNameExist = await brandModel.findOne({ name, _id: { $ne: req.query.brandId } })
  if (isNameExist) {
    return next(new Error('name exist!', { cause: 400 }))
  }
  brandExist.name = name
  const slug = slugify(name, {
    replacement: '-',
    trim: true,
    lower: true,
  })
  brandExist.slug = slug
  // check if update image
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: brandExist.logo.public_id
    })
    brandExist.logo.secure_url = secure_url
  }

  await brandExist.save()
  return res.status(200).json({ message: 'done', brandExist })
}
// ========================== delete brand =====================
export const deleteBrand = async (req, res, next) => {
  //data 
  const { brandId } = req.query
  const brand = await brandModel.findByIdAndDelete(brandId)
  const category = await categoryModel.findById(brand.categoryId)
  const subCategory = await subCategoryModel.findById(brand.subCategoryId)

  if (!brand) {
    return next(new Error('brand not found', { cause: 400 }))
  }
  await cloudinary.api.delete_resources_by_prefix(
    `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${brand.customId}`
  )
  return res.status(200).json()
}
// ========================== get all brand =======================
export const getAllBrands = async (req, res, next) => {
  const apiFeatures = new Apifeatures(brandModel.find(), req.query)
    .paginationFun().filter().sort().select()
  const Brands = await apiFeatures.mongooseQuery
  res.status(200).json({ message: 'Done', Brands })
}
