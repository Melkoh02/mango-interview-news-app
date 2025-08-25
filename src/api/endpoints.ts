import client, {wrapRequest} from './client';

export const getEverythingNews = (params: {
  q?: string;
  language?: string;
  from?: string; // ISO date
  to?: string; // ISO date
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
  pageSize?: number;
  page?: number;
  sources?: string[];
  searchIn?: string;
}) => wrapRequest(client.get('everything', {params}));