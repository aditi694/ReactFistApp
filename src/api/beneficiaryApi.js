// api/beneficiaryApi.js

import { apiRequest } from "./apiClient";

/**
 * Add a new beneficiary
 * @param {Object} data - { accountNumber, beneficiaryName, beneficiaryAccount, ifscCode }
 * @returns {Promise<Object>} - { error, message, data }
 */
export const addBeneficiary = (data) =>
    apiRequest("/api/beneficiaries", "POST", data);

/**
 * Get all beneficiaries for logged-in customer
 * @returns {Promise<Object>} - { error, message, data }
 */
export const getBeneficiaries = () =>
    apiRequest("/api/beneficiaries", "GET");

/**
 * Admin: Get pending beneficiaries
 * @returns {Promise<Object>} - { error, message, data }
 */
export const getPendingBeneficiaries = () =>
    apiRequest("/api/admin/beneficiaries?pendingOnly=true", "GET");

/**
 * Admin: Approve a beneficiary
 * @param {string} id - Beneficiary ID
 * @returns {Promise<Object>} - { error, message, data }
 */
export const approveBeneficiary = (id) =>
    apiRequest(`/api/admin/beneficiaries/${id}/approve`, "POST");

/**
 * Admin: Reject a beneficiary
 * @param {string} id - Beneficiary ID
 * @returns {Promise<Object>} - { error, message, data }
 */
export const rejectBeneficiary = (id) =>
    apiRequest(`/api/admin/beneficiaries/${id}/reject`, "POST");