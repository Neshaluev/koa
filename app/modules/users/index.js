import Router from 'koa-router';
import checkUserByHash from './handlers/checkUserByHash';
import { User } from './models';
import UsersController from './controllers/users-controller';

const router = new Router({ prefix: '/users' });

router
  .param('hash', checkUserByHash())
  .get('/:hash/summaries', UsersController.getSummariesByUserHash);

export {
  User,
};

export default router.routes();
