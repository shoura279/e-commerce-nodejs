import slugify from 'slugify'
import { brandModel } from '../../../DB/Models/brand.model.js'
import { categoryModel } from '../../../DB/Models/category.model.js'
import { subCategoryModel } from '../../../DB/Models/subCategory.model.js'
import cloudinary from '../../utils/coludinaryConfigrations.js'
import { productModel } from '../../../DB/Models/product.model.js'
import { customAlphabet } from 'nanoid'
import { Apifeatures } from '../../utils/apiFeatures.js'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)


export const addProduct = async (req, res, next) => {
  const { title, desc, colors, sizes, price, appliedDiscount, stock } = req.body
  const { categoryId, subCategoryId, brandId } = req.query

  //=============================== Ids Checks ======================
  const category = await categoryModel.findById(categoryId)
  if (!category) {
    return next(new Error('invalid cat. Ids', { cause: 400 }))
  }

  const subCategory = await subCategoryModel.findById(subCategoryId)
  if (!subCategory) {
    return next(new Error('invalid subCat. Ids', { cause: 400 }))
  }
  const brand = await brandModel.findById(brandId)
  if (!brand) {
    return next(new Error('invalid brand Ids', { cause: 400 }))
  }

  const slug = slugify(title, {
    replacement: '_',
    lower: true,
    trim: true,
  })

  //======================= Images ===============
  if (!req.files.length) {
    return next(new Error('please upload product images', { cause: 400 }))
  }
  const Images = []
  const customId = nanoid()
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${customId}`,
      },
    )
    Images.push({ secure_url, public_id })
  }
  req.imagePath = `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${customId}`

  const productObject = {
    title,
    slug,
    desc,
    colors,
    sizes,
    stock,
    price,
    appliedDiscount,
    Images,
    categoryId,
    subCategoryId,
    brandId,
    customId,
  }
  const productDb = await productModel.create(productObject)
  if (!productDb) {
    await cloudinary.api.delete_resources_by_prefix(
      `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${customId}`,
    )
    await cloudinary.api.delete_folder(
      `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${customId}`,
    )
    return next(new Error('fail to add product', { cause: 500 }))
  }
  res.status(201).json({ message: 'Done', productDb })
}

export const updateProduct = async (req, res, next) => {
  const { productId } = req.query

  const product = await productModel.findById(productId) //TODO: convert to findOne and owner
  if (!product) {
    return next(new Error('invalid product', { cause: 400 }))
  }

  const { title, desc, colors, sizes, price, appliedDiscount, stock } = req.body
  const { categoryId, subCategoryId, brandId } = req.query

  //=============================== Ids Checks======================
  const category = await categoryModel.findById(
    categoryId || product.categoryId,
  )
  if (!category) {
    return next(new Error('invalid cat. Ids', { cause: 400 }))
  }
  if (categoryId) {
    product.categoryId = categoryId
  }

  const subCategory = await subCategoryModel.findById(
    subCategoryId || product.subCategoryId,
  )
  if (!subCategory) {
    return next(new Error('invalid subCat. Ids', { cause: 400 }))
  }
  if (subCategoryId) {
    product.subCategoryId = subCategoryId
  }
  const brand = await brandModel.findById(brandId || product.brandId)
  if (!brand) {
    return next(new Error('invalid brand Ids', { cause: 400 }))
  }
  if (brandId) {
    product.brandId = brandId
  }

  if (title) {
    product.title = title
    product.slug = slugify(title, '_')
  }
  let priceAfterDiscount
  if (price && appliedDiscount) {
    priceAfterDiscount = price * (1 - (appliedDiscount || 0) / 100)
    product.price = price
    product.priceAfterDiscount = priceAfterDiscount
    product.appliedDiscount = appliedDiscount
  } else if (price) {
    priceAfterDiscount = price * (1 - (product.appliedDiscount || 0) / 100)
    product.price = price
    product.priceAfterDiscount = priceAfterDiscount
  } else if (appliedDiscount) {
    priceAfterDiscount = product.price * (1 - (appliedDiscount || 0) / 100)
    product.priceAfterDiscount = priceAfterDiscount
    product.appliedDiscount = appliedDiscount
  }

  if (desc) product.desc = desc
  if (stock) product.stock += stock
  if (colors) product.colors = colors
  if (sizes) product.sizes = sizes

  // ================================================= //
  //=== update images
  if (req.files.length) {
    const Images = []

    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${product.customId}`,
        },
      )
      Images.push({ secure_url, public_id })
    }
    req.imagePath = `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${product.customId}`
    product.Images = Images
  }
  // ===== update one image
  await product.save()
  res.status(200).json({ message: 'Done', product })
}
// ================ get all product ====================
export const listProducts = async (req, res, next) => {
  // // const { page, size } = req.query
  // const { page, size, sort, select, search, ...filter } = req.query
  // console.log(req.query)
  // console.log(filter)

  // const { limit, skip } = pagination({ page, size })

  // // // ================ pagination=================
  // // const products = await productModel.find().limit(limit).skip(skip)

  // // ==================== sort ===================
  // // const products = productModel.find().sort(sort.replaceAll(',', ' ')) // mongooseQuery
  // // const products = productModel.find().select(select.replaceAll(',', ' ')) // mongooseQuery

  // // const products = productModel.find({
  // //   title: { $regex: search, $options: 'i' },
  // // }) // mongooseQuery

  // //======================= filters ========
  // console.log(req.query)
  // const queryFilter = JSON.parse(
  //   JSON.stringify(filter).replace(
  //     /gt|gte|lt|lte|in|nin|regex/g,
  //     (match) => `$${match}`,
  //   ),
  // )
  // const products = productModel
  //   .find(queryFilter)
  //   .limit().sip()
  //   .sort()
  //   .select(select.replaceAll(',', ' '))
  // const data = await products

  const apiFeaturesInstance = new Apifeatures(
    productModel.find(),
    req.query,
  ).filter().paginationFun().sort().select()
  const data = await apiFeaturesInstance.mongooseQuery
  res.status(200).json({ message: 'Done', data })
}

// gt|gte|lt|lte|in|nin|regex
// ========================== get specific ===================
export const getSpecific = async (req, res, next) => {
  // data 
  const { productId } = req.params
  // check existence
  const product = await productModel.findById(productId).populate([
    { path: 'subCategoryId' },
    { path: 'categoryId' },
    { path: 'brandId' }
  ])

  if (!product) {
    return next(new Error('not found', { cause: 400 }))
  }

}
// ========================== deleteProduct ===================
export const deleteProduct = async (req, res, next) => {
  // data 
  const { productId } = req.query
  // check existence
  const product = await productModel.findByIdAndDelete(productId)
  if (!product) {
    return next(new Error('product not found', { cause: 400 }))
  }
  const category = await categoryModel.findById(product.categoryId)
  const subCategory = await subCategoryModel.findById(product.subCategoryId)
  const brand = await brandModel.findById(product.brandId)
  await cloudinary.api.delete_resources_by_prefix(
    `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${brand.customId}/Proudcts/${product.customId}`
  )
  await cloudinary.api.delete_folder(
    `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}/Brands/${brand.customId}/Proudcts/${product.customId}`
  )
  return res.status(200).json({ message: 'Deleted successfully' })
}
