import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { MedicineRoutes } from '../modules/medicine/medicine.routes';
import { CouponRoutes } from '../modules/coupon/coupon.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/medicine',
    route: MedicineRoutes,
  },
  {
    path: '/coupon',
    route: CouponRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
