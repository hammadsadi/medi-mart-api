import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CouponServices } from "./coupon.services";

/**
 * @description  Create Coupon Controller
 * @param ''
 * @returns  Data
 */
const createCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.couponSaveToDB(req.body)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon Created Successful',
    data: result,
  });
});


/**
 * @description  Get All Coupon Controller
 * @param ''
 * @returns  Data
 */
const getAllCoupons = catchAsync(async (req, res) => {
  const result = await CouponServices.getAllcouponsFromDB()

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon Retrieved Successful',
    data: result,
  });
});

/**
 * @description  Delete Coupon Controller
 * @param 'couponId'
 * @returns  Data
 */
const deleteSingleCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.deleteCouponFromDB(req.params.couponId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon Deleted Successful',
    data: result,
  });
});

export const CouponControllers = {
    createCoupon,
    getAllCoupons,
    deleteSingleCoupon
}