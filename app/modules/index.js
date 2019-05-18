import Router from 'koa-router';
import auth from './auth';
import summaries from './summaries';
import users from './users';

const router = new Router({ prefix: '/api' });

router.use(auth);
router.use(summaries);
router.use(users);

export default router.routes();
