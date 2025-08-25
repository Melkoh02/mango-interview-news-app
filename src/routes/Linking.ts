import type { LinkingOptions } from '@react-navigation/native';
import { Routes, type RootStackParamList } from '../lib/types/navigation';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['mangonews://', 'https://mangonews.app'],
  config: {
    screens: {
      [Routes.News]: 'news',
      [Routes.NewsDetail]: 'news/:id',
    },
  },
};

export default linking;
