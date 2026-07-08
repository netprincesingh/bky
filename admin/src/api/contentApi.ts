import { api } from "./Api";

// --- Types ---

export interface Author {
  id: string;
  name: string;
  bio?: string;
  profile_picture_key?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string | null;
  language: string;
  description?: string;
  cover_image_key?: string;
  published_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BookNode {
  id: string;
  book: string;
  parent: string | null;
  node_type: string;
  title?: string;
  order: number;
  created_at?: string;
}

export interface BookNodeTree extends BookNode {
  children: BookNodeTree[];
}

export interface Article {
  id: string;
  title: string;
  author: string | null;
  language: string;
  content: string;
  cover_image_key?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentChunk {
  id: string;
  node: string | null;
  article: string | null;
  chunk_text: string;
  chunk_order: number;
}

// --- API Slice ---

export const contentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Author Endpoints
    getAuthors: builder.query<Author[], void>({
      query: () => "/content/author/list/",
      providesTags: ["Author"] as any,
    }),
    createAuthor: builder.mutation<Author, Partial<Author>>({
      query: (body) => ({
        url: "/content/author/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Author"] as any,
    }),
    updateAuthor: builder.mutation<Author, { id: string; body: Partial<Author> }>({
      query: ({ id, body }) => ({
        url: `/content/author/update/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Author"] as any,
    }),
    deleteAuthor: builder.mutation<void, string>({
      query: (id) => ({
        url: `/content/author/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Author"] as any,
    }),

    // Book Endpoints
    getBooks: builder.query<Book[], void>({
      query: () => "/content/book/list/",
      providesTags: ["Book"] as any,
    }),
    createBook: builder.mutation<Book, Partial<Book>>({
      query: (body) => ({
        url: "/content/book/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Book"] as any,
    }),
    updateBook: builder.mutation<Book, { id: string; body: Partial<Book> }>({
      query: ({ id, body }) => ({
        url: `/api/content/book/update/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Book"] as any,
    }),
    deleteBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/content/book/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"] as any,
    }),

    // Book Node Endpoints
    getBookIndex: builder.query<BookNodeTree[], string>({
      query: (bookId) => `/content/book/${bookId}/index/`,
      providesTags: ["BookNode"] as any,
    }),
    createBookNode: builder.mutation<BookNode, Partial<BookNode>>({
      query: (body) => ({
        url: "/content/node/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BookNode"] as any,
    }),
    updateBookNode: builder.mutation<BookNode, { id: string; body: Partial<BookNode> }>({
      query: ({ id, body }) => ({
        url: `/content/node/update/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["BookNode"] as any,
    }),
    deleteBookNode: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/content/node/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["BookNode"] as any,
    }),

    // Article Endpoints
    getArticles: builder.query<Article[], void>({
      query: () => "/api/content/article/list/",
      providesTags: ["Article"] as any,
    }),
    createArticle: builder.mutation<Article, Partial<Article>>({
      query: (body) => ({
        url: "/api/content/article/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Article"] as any,
    }),
    updateArticle: builder.mutation<Article, { id: string; body: Partial<Article> }>({
      query: ({ id, body }) => ({
        url: `/api/content/article/update/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Article"] as any,
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/content/article/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Article"] as any,
    }),

    // Content Chunk Endpoints
    getContentChunks: builder.query<ContentChunk[], void>({
      query: () => "/api/content/chunk/list/",
      providesTags: ["ContentChunk"] as any,
    }),
    createContentChunk: builder.mutation<ContentChunk, Partial<ContentChunk>>({
      query: (body) => ({
        url: "/api/content/chunk/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ContentChunk"] as any,
    }),
    updateContentChunk: builder.mutation<ContentChunk, { id: string; body: Partial<ContentChunk> }>({
      query: ({ id, body }) => ({
        url: `/api/content/chunk/update/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ContentChunk"] as any,
    }),
    deleteContentChunk: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/content/chunk/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ContentChunk"] as any,
    }),
  }),
  overrideExisting: false,
});

export const {
  // Author
  useGetAuthorsQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
  
  // Book
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  
  // Book Node
  useGetBookIndexQuery,
  useCreateBookNodeMutation,
  useUpdateBookNodeMutation,
  useDeleteBookNodeMutation,
  
  // Article
  useGetArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  
  // Content Chunk
  useGetContentChunksQuery,
  useCreateContentChunkMutation,
  useUpdateContentChunkMutation,
  useDeleteContentChunkMutation,
} = contentApi;
