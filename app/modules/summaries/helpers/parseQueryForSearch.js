import queryString from 'querystring';
import pick from 'lodash/pick';
import get from 'lodash/get';

import {
  MAX_SIZE,
  PAGE,
} from '../constants/pagination';

export default (query) => {
  const params = queryString.parse(query);
  const queryParams = pick(params, ['title', 'tags', 'size', 'page']);

  const search = {
    title: get(queryParams, 'title', ''),
    size: parseInt(queryParams.size),
    page: parseInt(queryParams.page),
    tags: get(queryParams, 'tags', []),
  };

  if (!search.size || search.size > MAX_SIZE) {
    search.size = MAX_SIZE;
  }

  if (!search.page) {
    search.page = PAGE;
  }

  return search;
};
