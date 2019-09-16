import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UsersController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UsersController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UsersController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupController.store);
routes.get('/meetups', MeetupController.index);
routes.put('/meetups/:meetID', MeetupController.update);
routes.delete('/meetups/:meetID', MeetupController.delete);
routes.post('/meetups/:meetID/subscriptions', SubscriptionController.store);

export default routes;
