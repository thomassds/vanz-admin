import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/api/axiosBaseQuery";
import type { PaginatedResponse } from "@/shared/types/api.types";
import type {
  ActivateContractResponse,
  CancelContractDTO,
  CancelContractResponse,
  Contract,
  ContractFilters,
  ContractHistoryResponse,
  CreateContractDTO,
  RenewContractDTO,
  SuspendContractDTO,
  SuspendContractResponse,
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
    getContractHistory: builder.query<
      ContractHistoryResponse,
      { id: string; page: number; limit: number }
    >({
      query: ({ id, page, limit }) => ({
        url: `/contracts/${id}/history`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (_result, _error, { id }) => [{ type: "Contract", id }],
    }),
    renewContract: builder.mutation<Contract, { id: string } & RenewContractDTO>({
      query: ({ id, ...body }) => ({
        url: `/contracts/${id}/renew`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Contract", id }],
    }),
    cancelContract: builder.mutation<CancelContractResponse, { id: string } & CancelContractDTO>({
      query: ({ id, ...body }) => ({
        url: `/contracts/${id}/cancel`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Contract", id }],
    }),
    activateContract: builder.mutation<ActivateContractResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/contracts/${id}/activate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Contract", id }],
    }),
    suspendContract: builder.mutation<SuspendContractResponse, { id: string } & SuspendContractDTO>({
      query: ({ id, ...body }) => ({
        url: `/contracts/${id}/suspend`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Contract", id }],
    }),
  }),
});

export const {
  useGetContractsQuery,
  useGetContractByIdQuery,
  useCreateContractMutation,
  useUpdateContractMutation,
  useGetContractHistoryQuery,
  useRenewContractMutation,
  useCancelContractMutation,
  useActivateContractMutation,
  useSuspendContractMutation,
} = contractsApi;
