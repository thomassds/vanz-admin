import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/api/axiosBaseQuery";
import type { PaginatedResponse } from "@/shared/types/api.types";
import type {
  Contract,
  ContractFilters,
  CreateContractDTO,
  UpdateContractDTO,
} from "../types/contract.types";

export const contractsApi = createApi({
  reducerPath: "contractsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Contract"],
  endpoints: (builder) => ({
    getContracts: builder.query<PaginatedResponse<Contract>, ContractFilters>({
      query: (params) => ({ url: "/contracts", method: "GET", params }),
      providesTags: ["Contract"],
    }),
    getContractById: builder.query<Contract, string>({
      query: (id) => ({ url: `/contracts/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Contract", id }],
    }),
    createContract: builder.mutation<Contract, CreateContractDTO>({
      query: (body) => ({ url: "/contracts", method: "POST", data: body }),
      invalidatesTags: ["Contract"],
    }),
    updateContract: builder.mutation<Contract, UpdateContractDTO>({
      query: ({ id, ...body }) => ({
        url: `/contracts/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Contract"],
    }),
  }),
});

export const {
  useGetContractsQuery,
  useGetContractByIdQuery,
  useCreateContractMutation,
  useUpdateContractMutation,
} = contractsApi;
