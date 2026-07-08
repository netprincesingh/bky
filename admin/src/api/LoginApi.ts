import { api } from "./Api";
import type { UserData } from "../redux/AuthSlice";

export interface LoginResponse {
  refresh: string;
  access: string;
  user: UserData;
}

export const loginApi = api.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<LoginResponse, any>({
      query: (credentials) => ({
        url: "/user/admin/login/",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useAdminLoginMutation } = loginApi;
