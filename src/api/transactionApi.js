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

const BASE_URL = "http://localhost:8080";
export const downloadTransactionsPdf = async (accountNumber, from, to) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${BASE_URL}/api/customer/transactions/pdf?account_number=${accountNumber}&from=${from}&to=${to}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType.includes("application/pdf")) {
            const text = await response.text();
            console.error("Not a PDF:", text);
            throw new Error("Invalid PDF response");
        }
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "transaction-statement.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("PDF Download Error:", error);
    }
};