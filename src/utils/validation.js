export const validateName = (name) => {
    return !/^[A-Za-z ]{2,50}$/.test(name);
};

// Account: AC + digits (your backend format)
export const validateAccount = (account) => {
    return !/^AC\d{10,}$/.test(account);
};

// FLEXIBLE IFSC (MATCH YOUR BACKEND)
export const validateIFSC = (ifsc) => {
    return !/^[A-Z]{4}0[A-Z0-9]{5,6}$/.test(ifsc);
};