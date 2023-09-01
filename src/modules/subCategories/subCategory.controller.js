import slugify from 'slugify'
import { categoryModel } from '../../../DB/Models/category.model.js'
import { customAlphabet } from 'nanoid'
import cloudinary from '../../utils/coludinaryConfigrations.js'
import { subCategoryModel } from '../../../DB/Models/subCategory.model.js'

const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

export const createSubCategory = async (req, res, next) => {
  // data
  const { name } = req.body
  const { categoryId } = req.query
  const category = await categoryModel.findById(categoryId)
  if (!category) {
    return next(new Error('invalid categoryId', { cause: 400 }))
  }
  const isNameDupliacte = await subCategoryModel.findOne({ name })
  if (isNameDupliacte) {
    return next(new Error('subcategory name is duplicated', { cause: 409 }))
  }

  const slug = slugify(name, '_')

  if (!req.file) {
    return next(new Error('please upload your picture', { cause: 400 }))
  }
  const customId = nanoid()
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${customId}`,
    },
  )

  const subcategoryObject = {
    name,
    slug,
    Image: { secure_url, public_id },
    customId,
    categoryId,
  }

  const subcategoryDb = await subCategoryModel.create(subcategoryObject)
  console.log(subcategoryDb)
  if (!subcategoryDb) {
    await cloudinary.uploader.destroy(public_id)
    await cloudinary.api.delete_folder(
      `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${customId}`,
    )
    return next(new Error('fail', { cause: 400 }))
  }

  res.status(201).json({ message: 'Done', subcategoryDb })
}

export const getAllSubCategories = async (req, res, next) => {
  const subCat = await subCategoryModel.find().populate([
    {
      path: 'categoryId',
      select: 'name',
    },
  ])
  console.log(subCat)
  res.status(200).json({ message: 'Done', subCat })
}

//===================== updateSubCategory =====================//
export const updateSubcategory = async (req, res, next) => {
  // get data from req
  const { id } = req.params;
  // check subcategory existence
  const isExist = await subCategoryModel.findById(id)
  if (!isExist) return next(new Error(`not exist`, { cause: 404 }))
  // check name exist
  if (req.body.name) {
    const isNameExsit = await subCategoryModel.findOne({
      name: req.body.name,
      _id: { $ne: req.params.id },
    });
    if (isNameExsit) {
      return next(new ErrorClass("name already exist", { cause: 409 }))
    }
    req.body.slug = slugify(req.body.name)
  }
  // upload image
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "subCategory" }
    );
    req.body.Image = { secure_url, public_id }
  }
  // update to db
  const subCategory = await subCategoryModel.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  // delet old image
  if (req.file) {
    await cloudinary.uploader.destroy(subCategory.image.public_id);
  }
  // send response
  return res.status(200).json({ message: "done", subCategory });
};
//===================== delete subcategory =====================//
export const deleteSubcategory = async (req, res, next) => {
  const subcategory = await subCategoryModel.findByIdAndDelete(req.params.id);
  if (!subcategory) {
    return next(new Error('not found', { cause: 404 }))
  }
  await cloudinary.uploader.destroy(subcategory.Image.public_id);

  return res.status(200).json({ message: "done" });
};
//==================== get all subcategory =====================//
export const getWithBrand = async (req, res, next) => {
  const result = await subCategoryModel.find().populate({ path: 'brands', select: 'name' });
}