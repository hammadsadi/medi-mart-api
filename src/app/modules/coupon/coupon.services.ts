import { Coupon } from "./coupon.model";
import { TCoupon } from "./coupon.types";

// Coupon Save to DB
const couponSaveToDB = async(payload:TCoupon) =>{
    const coupon = await Coupon.create(payload)
    return coupon
}

// Get All Coupon From DB
const getAllcouponsFromDB = async() =>{
    const coupon = await Coupon.find()
    return coupon
}

// Delete Coupon From  DB
const deleteCouponFromDB = async(couponId:string) =>{
    const coupon = await Coupon.findByIdAndDelete(couponId)
    return coupon
}


export const CouponServices = {
    couponSaveToDB,
    getAllcouponsFromDB,
    deleteCouponFromDB
}



