const BASE_URL = "http://localhost:8080";

export const apiRequest = async (endpoint, method = "GET", body = null) => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(BASE_URL + endpoint, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return { error: true, message: "Session expired. Please login again." };
        }

        let data = null;

        try {
            data = await response.json();
        } catch {
            data = null;
        }

        if (!response.ok) {
            return {
                error: true,
                message:
                    data?.resultInfo?.resultMsg ||
                    data?.message ||
                    data?.error ||
                    `Server error (${response.status})`
            };
        }

        return data;

    } catch (err) {
        return {
            error: true,
            message: "Network error. Please check your connection."
        };
    }
};