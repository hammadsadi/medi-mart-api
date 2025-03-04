import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.services";

/**
 * @description  Create Order Controller
 * @param ''
 * @returns  Data
 */
const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.orderSaveToDB(
    req.body,
    req.user?.userEmail,
    req.ip
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order Created Successful',
    data: result,
  });
});


export const OrderControllers = {
    createOrder
}
