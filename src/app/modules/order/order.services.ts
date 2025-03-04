/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TOrder } from "./order.types";
import { Medicine } from "../medicine/medicine.model";
import { Coupon } from "../coupon/coupon.model";
import { Order } from "./order.model";
import { OrderUtils } from "./order.utils";

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
          throw new AppError(400, `Prescription Required for ${medicine?.name}`);
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
    if(payload?.deliveryOption === 'Store-Pickup'){
      totalPrice -= deliveryCharge
      deliveryCharge = 0
    }

     if (payload?.deliveryOption === "Express-Delivery") {
       if(payload?.deliveryArea ==='Dhaka'){
        totalPrice += 100;
       }else if (payload?.deliveryArea !== 'Dhaka') {
        totalPrice += 200;
       }
     }

    const orderInfo = {
      medicines: orderDetails,
      user: user?._id,
      totalPrice: Math.ceil(totalPrice),
      discount: Math.ceil(discount) || 0,
      deliveryCharge: deliveryCharge,
      deliveryDetailsAddress: payload?.deliveryDetailsAddress ? payload?.deliveryDetailsAddress : '',
      deliveryArea: payload?.deliveryArea ? payload?.deliveryArea: '',
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
      customer_address: payload?.deliveryDetailsAddress ? payload?.deliveryDetailsAddress : '',
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
  const orders = await Order.find({ user: user._id });

  return orders;
};


// Get Orders for Admin
const getOrdersForAdmin = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(400, 'User Not Found');
  }
  const orders = await Order.find().populate('user');

  return orders;
};


// Update Order Status for Admin
const updateOrdersForAdmin = async (id: string, payload:{status:string}) => {
  const order = await Order.findById(id)
  if (!order) {
    throw new AppError(400, 'Order Not Found!');
  }

   if (!payload?.status) {
     throw new AppError(400, 'Status is Required!');
   }
  // Update Order
  const updatedOrder = await Order.findByIdAndUpdate(id, { orderStatus:payload?.status }, {new:true});
  return updatedOrder;
};


// Delete Order For Admin
const deleteOrdersForAdmin = async (id: string) => {
  const order = await Order.findByIdAndDelete(id)
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
};

