import pick from 'lodash/pick';
import { User } from '../../users';
import jwtService from '../../../services/jwt-service';
import { UserService } from '../../users/services';

export default {
  async signUp(ctx) {
    const userData = pick(ctx.request.body, User.createFields);
    const { _id } = await UserService.createUser(userData);
    const user = await UserService.getUserWithPublicFields({ _id });

    ctx.status = 201;
    ctx.body = { data: user };
  },

  async signIn(ctx) {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      ctx.throw(400, {
        message: 'Invalid data',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      ctx.throw(400, {
        message: 'User not found',
      });
    }

    if (!user.comparePasswords(password)) {
      ctx.throw(400, {
        message: 'Invalid data',
      });
    }

    const token = await jwtService.genToken({ email });

    ctx.body = { data: token };
  },

  async currentUser(ctx) {
    const { state: { user: { _id } } } = ctx;
    const user = await UserService.getUserWithPublicFields({ _id });

    ctx.body = { data: user };
  },
};
