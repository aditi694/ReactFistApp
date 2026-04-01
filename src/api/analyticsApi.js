// api/analyticsApi.js

import { apiRequest } from "./apiClient";

export const getAnalytics = (accountNumber, month) =>
    apiRequest(`/api/transactions/analytics?accountNumber=${accountNumber}&month=${month}`);