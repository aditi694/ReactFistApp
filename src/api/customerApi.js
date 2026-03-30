import { apiRequest } from "./apiClient";

export const getCustomerDashboard = () =>
    apiRequest("/api/account/dashboard");

export const getNominee = (customerId) =>
    apiRequest(`/customers/${customerId}/nominee`);