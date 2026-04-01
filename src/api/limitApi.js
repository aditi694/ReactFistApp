// api/limitApi.js

import { apiRequest } from "./apiClient";

export const getLimits = (accountNumber) =>
    apiRequest(`/api/customer/limits?accountNumber=${accountNumber}`);