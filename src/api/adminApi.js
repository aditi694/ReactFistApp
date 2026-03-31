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

export const getPendingLoans = () =>
    apiRequest("/api/admin/loans/pending");

export const approveLoan = (loanId) =>
    apiRequest(`/api/admin/loans/${loanId}/approve`, "POST");

export const rejectLoan = (loanId) =>
    apiRequest(`/api/admin/loans/${loanId}/reject`, "POST");

export const getPendingCards = () =>
    apiRequest("/api/admin/credit-cards/pending");

export const approveCard = (id) =>
    apiRequest(`/api/admin/credit-cards/approve/${id}`, "POST");

export const rejectCard = (id) =>
    apiRequest(`/api/admin/credit-cards/reject/${id}?reason=Rejected`, "POST");