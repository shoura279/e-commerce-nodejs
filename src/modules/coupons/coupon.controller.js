import { couponModel } from "../../../DB/Models/coupon.model.js"
import { userModel } from "../../../DB/Models/user.model.js"



export const addCoupon = async (req, res, next) => {
    const {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isPercentage,
        isFixedAmount,
        couponAssginedToUsers
    } = req.body

    //============================ coupon code check ================
    const coupon = await couponModel.findOne({ couponCode })
    if (coupon) {
        return next(new Error('duplicate coupon code', { cause: 400 }))
    }

    if (isPercentage == isFixedAmount) {
        return next(new Error('please select one of them', { cause: 400 }))
    }

    if (isPercentage) {
        if (couponAmount < 1 || couponAmount > 100) {
            return next(new Error('invalid couponAmount', { cause: 400 }))

        }
    }

    let userArr = []
    for (const user of couponAssginedToUsers) {
        userArr.push(user.userId)
    }

    const dbCheck = await userModel.find({ _id: { $in: userArr } })

    if (dbCheck.length !== userArr.length) {
        return next(new Error('invalid userIds', { cause: 400 }))
    }

    const couponObject = {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isPercentage,
        isFixedAmount,
        couponAssginedToUsers
    }

    const coupondb = await couponModel.create(couponObject)
    return res.status(201).json({ message: "done", coupondb })

}