import pick from 'lodash/pick';
import { Summary } from '../models';
import { SummaryService } from '../services';
import parseQueryForSearch from '../helpers/parseQueryForSearch';

export default {
  async create(ctx) {
    const summaryData = {
      ...pick(ctx.request.body, Summary.createFields),
      userHash: ctx.state.user.hash,
    };

    const { _id } = await SummaryService.createSummary(summaryData);
    const summary = await Summary.findOne({ _id });

    ctx.status = 201;
    ctx.body = { data: summary };
  },

  async update(ctx) {
    const {
      request: {
        body,
      },
      state: {
        user: {
          hash,
        },
        summary,
      },
    } = ctx;

    if (summary.userHash !== hash) {
      ctx.throw(403, `Forbidden. Summary with hash "${summary.hash}" dont belong to user with hash ${hash}`);
    }

    const newData = pick(body, Summary.createFields);
    const updatedSummary = await SummaryService.updateSummary(newData, summary);

    ctx.body = { data: updatedSummary };
  },

  async delete(ctx) {
    const {
      state: {
        user: {
          hash,
        },
        summary,
      },
    } = ctx;

    if (summary.userHash !== hash) {
      ctx.throw(403, `Forbidden. Summary with hash "${summary.hash}" dont belong to user with id ${hash}`);
    }

    await summary.remove();

    ctx.body = { data: { id: summary.hash } };
  },

  getSummary(ctx) {
    const { state: { summary } } = ctx;

    ctx.body = { data: pick(summary, Summary.createFields) };
  },

  async searchSummaries(ctx) {
    const query = ctx.request.querystring;
    const filter = parseQueryForSearch(query);
    const { summaries, ...rest } = await SummaryService.search(filter);

    ctx.body = {
      data: summaries,
      filter,
      ...rest,
    };
  },
};
