import { Summary } from '../models';

export default () => async (hash, ctx, next) => {
  const summary = await Summary.findOne({ hash });

  if (!summary) {
    ctx.throw(404, `Summary with link "${hash}" not found`);
  }

  ctx.state.summary = summary;

  await next();
};
