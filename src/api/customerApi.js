import { apiRequest } from "./apiClient";

export const getCustomerDashboard = () =>
    apiRequest("/api/account/dashboard");

export const getNominee = (customerId) =>
    apiRequest(`/customers/${customerId}/nominee`);

export const applyCreditCard = (data) =>
    apiRequest("/api/account/credit-cards/apply", "POST", data);

export const applyLoan = (data) =>
    apiRequest("/api/account/loans/request", "POST", data);

export const applyInsurance = (data) =>
    apiRequest("/api/account/insurance/request", "POST", data);