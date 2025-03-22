import axios from "axios";
import { BaseFinanceService } from "./BaseFinanceService";
import { apiConfig } from "@/config/api";

export default class DefaultFinanceService extends BaseFinanceService {
    addTransaction(transactionData: { date: Date; amount: number; accountFrom: string; accountTo: string; store: string; remarks: string; }): Promise<any> {
        throw new Error("Method not implemented.");
    }
    setBudgetTarget(budgetData: { category: string; monthlyTarget: number; notes: string; }): Promise<any> {
        throw new Error("Method not implemented.");
    }
    importBankStatement(file: File): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getTransactions(): Promise<any> {
        return axios.get(`${apiConfig.baseUrl}/transactions`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Failed to get transactions');
            });
    }
    deleteTransaction(id: string): Promise<void> {
        return axios.delete(`${apiConfig.baseUrl}/transactions/${id}`)
            .then(() => {})
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Failed to delete transaction');
            });
    }
}