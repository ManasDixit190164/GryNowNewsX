import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsArticle } from './newsApi';

const BOOKMARKS_KEY = '@GryNowNews:bookmarks';

export const bookmarkService = {
  getBookmarks: async (): Promise<NewsArticle[]> => {
    try {
      const bookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  },

  addBookmark: async (article: NewsArticle): Promise<void> => {
    try {
      const bookmarks = await bookmarkService.getBookmarks();
      const exists = bookmarks.some(bookmark => bookmark.url === article.url);
      
      if (!exists) {
        bookmarks.push(article);
        await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  },

  removeBookmark: async (articleUrl: string): Promise<void> => {
    try {
      const bookmarks = await bookmarkService.getBookmarks();
      const filteredBookmarks = bookmarks.filter(bookmark => bookmark.url !== articleUrl);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  },

  isBookmarked: async (articleUrl: string): Promise<boolean> => {
    try {
      const bookmarks = await bookmarkService.getBookmarks();
      return bookmarks.some(bookmark => bookmark.url === articleUrl);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  },
}; 