import { getAccountNumberFromAPI, getUserFromToken } from "./auth";

export const getAccountNumber = async () => {

    // 1. check cache
    const cached = localStorage.getItem("accountNumber");
    if (cached) return cached;

    // 2. fetch from API
    const user = getUserFromToken();
    const acc = await getAccountNumberFromAPI(user);

    if (acc) {
        localStorage.setItem("accountNumber", acc);
        return acc;
    }

    return null;
};