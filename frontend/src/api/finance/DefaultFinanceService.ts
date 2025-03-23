import axios from "axios";
import { BaseFinanceService } from "./BaseFinanceService";
import { httpClient } from "../http-client";
import type { Transaction } from "@/types/finance";

export default class DefaultFinanceService extends BaseFinanceService {
    addTransaction(transactionData: { date: Date; amount: number; accountFrom: string; accountTo: string; store: string; remarks: string; }): Promise<any> {
        throw new Error("Method not implemented.");
    }
    setBudgetTarget(budgetData: { category: string; monthlyTarget: number; notes: string; }): Promise<any> {
        throw new Error("Method not implemented.");
    }
    importBankStatement(file: File): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }
    getTransactions(): Promise<Transaction[]> {
        return httpClient.get<Transaction[]>(`/transactions`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Failed to get transactions');
            });
    }
    deleteTransaction(id: string): Promise<void> {
        return axios.delete(`/transactions/${id}`)
            .then(() => {})
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Failed to delete transaction');
            });
    }
}