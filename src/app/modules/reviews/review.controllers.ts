import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MedicineReviews } from "./review.services";

/**
 * @description Create Review Controllers
 * @param ''
 * @returns  Data
 */
const createReview = catchAsync(async (req, res) => {
  const result = await MedicineReviews.reviewSaveToDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review Submited Successful',
    data: result,
  });
});


/**
 * @description Get Single Medicine Review Controllers
 * @param 'medicineId'
 * @returns  Data
 */
const singleMedicineReviews = catchAsync(async (req, res) => {
  const result = await MedicineReviews.getSingleMedicineReviewsFromDB(
    req.params?.medicineId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review Retrieved Successful',
    data: result,
  });
});

/**
 * @description Get All Medicine Review Controllers
 * @param ''
 * @returns  Data
 */
const getAllMedicineReviews = catchAsync(async (req, res) => {
  const result = await MedicineReviews.getAllReviewsFromDB(
   
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review Retrieved Successful',
    data: result,
  });
});
export const MedicineReviewControllers = {
  createReview,
  singleMedicineReviews,
  getAllMedicineReviews,
};
