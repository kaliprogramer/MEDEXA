import toast from "react-hot-toast";
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

    if (!response.ok) {
        toast.error("Not authenticated");
    }

    return response.json();
}