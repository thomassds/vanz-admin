import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/api/axiosBaseQuery";
import type { PaginatedResponse } from "@/shared/types/api.types";
import type {
  Client,
  Dependent,
  ClientFilters,
  CreateClientDTO,
  UpdateClientDTO,
  CreateDependentDTO,
  UpdateDependentDTO,
} from "../types/client.types";

export const clientsApi = createApi({
  reducerPath: "clientsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Client", "Dependent"],
  endpoints: (builder) => ({
    getClients: builder.query<PaginatedResponse<Client>, ClientFilters>({
      query: (params) => ({ url: "/clients", method: "GET", params }),
      providesTags: ["Client"],
    }),
    getClient: builder.query<Client, string>({
      query: (id) => ({ url: `/clients/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Client", id }],
    }),
    createClient: builder.mutation<Client, CreateClientDTO>({
      query: (body) => ({ url: "/clients", method: "POST", data: body }),
      invalidatesTags: ["Client"],
    }),
    updateClient: builder.mutation<Client, UpdateClientDTO>({
      query: ({ id, ...body }) => ({
        url: `/clients/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Client"],
    }),
    disableClient: builder.mutation<void, string>({
      query: (id) => ({ url: `/clients/${id}/disable`, method: "PUT" }),
      invalidatesTags: ["Client"],
    }),
    getDependents: builder.query<Dependent[], { clientId: string }>({
      query: ({ clientId, ...params }) => ({
        url: `/clients/${clientId}/dependents`,
        method: "GET",
        params,
      }),
      transformResponse: (response: PaginatedResponse<Dependent>) =>
        response.items,
      providesTags: ["Dependent"],
    }),
    createDependent: builder.mutation<Dependent, CreateDependentDTO>({
      query: (body) => ({
        url: "/clients/dependents",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Dependent"],
    }),
    updateDependent: builder.mutation<Dependent, UpdateDependentDTO>({
      query: ({ id, ...body }) => ({
        url: `/clients/dependents/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Dependent"],
    }),
    deleteDependent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clients/dependents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dependent"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDisableClientMutation,
  useGetDependentsQuery,
  useCreateDependentMutation,
  useUpdateDependentMutation,
  useDeleteDependentMutation,
} = clientsApi;
