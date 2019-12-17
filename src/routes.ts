import { Router } from 'express';
import multer from 'multer';

import UserController from './controllers/UserController';
import AuthMiddleware from './config/AuthMiddleware';
import multerConfig from './config/UploadMiddleware';

const router: Router = Router();

router.get('/users', UserController.index);
router.post('/users/signup', UserController.signup);
router.post('/users/signin', UserController.signin);
router.delete('/users/signout', UserController.signout);
router.get('/myuser', AuthMiddleware.validateToken, UserController.show);
router.put(
  '/myuser',
  multer(multerConfig.storage).single('thumbnail'),
  AuthMiddleware.validateToken,
  UserController.update,
);

export default router;
