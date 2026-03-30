import { apiRequest } from "./apiClient";

export const getAllCustomers = () =>
    apiRequest("/api/admin/customers");

export const updateKyc = (id, status, remarks) =>
    apiRequest(`/api/admin/customers/${id}/kyc`, "PUT", {
        status,
        remarks
    });

export const blockCustomer = (id, reason) =>
    apiRequest(`/api/admin/${id}/block?reason=${reason}`, "PUT");

export const unblockCustomer = (id) =>
    apiRequest(`/api/admin/${id}/unblock`, "PUT");