import { getAccountNumberFromAPI, getUserFromToken } from "./auth";

export const getAccountNumber = async () => {

    const user = getUserFromToken();

    // FIRST: try token
    if (user?.accountNumber) {
        return user.accountNumber;
    }

    // SECOND: fallback API
    const acc = await getAccountNumberFromAPI(user);

    return acc || null;
};