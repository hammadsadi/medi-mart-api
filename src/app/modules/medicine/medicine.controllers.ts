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

export const MedicineControllers = {
  createMedicine,
  getAllMedicines,
};
