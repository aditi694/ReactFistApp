const BASE_URL = "http://localhost:8080";

export const apiRequest = async (endpoint, method = "GET", body = null) => {
    const token = localStorage.getItem("token");

    console.log(` [${method}] ${endpoint} - Token exists:`, !!token);

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method,
            credentials: "include",
            headers,
            body: body ? JSON.stringify(body) : null,
        });

        console.log(` ${method} ${endpoint} → Status: ${response.status}`);

        if (response.status === 401 || response.status === 403) {
            console.log("401/403 - Unauthorized (handled by route)");
            return {
                error: true,
                message: "Unauthorized",
                status: response.status,
                data: null
            };
        }

        // Try to parse response as JSON
        let data = null;
        try {
            data = await response.json();
        } catch (e) {
            console.warn("⚠️ Response is not JSON");
            data = null;
        }

        // Handle non-2xx responses
        if (!response.ok) {
            const errorMessage =
                data?.resultInfo?.resultMsg ||
                data?.message ||
                data?.resultMsg ||
                `Request failed with status ${response.status}`;

            console.error("❌ API Error:", errorMessage);

            return {
                error: true,
                message: errorMessage,
                status: response.status,
                data: null
            };
        }

        const responseData = data?.data || data;

        console.log("✅ Success:", {
            message: data?.resultInfo?.resultMsg || "Request successful",
            dataType: Array.isArray(responseData) ? "array" : "object"
        });

        return {
            error: false,
            message: data?.resultInfo?.resultMsg || data?.message || "Success",
            data: responseData,
            status: response.status
        };

    } catch (err) {
        console.error("❌ Network error:", err.message);
        return {
            error: true,
            message: "Network error. Please check if backend is running.",
            status: 0,
            data: null
        };
    }
};