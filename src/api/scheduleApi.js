// api/scheduleApi.js

import {apiRequest} from "./apiClient.js";

export const scheduleTransaction = (data) =>
    apiRequest("/api/transactions/scheduled", "POST", data);