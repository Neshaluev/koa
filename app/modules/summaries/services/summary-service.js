import { Summary } from '../models';

export default {
  async createSummary(data) {
    const { userHash } = data;
    const summaryCountByUserId = await Summary.count({ userHash });

    if (summaryCountByUserId === 3) {
      throw new AppError({ status: 400, message: 'User can have no more than three summaries' });
    }

    return Summary.create(data);
  },

  updateSummary(data, summary) {
    summary.set(data);

    try {
      return summary.save();
    } catch (e) {
      throw new AppError({ status: 400, ...e });
    }
  },

  async search({
    tags,
    size,
    page,
    title,
  }) {
    const query = {
      title: { $regex: new RegExp(title, 'ig') },
    };

    if (tags.length) {
      query.tags = { $in: tags };
    }

    const count = await Summary.count(query);
    const pages = Math.ceil(count / size);

    const summaries = await Summary
      .find(query)
      .populate('user', '-password')
      .sort({ updatedAt: '-1' })
      .limit(size)
      .skip((page - 1) * size);

      return {
        summaries,
        count,
        pages,
      };
  },
};
