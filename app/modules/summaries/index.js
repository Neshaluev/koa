import Router from 'koa-router';
import summariesController from './controllers/summaries-controller';
import checkUser from '../../handlers/checkUser';
import chekSummary from './handlers/checkSummary';
import { Summary } from './models';

const router = new Router({ prefix: '/summaries' });

router
  .post('/', checkUser(), summariesController.create)
  .get('/', summariesController.searchSummaries)
  .param('hash', chekSummary())
  .put('/:hash', checkUser(), summariesController.update)
  .delete('/:hash', checkUser(), summariesController.delete)
  .get('/:hash', summariesController.getSummary);

export {
  Summary,
};

export default router.routes();
