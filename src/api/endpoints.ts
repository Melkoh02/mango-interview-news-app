import client, {wrapRequest} from './client';

export const allNews = (data: {[key: string]: any}) => {
  return wrapRequest(client.post('everything/', data));
};