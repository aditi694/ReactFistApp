import { apiRequest } from "./apiClient";

// ================= CUSTOMER =================
export const getAllCustomers = () =>
    apiRequest("/api/admin/customers");

export const getCustomerById = (id) =>
    apiRequest(`/api/admin/customer/${id}`);

export const updateCustomer = (id, data) =>
    apiRequest(`/api/admin/${id}`, "PUT", data);

export const deleteCustomer = (id) =>
    apiRequest(`/api/admin/${id}`, "DELETE");

export const updateKyc = (id, status, remarks) =>
    apiRequest(`/api/admin/customers/${id}/kyc`, "PUT", { status, remarks });

export const blockCustomer = (id, reason) =>
    apiRequest(`/api/admin/${id}/block?reason=${reason}`, "PUT");

export const unblockCustomer = (id) =>
    apiRequest(`/api/admin/${id}/unblock`, "PUT");

// ================= LOANS =================
export const getPendingLoans = () =>
    apiRequest("/api/admin/loans/pending");

export const approveLoan = (loanId) =>
    apiRequest(`/api/admin/loans/${loanId}/approve`, "POST");

export const rejectLoan = (loanId) =>
    apiRequest(`/api/admin/loans/${loanId}/reject`, "POST");

// ================= CREDIT CARDS =================
export const getPendingCards = () =>
    apiRequest("/api/admin/credit-cards/pending");

export const approveCard = (id) =>
    apiRequest(`/api/admin/credit-cards/approve/${id}`, "POST");

export const rejectCard = (id, reason) =>
    apiRequest(`/api/admin/credit-cards/reject/${id}?reason=${reason}`, "POST");

// ================= DEBIT CARDS =================
export const blockDebitCard = (accountId) =>
    apiRequest(`/api/admin/cards/debit/${accountId}/block`, "POST");

export const unblockDebitCard = (accountId) =>
    apiRequest(`/api/admin/cards/debit/${accountId}/unblock`, "POST");

// ================= BENEFICIARY =================
export const getPendingBeneficiaries = () =>
    apiRequest("/api/admin/beneficiaries?pendingOnly=true");

export const approveBeneficiary = (id) =>
    apiRequest(`/api/admin/beneficiaries/${id}/approve`, "POST");

export const rejectBeneficiary = (id) =>
    apiRequest(`/api/admin/beneficiaries/${id}/reject`, "POST");
export const adminLogin = (username, password) =>
    apiRequest("/api/auth/login", "POST", { username, password });

