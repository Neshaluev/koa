import jwtService from '../services/jwt-service';
import { User } from '../modules/users';

export default () => async (ctx, next) => {
  const { authorization } = ctx.headers;

  if (authorization) {
    try {
      const { email } = await jwtService.verify(authorization);

      ctx.state.user = await User.findOne({ email });
    } catch (e) {
      ctx.throw(401, { message: 'Unauthorized. Invalid Token' });
    }
  }

  await next();
};
