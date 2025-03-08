/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TOrder } from './order.types';
import { Medicine } from '../medicine/medicine.model';
import { Coupon } from '../coupon/coupon.model';
import { Order } from './order.model';
import { OrderUtils } from './order.utils';
import { sendEmail } from '../../utils/sendMail';
import { TUser } from '../user/user.types';

// Order Save To DB
const orderSaveToDB = async (
  payload: Partial<TOrder>,
  userEmail: string,
  client_ip: string | undefined,
) => {
  try {
    // Get Loged in user
    const user = await User.findOne({ email: userEmail });
    //Check Products
    if (!payload.medicines?.length) {
      throw new AppError(400, 'Order is not specified');
    }
    // Calculate Price
    const medicines = payload?.medicines;
    let totalPrice = 0;
    let deliveryCharge = 0;
    let discount = 0;
    const orderDetails = await Promise.all(
      medicines?.map(async (item) => {
        // Find Medicine
        const medicine = await Medicine.findById(item?.medicine);
        // Check Stock
        if ((medicine?.stock as number) < item?.quantity) {
          throw new AppError(400, 'Insufficient Stock!');
        }

        //
        if (medicine?.prescriptionRequired === true && !item.prescriptionUrl) {
          throw new AppError(
            400,
            `Prescription Required for ${medicine?.name}`,
          );
        }
        // Calculate Total Price
        if (medicine) {
          const subTotal = medicine ? (medicine.price || 0) * item.quantity : 0;
          totalPrice += subTotal;

          // Stock Decreament
          medicine.stock -= item.quantity;
          await medicine.save();
          return item;
        }
      }),
    );

    //  Handle Coupon
    if (payload?.coupon) {
      const coupon = await Coupon.findOne({ code: payload?.coupon });
      // Coupon Validation
      if (!coupon) {
        throw new AppError(404, 'Invalid Coupon!');
      }
      if (coupon) {
        // Init Current Date
        const currentDate = new Date();
        if (currentDate < coupon?.startDate) {
          throw new AppError(
            400,
            `${coupon.code} Coupon Code has not started yet!`,
          );
        }
        // Check Experied or not
        if (currentDate > coupon.endDate) {
          throw new AppError(400, `${coupon.code} Coupon Code has expired!`);
        }
        // Check Order Price
        if (totalPrice < coupon?.minOrderAmount) {
          throw new AppError(
            400,
            `Your order must be at least ${coupon?.minOrderAmount}`,
          );
        }
        const mxDiscount = coupon?.maxDiscountAmount || 500000;
        if (totalPrice > mxDiscount) {
          throw new AppError(400, `Discount cannot exceed ${mxDiscount}`);
        }
        //  Calculate Discount
        const discountPrice = (totalPrice * coupon?.discountValue) / 100;
        // const totalDiscount = Math.min(discountPrice, mxDiscount);
        discount = Math.min(discountPrice, mxDiscount);
        totalPrice = totalPrice - discount;
      }
    }

    // Delivery Charge Calculate
    if (payload?.deliveryArea === 'Dhaka') {
      totalPrice += 60;
      deliveryCharge = 60;
    } else if (payload?.deliveryArea !== 'Dhaka') {
      totalPrice += 120;
      deliveryCharge = 120;
    }

    // Handle Delivery Options
    if (payload?.deliveryOption === 'Store-Pickup') {
      totalPrice -= deliveryCharge;
      deliveryCharge = 0;
    }

    if (payload?.deliveryOption === 'Express-Delivery') {
      if (payload?.deliveryArea === 'Dhaka') {
        totalPrice += 100;
      } else if (payload?.deliveryArea !== 'Dhaka') {
        totalPrice += 200;
      }
    }

    const orderInfo = {
      medicines: orderDetails,
      user: user?._id,
      totalPrice: Math.ceil(totalPrice),
      discount: Math.ceil(discount) || 0,
      deliveryCharge: deliveryCharge,
      deliveryDetailsAddress: payload?.deliveryDetailsAddress
        ? payload?.deliveryDetailsAddress
        : '',
      deliveryArea: payload?.deliveryArea ? payload?.deliveryArea : '',
      deliveryOption: payload?.deliveryOption,
    };

    // Save Info
    const createOrder = await Order.create(orderInfo);

    // Payment Payload
    const orderPayload = {
      amount: Math.ceil(totalPrice),
      order_id: createOrder?._id,
      currency: 'BDT',
      customer_name: user?.name,
      customer_address: payload?.deliveryDetailsAddress
        ? payload?.deliveryDetailsAddress
        : '',
      customer_email: user?.email,
      customer_phone: user?.phone,
      customer_city: payload?.deliveryArea ? payload?.deliveryArea : '',
      client_ip,
    };

    const payment = await OrderUtils.makePaymentAsync(orderPayload);
    if (payment?.transactionStatus) {
      await createOrder?.updateOne({
        transaction: {
          id: payment.sp_order_id,
          transaction_status: payment.transactionStatus,
        },
      });
    }

    return payment?.checkout_url;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Get DisCount info
const getDiscountInfo = async (payload: {
  coupon: string;
  totalPrice: number;
}) => {
  // Find Coupon
  const coupon = await Coupon.findOne({ code: payload?.coupon });
  if (!coupon) {
    throw new AppError(400, 'Invalid Coupon Code');
  }
  const mxDiscount = coupon?.maxDiscountAmount || 500000;
  if (payload?.totalPrice > mxDiscount) {
    throw new AppError(400, `Discount cannot exceed ${mxDiscount}`);
  }
  // Check Order Price
  if (payload?.totalPrice < coupon?.minOrderAmount) {
    throw new AppError(
      400,
      `Your order must be at least ${coupon?.minOrderAmount}`,
    );
  }
  //  Calculate Discount
  const discountPercentage = coupon?.discountValue || 0;
  const discountPrice = (payload?.totalPrice * discountPercentage) / 100;
  // const totalDiscount = Math.min(discountPrice, mxDiscount);
  const discount = Math.min(discountPrice, mxDiscount);
  const finalPrice = payload?.totalPrice - discount;

  return {
    code: coupon?.code,
    discount: Math.ceil(discount),
    finalPrice: Math.ceil(finalPrice),
  };
};

// Verify Payment
const verifyPayment = async (orderId: string) => {
  const verifiedPayment = await OrderUtils.verifyPaymentAsync(orderId);
  // Update Order Status
  if (verifiedPayment?.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': orderId,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transaction_status': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        paymentStatus:
          verifiedPayment[0]?.bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0]?.bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0]?.bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }
  return verifiedPayment;
};

// Get Orders
const loggedInUserOrder = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(400, 'User Not Found');
  }
  const orders = await Order.find({ user: user._id }).populate({
    path: 'medicines.medicine',
    model: 'Medicine',
  });

  return orders;
};

// Get Orders for Admin
const getOrdersForAdmin = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(400, 'User Not Found');
  }
  const orders = await Order.find().populate('user').populate({
    path: 'medicines.medicine',
    model: 'Medicine',
  });

  return orders;
};

// Get Single Orders for Admin
const getSingleOrdersForAdmin = async (id: string) => {
  const order = await Order.findById(id).populate('user').populate({
    path: 'medicines.medicine',
    model: 'Medicine',
  });
  if (!order) {
    throw new AppError(400, 'Order Not Found');
  }

  return order;
};

// Update Order Status for Admin
const updateOrdersForAdmin = async (
  id: string,
  payload: { status: string },
) => {
  const order = await Order.findById(id).populate<{ user: TUser }>('user');
  if (!order) {
    throw new AppError(400, 'Order Not Found!');
  }

  if (!payload?.status) {
    throw new AppError(400, 'Status is Required!');
  }
  // Update Order
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { orderStatus: payload?.status },
    { new: true },
  );
  // Send Email
  const to = order?.user?.email;
  const sub = 'Order Status Update ✅';
  const eText = `New Update Please Read This Email`;
  const eHtml = `<!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Medicine Delivery Update</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 10px 0;
      }
      .content {
        text-align: left;
        padding: 20px;
        font-size: 16px;
        color: #333333;
      }
      .status {
        font-weight: bold;
        color: #007BFF;
      }
      .footer {
        text-align: center;
        font-size: 14px;
        color: #777;
        margin-top: 20px;
      }
      @media (max-width: 600px) {
        .container {
          width: 100%;
          padding: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Medicine Delivery Update</h2>
      </div>
      <div class="content">
        <p>Dear <strong>${order?.user?.name}</strong>,</p>
        <p>Your order <strong>#${order?._id}</strong> status has been updated to:</p>
        <p class="status">${updatedOrder?.orderStatus}</p>
        <p>Thank you for choosing our service. If you have any questions, feel free to contact us.</p>
      </div>
      <div class="footer">
        <p>&copy; 2025 Medi Mart. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  sendEmail(to, sub, eText, eHtml);
  return updatedOrder;
};

// Update Order Checking Status for Admin
const orderCheckingStatusUpdateForAdmin = async (
  id: string,
  payload: { status: string },
) => {
  const order = await Order.findById(id).populate<{ user: TUser }>('user');
  if (!order) {
    throw new AppError(400, 'Order Not Found!');
  }

  if (!payload?.status) {
    throw new AppError(400, 'Status is Required!');
  }
  // Update Order
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { isCheck: payload?.status },
    { new: true },
  );

  // Send Email
  const to = order?.user?.email;
  const sub = 'Your Order Has Been Checked ✅';
  const eText = `New Update Please Read This Email`;
  const eHtml = `<!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Medicine Delivery Update</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 10px 0;
      }
      .content {
        text-align: left;
        padding: 20px;
        font-size: 16px;
        color: #333333;
      }
      .status {
        font-weight: bold;
        color: #007BFF;
      }
      .footer {
        text-align: center;
        font-size: 14px;
        color: #777;
        margin-top: 20px;
      }
      @media (max-width: 600px) {
        .container {
          width: 100%;
          padding: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Order Checking Status Updated</h2>
      </div>
      <div class="content">
        <p>Dear <strong>${order?.user?.name}</strong>,</p>
        <p>We have checked your order <strong>#${order?._id}</strong> and its status has been updated to:</p>
        <p class="status">${updatedOrder?.isCheck}</p>
        <p>If you have any questions or concerns, please feel free to reach out.</p>
        <p>Thank you for choosing our service!</p>
      </div>
      <div class="footer">
        <p>&copy; 2025 Medi Mart. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  sendEmail(to, sub, eText, eHtml);
  return updatedOrder;
};

// Delete Order For Admin
const deleteOrdersForAdmin = async (id: string) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    throw new AppError(400, 'Order Not Found!');
  }

  return order;
};
export const OrderServices = {
  orderSaveToDB,
  verifyPayment,
  loggedInUserOrder,
  getOrdersForAdmin,
  updateOrdersForAdmin,
  deleteOrdersForAdmin,
  getDiscountInfo,
  getSingleOrdersForAdmin,
  orderCheckingStatusUpdateForAdmin,
};
