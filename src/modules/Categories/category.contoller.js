import slugify from 'slugify'
import { categoryModel } from '../../../DB/Models/category.model.js'
import { customAlphabet } from 'nanoid'
import cloudinary from '../../utils/coludinaryConfigrations.js'
import { subCategoryModel } from '../../../DB/Models/subCategory.model.js'
import { log } from 'console'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

export const createCategory = async (req, res, next) => {
  // data
  const { name } = req.body
  const isNameDupliacte = await categoryModel.findOne({ name })
  if (isNameDupliacte) {
    return next(new Error('category name is duplicated', { cause: 409 }))
  }

  const slug = slugify(name, '_')

  if (!req.file) {
    return next(new Error('please upload your picture', { cause: 400 }))
  }
  const customId = nanoid()
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.PROJECT_FOLDER}/Categories/${customId}`,
    },
  )

  const categoryObject = {
    name,
    slug,
    Image: { secure_url, public_id },
    customId,
  }

  const categoryDb = await categoryModel.create(categoryObject)

  if (!categoryDb) {
    await cloudinary.uploader.destroy(public_id)
    await cloudinary.api.delete_folder(
      `${process.env.PROJECT_FOLDER}/Categories/${customId}`,
    )
    return next(new Error('fail', { cause: 400 }))
  }

  res.status(201).json({ message: 'Done', categoryDb })
}

//============================== update category ========================
export const updateCategory = async (req, res, next) => {
  const { categoryId } = req.query
  const category = await categoryModel.findById(categoryId)
  if (!category) {
    return next(new Error('invalid category id'))
  }

  const { name } = req.body

  if (name) {
    console.log(category.name)
    console.log(name)
    // same to old name
    if (category.name == name.toLowerCase()) {
      return next(new Error('same to old category name', { cause: 400 }))
    }

    // new category name is unique
    const isNameDupliacte = await categoryModel.findOne({ name })
    if (isNameDupliacte) {
      return next(new Error('category name is duplicated', { cause: 409 }))
    }

    const slug = slugify(name, '_')
    category.name = name
    category.slug = slug
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}`,
      },
    )
    // delete old image
    await cloudinary.uploader.destroy(category.Image.public_id)
    category.Image = { secure_url, public_id }
  }

  await category.save()
  res.status(200).json({ message: 'Done', category })
}

// ============================ delete category ================
export const deleteCategroy = async (req, res, next) => {
  const { categoryId } = req.query
  const category = await categoryModel.findByIdAndDelete(categoryId)
  if (!category) {
    return next(new Error('invalid category id'))
  }

  // delete category

  // db
  // TODO: delet the related subCategories
  const deleteRelatedSubCategories = await subCategoryModel.deleteMany({
    categoryId,
  })
  // console.log(deleteRelatedSubCategories.deletedCount)
  if (!deleteRelatedSubCategories.deletedCount) {
    return next(new Error('delete subCate fail', { cause: 400 }))
  }
  // TODO: delet the related brand
  // TODO: delet the related products

  // host
  await cloudinary.api.delete_resources_by_prefix(
    `${process.env.PROJECT_FOLDER}/Categories/${category.customId}`,
  )
  await cloudinary.api.delete_folder(
    `${process.env.PROJECT_FOLDER}/Categories/${category.customId}`,
  )

  res.status(200).json({ message: 'Done' })
}

export const getAllCategories = async (req, res, next) => {
  const Categories = await categoryModel.find().populate([
    {
      path: 'subCategories',
      select: 'name',
    },
  ])
  console.log(Categories)
  res.status(200).json({ message: 'Done', Categories })
}

// cursor
// virtual populate
