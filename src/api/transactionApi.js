import { apiRequest } from "./apiClient";

export const debit = (data) =>
    apiRequest("/api/customer/transaction/debit", "POST", data);

export const credit = (data) =>
    apiRequest("/api/customer/transaction/credit", "POST", data);

export const transfer = (data) =>
    apiRequest("/api/customer/transaction/transfer", "POST", {
        fromAccount: data.fromAccount,
        toAccount: data.toAccount,
        amount: data.amount,
        transferType: data.transferType || "IMPS",
        description: data.description,
    });

export const getTransactions = (accountNumber) =>
    apiRequest(
        `/api/customer/transactions?account_number=${accountNumber}&page=1&limit=20`
    );

export const getTransactionStatus = (txnId) =>
    apiRequest(`/api/customer/transaction/${txnId}/status`, "GET");