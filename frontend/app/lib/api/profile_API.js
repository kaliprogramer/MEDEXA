const API_BASE_URL =
    process.env.NEXT_PUBLIC_DJANGO_API_URL ||
    "http://localhost:8001/api";

export async function getMe() {
    const response = await fetch(
        `${API_BASE_URL}/auth/me/`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    // Access token expired
    if (response.status === 401) {
        try {
            const refreshResponse = await fetch(
                `${API_BASE_URL}/auth/refresh/`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            // Refresh token is also expired
            if (!refreshResponse.ok) {
                return null;
            }

            // Try getting the user again
            const retryResponse = await fetch(
                `${API_BASE_URL}/auth/me/`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!retryResponse.ok) {
                return null;
            }

            return retryResponse.json();

        } catch (error) {
            console.error("Authentication refresh failed:", error);
            return null;
        }
    }

    if (!response.ok) {
        return null;
    }

    return response.json();
}