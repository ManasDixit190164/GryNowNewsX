import { NewsArticle } from '../services/newsApi';

export type RootStackParamList = {
  Home: undefined;
  ArticleDetail: { article: NewsArticle };
};

export type MainTabParamList = {
  News: undefined;
  Bookmarks: undefined;
}; 