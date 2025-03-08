import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MedicineServices } from './medicine.services';

/**
 * @description Create Medicine
 * @param ''
 * @Response  Data
 */
const createMedicine = catchAsync(async (req, res) => {
  const result = await MedicineServices.createMedicine(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Medicine Created Successful',
    data: result,
  });
});

/**
 * @description Get All Medicine
 * @param ''
 * @Response  Data
 */
const getAllMedicines = catchAsync(async (req, res) => {
  const result = await MedicineServices.getAllMedicineFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Medicine Retrieved Successful',
    data: result,
  });
});


/**
 * @description Get Single Medicine
 * @param 'medicineId'
 * @Response  Single Data
 */
const getSingleMedicine = catchAsync(async (req, res) => {
  const result = await MedicineServices.getSingleMedicineFromDB(
    req.params.medicineId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single Medicine Retrieved Successful',
    data: result,
  });
});

/**
 * @description Get Category Medicine
 * @param ''
 * @Response   Data
 */
const getCategoryMedicine = catchAsync(async (req, res) => {
  const result = await MedicineServices.getCategoryFromDB()
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category Retrieved Successful',
    data: result,
  });
});


/**
 * @description Update Single Medicine
 * @param 'medicineId'
 * @Response  Single Data
 */
const updateSingleMedicine = catchAsync(async (req, res) => {
  const result = await MedicineServices.updateSingleMedicineFromDB(
    req.body,
    req.params.medicineId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single Medicine Updated Successful',
    data: result,
  });
});

/**
 * @description Delete Single Medicine
 * @param 'medicineId'
 * @Response  Single Data
 */
const deleteSingleMedicine = catchAsync(async (req, res) => {
  const result = await MedicineServices.deleteSingleMedicineFromDB(
    req.params.medicineId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single Medicine Deleted Successful',
    data: result,
  });
});
export const MedicineControllers = {
  createMedicine,
  getAllMedicines,
  getSingleMedicine,
  updateSingleMedicine,
  deleteSingleMedicine,
  getCategoryMedicine,
};
