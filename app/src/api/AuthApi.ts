import { api } from './Api';




export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({


    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/user/login/',
        method: 'POST',
        body: credentials,
      }),
    }),


    refreshToken: builder.mutation<any, any>({
      query: (data) => ({
        url: '/user/token/refresh/',
        method: 'POST',
        body: data,
      }),
    }),



  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApi;
