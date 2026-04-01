/**
 * Decode JWT token and extract user information
 */
export const getUserFromToken = () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("❌ No token found");
            return null;
        }

        const parts = token.split(".");
        if (parts.length !== 3) {
            console.error("❌ Invalid token format");
            return null;
        }

        const payload = JSON.parse(atob(parts[1]));

        // ✅ ROBUST ADMIN DETECTION
        const isAdmin =
            payload.roles?.includes("ADMIN") ||
            payload.role === "ADMIN" ||
            payload.authorities?.includes("ADMIN") ||
            payload.isAdmin === true;

        console.log("✅ FULL TOKEN PAYLOAD:", payload);
        console.log("👤 isAdmin:", isAdmin);

        return {
            customerId: payload.customerId || payload.sub || payload.userId,
            email: payload.email,
            fullName: payload.fullName || payload.name,
            accountNumber: payload.accountNumber || null,
            isAdmin,
            raw: payload
        };
    } catch (error) {
        console.error("❌ Error decoding token:", error);
        return null;
    }
};

/**
 * Check if user is logged in
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

/**
 * Get user role (FIXED)
 */
export const getUserRole = () => {
    const user = getUserFromToken();

    if (!user) return null;

    return user.isAdmin ? "ADMIN" : "CUSTOMER";
};

/**
 * Logout user
 */
export const logoutUser = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    console.log("✅ Logged out");
};

/**
 * Save token
 */
export const setToken = (token) => {
    if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Token saved");
    }
};

/**
 * Get token
 */
export const getToken = () => {
    return localStorage.getItem("token");
};
/**
 * Fetch account number from dashboard API (REQUIRED)
 */
export const getAccountNumberFromAPI = async (user) => {
    if (!user) return null;

    if (user.accountNumber) {
        console.log("✅ Account from token:", user.accountNumber);
        return user.accountNumber;
    }

    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/account/dashboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.warn("⚠️ Failed to fetch account:", response.status);
            return null;
        }

        const data = await response.json();
        const accountNumber = data?.data?.accountNumber;

        console.log("✅ Account from API:", accountNumber);

        return accountNumber || null;

    } catch (error) {
        console.error("❌ Error fetching account:", error);
        return null;
    }
};