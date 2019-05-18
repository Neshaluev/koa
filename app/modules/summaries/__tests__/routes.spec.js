import supertest from 'supertest';
import server from '../../../server';
import {
  close,
  dropDb,
} from '../../../utils/mongo';
import { SummaryService } from '../services/index';

describe('Summaries routes', () => {
  describe('summaries search', () => {
    afterAll(async () => {
      await dropDb();
      await close();
      await server.close();
    });

    it('no records by get all', async () => {
      const response = await supertest(server).get('/api/summaries');

      expect(response.body).toEqual({
        data: [],
        filter: {
          title: '',
          tags: [],
          size: 20,
          page: 1,
        },
        count: 0,
        pages: 0,
      });
    });

    it('return as expected search', async () => {
      await SummaryService.createSummary({
        title: 'Senior js',
        description: 'desc',
        tags: ['js, node'],
        userHash: 'dfdsf',
      });
      await SummaryService.createSummary({
        title: 'Middle php',
        description: 'desc',
        tags: ['js, php'],
        userHash: 'dfdsf',
      });
      await SummaryService.createSummary({
        title: 'Senior php',
        description: 'desc',
        tags: ['php'],
        userHash: 'dfdsf',
      });

      // change title mongoose fo no match cases
      const response = await supertest(server).get('/api/summaries?title=se');
      const { body: { filter, data, count, pages } } = response;

      expect(filter).toEqual({
          title: 'se',
          tags: [],
          size: 20,
          page: 1,
        });
      expect(data).toHaveLength(2);
      expect(count).toBe(2);
      expect(pages).toBe(1);
    });

    it('return no results by search', async () => {
      const response = await supertest(server).get('/api/summaries?title=Jun');
      const { body: { filter, data, count, pages } } = response;

      expect(filter).toEqual({
          title: 'Jun',
          tags: [],
          size: 20,
          page: 1,
        });
      expect(data).toHaveLength(0);
      expect(count).toBe(0);
      expect(pages).toBe(0);
    });
  });
});
