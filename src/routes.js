import { Router } from 'express';

import UsersController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/users', UsersController.store);
routes.post('/sessions', SessionController.store);

export default routes;
