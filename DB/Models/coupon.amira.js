// import mongoose from 'mongoose' // err

// const couponScehma = new mongoose.Schema(
//   {
//     couponCode: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//       unique: true
//     },
//     couponAmount: {
//       type: Number,
//       required: true
//     },
//     couponStatus: {
//       type: String,
//       default: 'valid',
//       enum: ['valid', 'expired']
//     },
//     fromDate: {
//       type: String,
//       required: true
//     },
//     toDate: {
//       type: String,
//       required: true
//     },
//     isPercentage: {
//       type: Boolean,
//       default: false
//     },
//     isFixedAmount: {
//       type: Boolean,
//       default: false
//     },
//     couponAssginedToUsers: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'User',
//           required: true
//         },
//         maxUsage: {
//           type: Number,
//           required: true
//         },
//         usageCount: {
//           type: Number,
//           default: 0
//         }

//       }]

//   },
//   {
//     timestamps: true,
//   },
// )

// export const couponModel =/* mongoose.models.Coupon || */mongoose.model('Coupon', couponScehma)



