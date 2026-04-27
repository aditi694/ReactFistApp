import { apiRequest } from "./apiClient";

// ================= ACCOUNT =================
export const getBalance = () =>
    apiRequest("/api/account/balance");

export const changePassword = (data) =>
    apiRequest("/api/account/change-password", "POST", data);

// ================= CREDIT CARD =================
export const applyCreditCard = (data) =>
    apiRequest("/api/account/credit-cards/apply", "POST", data);

export const getCreditCardStatus = () =>
    apiRequest("/api/account/credit-cards/status");

// ================= DEBIT CARD =================
export const getDebitCard = () =>
    apiRequest("/api/account/cards/debit");

// ================= LOANS =================
export const applyLoan = (data) =>
    apiRequest("/api/account/loans/request", "POST", data);

export const getMyLoans = () =>
    apiRequest("/api/account/loans");

// ================= INSURANCE =================
export const applyInsurance = (data) =>
    apiRequest("/api/account/insurance/request", "POST", data);

export const getMyInsurances = () =>
    apiRequest("/api/account/insurance");

// ================= LIMITS =================
export const getLimits = (accountNumber) =>
    apiRequest(`/api/customer/limits?accountNumber=${accountNumber}`);

export const updateLimits = (accountNumber, data) =>
    apiRequest(`/api/customer/limits?accountNumber=${accountNumber}`, "PUT", data);

