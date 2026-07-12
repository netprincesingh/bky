import { api } from './Api';

export interface Book {
  id: string;
  title: string;
  author: any;
  language: string;
  description: string;
  cover_image_key?: string;
  published_date?: string;
}

export interface Article {
  id: string;
  title: string;
  author: any;
  language: string;
  content: string;
  cover_image_key?: string;
}

export const libraryContentApi = api.injectEndpoints({
  endpoints: (builder) => ({


    getBooks: builder.query<Book[], void>({
      query: () => '/content/book/list/',
      transformResponse: (response: any) => {
        // Handle DRF pagination if present
        return Array.isArray(response) ? response : response.results || [];
      },
    }),

    
    getArticles: builder.query<Article[], void>({
      query: () => '/content/article/list/',
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response.results || [];
      },
    }),


  }),
});

export const { useGetBooksQuery, useGetArticlesQuery } = libraryContentApi;
