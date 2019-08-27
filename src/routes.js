import { Router } from 'express';

import UsersController from './app/controllers/UserController';

const routes = new Router();

routes.post('/users', UsersController.store);

export default routes;
