import { userModel } from '../../DB/Models/user.model.js'
import { generateToken, verifyToken } from '../utils/tokenFunctions.js'

export const isAuth = (accessRoles) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers
      if (!authorization) {
        return next(new Error('Please login first', { cause: 400 }))
      }

      if (!authorization.startsWith('ecomm__')) {
        return next(new Error('invalid token prefix', { cause: 400 }))
      }

      const splitedToken = authorization.split('ecomm__')[1]

      try {
        const decodedData = verifyToken({
          token: splitedToken,
          signature: process.env.TOKEN_SIGNATURE,
        })

        const findUser = await userModel.findById(
          decodedData._id,
          'email username role',
        )
        if (!findUser) {
          return next(new Error('Please SignUp', { cause: 400 }))
        }
        //================== Authorization==================
        if (!accessRoles.includes(findUser.role)) {
          return next(new Error('UnAuthorized to access', { cause: 401 }))
        }
        req.user = findUser
        next()
      } catch (error) {
        // token  => search in db
        if (error == 'TokenExpiredError: jwt expired') {
          // refresh token
          const user = await userModel.findOne({ token: splitedToken })
          if (!user) {
            return next(new Error('Wrong token', { cause: 400 }))
          }
          // generate new token
          const userToken = generateToken({
            payload: {
              email: user.email,
              _id: user._id,
            },
            signature: process.env.TOKEN_SIGNATURE,
            expiresIn: 20,
          })

          if (!userToken) {
            return next(
              new Error('token generation fail, payload canot be empty', {
                cause: 400,
              }),
            )
          }

          user.token = userToken
          await user.save()
          return res.status(200).json({ message: 'Token refreshed', userToken })
        }
        return next(new Error('invalid token', { cause: 500 }))
      }
    } catch (error) {
      console.log(error)
      next(new Error('catch error in auth', { cause: 500 }))
    }
  }
}
