import pick from 'lodash/pick';
import {
  connect,
  close,
  dropDb,
} from '../../../../utils/mongo';
import { SummaryService } from '../../services';
import AppError from '../../../../helpers/appError';

global.AppError = AppError;

describe('Summary Service', () => {
  beforeAll(async () => {
    await connect();
    await dropDb();
  });

  afterAll(async () => {
    await dropDb();
    await close();
  });

  it('create summary as expected', async () => {
    const summaryData = {
      userHash: 'some-hash',
      title: 'Summary title',
      description: 'Summary Description',
      tags: [
        'js',
        'node',
      ],
    };

    const summaryModel = await SummaryService.createSummary(summaryData);
    const summary = summaryModel.toObject();

    expect(pick(summary, Object.keys(summaryData))).toEqual(summaryData);
    expect(summary).toHaveProperty('hash');
    expect(summary).toHaveProperty('createdAt');
    expect(summary).toHaveProperty('updatedAt');
    await dropDb();
  });

  it('error user can\'t create more than 3 summaries', async () => {
    const summaryData = {
      userHash: 'some-hash',
      title: 'Summary title',
      description: 'Summary Description',
      tags: [
        'js',
        'node',
      ],
    };

    await SummaryService.createSummary(summaryData);
    await SummaryService.createSummary(summaryData);
    await SummaryService.createSummary(summaryData);

    try {
      await SummaryService.createSummary(summaryData);
    } catch (e) {
      expect(e).toEqual(new AppError({ status: 400, message: 'User can have no more than three summaries' }));
    }
  });

  it('error on not valid data', async () => {
    try {
      await SummaryService.createSummary({});
    } catch (e) {
      const { errors } = e.toJSON();

      expect(errors).toHaveProperty('description');
      expect(errors).toHaveProperty('title');
      expect(errors).toHaveProperty('userHash');
      expect(errors).toHaveProperty('tags');
    }
  });
});
