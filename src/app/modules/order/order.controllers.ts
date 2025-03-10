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

/**
 * @description  Get Discount Info Controller
 * @param ''
 * @returns  Data
 */
const descountInfo = catchAsync(async (req, res) => {
  const result = await OrderServices.getDiscountInfo(
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Discount Info Retrieved Successful',
    data: result,
  });
});

/**
 * @description  Verify Order Controller
 * @param ''
 * @Query "orderId"
 * @returns  Data
 */
const verifyOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.verifyPayment(
    req.query.order_id as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order Verify Successful',
    data: result,
  });
});

/**
 * @description  My Order Controller
 * @param ''
 * @Query ""
 * @returns  Data
 */
const myOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.loggedInUserOrder(req.user?.userEmail);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My Order Retrieved Successful',
    data: result,
  });
});

/**
 * @description  All Order Controller for Admin
 * @param ''
 * @Query ""
 * @returns  Data
 */
const allOrderForAdmin = catchAsync(async (req, res) => {
  const result = await OrderServices.getOrdersForAdmin(req.user?.userEmail);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All Order Retrieved Successful',
    data: result,
  });
});

/**
 * @description  Get Single Order Controller for Admin
 * @param 'orderId'
 * @Query ""
 * @returns  Data
 */
const getSingleOrderForAdmin = catchAsync(async (req, res) => {
  const result = await OrderServices.getSingleOrdersForAdmin(req.params?.orderId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single Order Retrieved Successful',
    data: result,
  });
});


/**
 * @description  Update Order Controller for Admin
 * @param 'orderId'
 * @Query ""
 * @returns  Data
 */
const updateOrderForAdmin = catchAsync(async (req, res) => {

  const result = await OrderServices.updateOrdersForAdmin(
    req.params?.orderId,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order Updated Successful',
    data: result,
  });
});

/**
 * @description  Update Order Controller for Admin
 * @param 'orderId'
 * @Query ""
 * @returns  Data
 */
const updateOrderCheckingStatusForAdmin = catchAsync(async (req, res) => {
  const result = await OrderServices.orderCheckingStatusUpdateForAdmin(req.params?.orderId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order Updated Successful',
    data: result,
  });
});
/**
 * @description  Delete Order Controller for Admin
 * @param 'orderId'
 * @Query ""
 * @returns  Data
 */
const deleteOrderForAdmin = catchAsync(async (req, res) => {
  const result = await OrderServices.deleteOrdersForAdmin(req.params?.orderId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order Deleted Successful',
    data: result,
  });
});


/**
 * @description  Get Specific User Order Controller for Admin
 * @param 'userId'
 * @Query ""
 * @returns  Data
 */
const specificUserOrdersForAdmin = catchAsync(async (req, res) => {
  const result = await OrderServices.getSpecificUserOrdersForAdmin(req.params?.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order Retrieved Successful',
    data: result,
  });
});

/**
 * @description  Get Success Payment Order Controller for Admin
 * @param ''
 * @Query ""
 * @returns  Data
 */
const getSuccessPaymentsOrderForAdmin = catchAsync(async (req, res) => {
  const result = await OrderServices.getSuccessPaymentsForAdmin()
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order Retrieved Successful',
    data: result,
  });
});

/**
 * @description  Get Total Earnings and Order Count Controller for Admin
 * @param ''
 * @Query ""
 * @returns  Data
 */
const getTotalEarningsAndOrderCountForAdmin = catchAsync(async (req, res) => {
  const result = await OrderServices.getTotalOrdersAndEarningsForAdmin()
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order Info Retrieved Successful',
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  verifyOrder,
  myOrder,
  allOrderForAdmin,
  updateOrderForAdmin,
  deleteOrderForAdmin,
  descountInfo,
  getSingleOrderForAdmin,
  updateOrderCheckingStatusForAdmin,
  specificUserOrdersForAdmin,
  getSuccessPaymentsOrderForAdmin,
  getTotalEarningsAndOrderCountForAdmin,
};
