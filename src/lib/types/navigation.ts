import { Article } from './article.ts';

export enum Routes {
  News = 'News',
  NewsDetail = 'NewsDetail',
}

export type RootStackParamList = {
  [Routes.News]: undefined;
  [Routes.NewsDetail]: { article: Article };
};