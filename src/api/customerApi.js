
import { apiRequest } from "./apiClient";

// ================= AUTH =================
export const customerLogin = (accountNumber, password) =>
    apiRequest("/api/account/login", "POST", { accountNumber, password });

export const registerCustomer = (data) =>
    apiRequest("/api/public/register", "POST", data);

// ================= DASHBOARD =================
export const getCustomerDashboard = () =>
    apiRequest("/api/account/dashboard");

// ================= NOMINEE =================
export const getNominee = (customerId) =>
    apiRequest(`/customers/${customerId}/nominee`);

// ================= BENEFICIARY =================
export const addBeneficiary = (data) =>
    apiRequest("/api/beneficiaries", "POST", data);

export const getBeneficiaries = () =>
    apiRequest("/api/beneficiaries");

// ================= NOTIFICATIONS =================
export const getNotifications = () =>
    apiRequest("/api/customer/notifications");

export const markNotificationRead = (id) =>
    apiRequest("/api/customer/notifications/read", "PATCH", {
        notificationId: id,
    });

