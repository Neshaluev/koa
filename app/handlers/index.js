import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import cors from 'koa2-cors';
import { IS_DEV } from '../utils/env';
import error from './error';
import jwt from './jwt';

export default (app) => {
  if (IS_DEV) {
    app.use(logger());
  }

  app.use(cors());
  app.use(error());
  app.use(bodyParser());
  app.use(jwt());
};
