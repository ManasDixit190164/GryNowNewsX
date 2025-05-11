import axios from 'axios';

const API_KEY = 'ba8986bb549545adb2432e5e125e4543'; // Replace with your NewsAPI key
const BASE_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export const newsApi = {
  getTopHeadlines: async (page: number = 1): Promise<NewsResponse> => {
    try {
      console.log('Fetching news for page:', page);
      const response = await axios.get<NewsResponse>(`${BASE_URL}/top-headlines`, {
        params: {
          country: 'us', // Changed to India
          apiKey: API_KEY,
          page,
          pageSize: 5, // Number of articles per page
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      return {
        status: 'error',
        totalResults: 0,
        articles: [],
      };
    }
  },
}; 