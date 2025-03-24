import axios, { AxiosError } from "axios";
import { BaseFinanceService } from "./BaseFinanceService";
import { httpClient } from "../http-client";
import type { Transaction } from "@/types/finance";
import { ApiError } from "../api-error";

export default class DefaultFinanceService extends BaseFinanceService {
  addTransaction(transaction: Transaction): Promise<Transaction> {
    throw new Error("Method not implemented.");
  }
  importBankStatement(file: File): Promise<Transaction[]> {
    throw new Error("Method not implemented.");
  }
  getTransactions(limit: number, offset: number): Promise<Transaction[]> {
    console.log("limit ", limit, "offset ", offset);
    return httpClient
      .get<Transaction[]>(`/transactions`)
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          throw new ApiError("Session expired", "warning");
        }
        throw new ApiError("Unknown error", "error");
      });
  }
  deleteTransaction(id: string): Promise<void> {
    return axios
      .delete(`/transactions/${id}`)
      .then(() => {})
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          throw new ApiError("Session expired", "warning");
        }
        throw new ApiError("Unknown error", "error");
      });
  }
}
