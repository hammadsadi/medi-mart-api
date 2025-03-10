
## 🏥 Medi Mart - Medicine Store Overview

Medi Mart is a modern online medicine store where users can conveniently purchase medicines. For prescription-required medicines, users must upload a valid prescription during checkout. The platform ensures a secure shopping experience with a trusted payment gateway.

## 🚛 Delivery Options:
Users can choose from three delivery options, each with different charges:
1️⃣ Home Delivery – Standard delivery to your doorstep.
2️⃣ Store Pickup – Collect your order from our nearest store.
3️⃣ Express Delivery – Get your order delivered faster with priority service.

Medi Mart provides a seamless, secure, and user-friendly experience for all your healthcare needs!

## [ Live API URL](https://hammad-sadi-portfolio.vercel.app)

Click here for the Medi Mart API Site: [https://hammad-sadi-portfolio.vercel.app/](https://hammad-sadi-portfolio.vercel.app/)


## 🚀 Project Features - Medi Mart

👥 User Features

1. **Medicine Purchase:** Users can browse and buy medicines.
2. **Prescription Upload:** Required for specific medicines during checkout.
3. **Secure Payment:** Payments processed via a trusted payment gateway.
4. **Delivery Options:** Choose from Home Delivery, Store Pickup, or Express Delivery, with charges applied accordingly.
5. **Order Tracking:** Users can track their order Checking status:
 Checking Status: "In Review" | "Accepted" | "Denied"
 Delivery Status: "Processing" | "Shipped" | "Delivered" | "Pending"
6. **Coupon & Discounts:** Apply discount coupons to get special offers.

👤 Admin Features

8. **Prescription Verification:** Admin reviews and approves prescriptions before order processing.
9. **Order Management:** Get and manage all user orders.
10. **Delivery Status Update:** Admin can update the delivery progress.
10. **Medicine Management:** Admin can Manage Medicine.


## 🧑‍💻 Usegaes Technologies

💻 Backend Technologies
- Node JS
- Express JS
- Typescript
- MongoDB
- Mongoose
- Zod

## 🛠️ Installation and Setup

Follow these steps to set up the project locally:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2.Install the required dependencies:

```bash
npm install
```

3. Create a .env file in the root directory and configure the following environment variables:

```bash
  PORT=5000
DB_URL=<your-mongodb-url>
NODE_ENV=<deployment>
BCRYPT_SALT_ROUNDS=<bcrypt_salt_number>
JWT_ACCESS_TOKEN_SECRET=<jwt_access_token_secret>
JWT_ACCESS_EXPIRES_IN=<jwt_access_experies_in>
SP_ENDPOINT=<shurjo_pay_sp_end_point>
SP_USERNAME=<shurjo_pay_sp_username>
SP_PASSWORD=<shurjo_pay_sp_password>
SP_PREFIX=<shurjo_pay_sp_prefix>
SP_RETURN_URL=<shurjo_pay_sp_return_url>
DB_FILE=<shurjo_pay_db_file>
SM_PASS=<email_send_pass>
```


4. Start the Client:

```bash
 npm run dev
```

5. The Live Site will be available at

```bash
http://localhost:5000
```


