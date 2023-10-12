import voucher_codes from 'voucher-code-generator'
import { couponModel } from '../../../DB/Models/coupon.model.js'
import { Apifeatures } from '../../utils/apiFeatures.js'
// allcoupons
export const allcoupons = async (req, res, next) => {
  const apiFeatures = new Apifeatures(couponModel.find(), req.query)
    .paginationFun()
    .sort()
    .filter()
    .select()
  const result = await apiFeatures.mongooseQuery
  return res.status(200).json({ success: true, result })
}

// create coupon
export const createCoupon = async (req, res, next) => {
  // generate code
  const code = voucher_codes.generate({ length: 5 })
  // create coupon
  const coupon = await couponModel.create({
    name: code[0],
    discount: req.body.discount,
    expierdAt: new Date(req.body.expierdAt).getTime(),
    createdBy: req.user._id
  })
  // send response
  return res.status(201).json({ success: true, result: coupon })
}

// updateCoupon
export const updateCoupon = async (req, res, next) => {
  // check existence
  const coupon = await couponModel.findOne({ name: req.params.code, expierdAt: { $gt: Date.now() } })
  if (!coupon) return next(new Error('invalid coupon!'))
  // owner check
  if (req.user._id.toString() == coupon.createdBy.toString()) { return next(new Error('you not the owner!')) }
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount
  coupon.expierdAt = req.body.expierdAt ? new Date(req.body.expierdAt).getTime() : coupon.expierdAt
  await coupon.save()
  return res.status(200).json({ success: true, coupon, message: 'coupon updated successfully!' })
}

// delete coupon
export const deleteCoupon = async (req, res, next) => {
  // check existence
  const coupon = await couponModel.findOne({ name: req.params.code, expierdAt: { $gt: Date.now() } })
  if (!coupon) return next(new Error('invalid coupon!'))
  // owner check
  if (req.user._id.toString() == coupon.createdBy.toString()) { return next(new Error('you not the owner!')) }

  await couponModel.findByIdAndDelete(req.params.code)
  return res.status(200).json({ success: true, message: 'coupon deleted successfully!' })
}