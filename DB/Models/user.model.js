import { Schema, model } from 'mongoose'
import pkg from 'bcrypt'
import { roles } from '../../src/utils/enums.js'
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      default: roles.USER,
      enum: [roles.USER, roles.ADMIN, roles.SUPER_ADMIN],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: [
      {
        type: String,
        required: true,
      },
    ],
    profilePicture: {
      secure_url: String,
      public_id: String,
    },
    status: {
      type: String,
      default: 'Offline',
      enum: ['Online', 'Offline'],
    },
    gender: {
      type: String,
      default: 'Not specified',
      enum: ['male', 'female', 'Not specified'],
    },
    age: Number,
    token: String,
    forgetCode: String,
  },
  { timestamps: true },
)

// //====================================== document middleware =============================
// userSchema.pre('save', function () {
//   // console.log('=====================  pre save hook ========================');
//   // console.log(this)
//   this.password = pkg.hashSync(this.password, +process.env.SALT_ROUNDS)
//   // console.log(this)
// })

// userSchema.post('save', function () {
//   console.log('=====================  post save hook ========================');
//   console.log(this)
// })

// ====================================== query middleware =============================
// userSchema.pre('deleteOne', { query: false, document: true }, async function () {
//   console.log('=====================  pre deleteOne hook ========================');
//   // console.log(this.getQuery());
//   // console.log(this.model);
//   console.log(this);
// })
// userSchema.post('deleteOne', { query: false, document: true }, async function () {
//   console.log('=====================  pre deleteOne hook ========================');
//   // console.log(this.getQuery());
//   // console.log(this.model);
//   console.log(this);
// })


//updateOne
// userSchema.post(['updateOne'], async function () {
//   console.log('=====================  post updateOne hook ========================');
//   // console.log(this);
//   await this.model.findOneAndUpdate(this.getQuery(), { $inc: { __v: 1 } })
// })

export const userModel = model('User', userSchema)
