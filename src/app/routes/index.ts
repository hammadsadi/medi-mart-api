import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { MedicineRoutes } from '../modules/medicine/medicine.routes';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
