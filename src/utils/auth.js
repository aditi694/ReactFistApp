export const generateAccountNumber = () => {
    return "ACC" + Date.now() + Math.floor(Math.random() * 1000);
};

export const getAccounts = () => {
    return JSON.parse(localStorage.getItem("accounts")) || [];
};

export const saveAccounts = (accounts) => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
};

export const setLoggedInUser = (user) => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
};

export const getLoggedInUser = () => {
    return JSON.parse(localStorage.getItem("loggedInUser"));
};

export const logoutUser = () => {
    localStorage.removeItem("loggedInUser");
};