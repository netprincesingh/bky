import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../redux/store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://bky.onrender.com/api/v1/";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    // Attach auth token to every request automatically
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  // Tag types for cache invalidation (add more as you build features)
  tagTypes: ["User", "Auth", "Author", "Book", "BookNode", "Article", "ContentChunk"],

  // Endpoints are injected from individual feature API files (e.g. LoginApi.ts)
  endpoints: () => ({}),
});
