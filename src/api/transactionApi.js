import { apiRequest } from "./apiClient";

// ================= TRANSACTIONS =================
export const debit = (data) =>
    apiRequest("/api/customer/transaction/debit", "POST", data);

export const credit = (data) =>
    apiRequest("/api/customer/transaction/credit", "POST", data);

export const transfer = (data) =>
    apiRequest("/api/customer/transaction/transfer", "POST", data);

export const getTransactionStatus = (txnId) =>
    apiRequest(`/api/customer/transaction/${txnId}/status`);

// ================= HISTORY =================
export const getTransactions = (accountNumber, page = 1, limit = 5) =>
    apiRequest(
        `/api/customer/transactions?account_number=${accountNumber}&page=${page}&limit=${limit}`
    );

// ================= STATEMENTS =================
export const getMiniStatement = (accountNumber) =>
    apiRequest(`/api/customer/mini-statement?account_number=${accountNumber}`);

export const sendPdfToEmail = async (accountNumber, from, to) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
        `http://localhost:8080/api/customer/transactions/pdf/email?account_number=${accountNumber}&from=${from}&to=${to}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    if (!res.ok) throw new Error("Failed");
    return res.text();
};
export const downloadPdf = async (accountNumber, from, to) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
        `http://localhost:8080/api/customer/transactions/pdf?account_number=${accountNumber}&from=${from}&to=${to}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "statement.pdf";
    a.click();
};

// ================= ANALYTICS =================
export const getAnalytics = (accountNumber, month) =>
    apiRequest(`/api/transactions/analytics?accountNumber=${accountNumber}&month=${month}`);

// ================= SCHEDULE =================
export const scheduleTransaction = (data) =>
    apiRequest("/api/transactions/scheduled", "POST", data);

export const getSchedules = () =>
    apiRequest("/api/transactions/scheduled");

export const pauseSchedule = (id) =>
    apiRequest(`/api/transactions/scheduled/${id}/pause`, "PUT");

export const resumeSchedule = (id) =>
    apiRequest(`/api/transactions/scheduled/${id}/resume`, "PUT");

export const cancelSchedule = (id) =>
    apiRequest(`/api/transactions/scheduled/${id}`, "DELETE");
