import toast from "react-hot-toast";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_DJANGO_API_URL ||
    "http://localhost:8001/api";


/**
 * Get all doctors
 */
async function refreshAccessToken(){
    try {
        const response = await fetch(
            `${API_BASE_URL}/auth/refresh/`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        if (!response.ok) {
            return;
        }

        return true;
    } catch (error) {
        console.error("Token refresh failed:", error);
        return false;
    }
}

export async function get_doctors(page = 1) {
    const url = `${API_BASE_URL}/doctors/?page=${page}`;

    // First request
    let response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    // Request worked
    if (response.ok) {
        return response.json();
    }

    // Only refresh when access token has expired
    if (response.status === 401) {

        console.log("Access token expired. Refreshing...");

        const refreshed = await refreshAccessToken();

        if (!refreshed) {
            toast.error("Session expired. Please login again.");
            throw new Error("AUTH_EXPIRED");
        }

        console.log("Access token refreshed successfully");

        // Retry original request
        response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        });

        if (response.ok) {
            toast.success("Session refreshed");
            return response.json();
        }
    }

    // If retry also failed
    const errorData = await response
        .json()
        .catch(() => ({}));

    console.error(
        "Doctor fetch error:",
        errorData
    );

    toast.error(
        errorData.detail ||
        "Failed to fetch doctors"
    );

    throw new Error(
        errorData.detail ||
        "Failed to fetch doctors"
    );
}


/**
 * Create doctor
 *
 * IMPORTANT:
 * Do NOT:
 * - JSON.stringify(formData)
 * - set Content-Type manually
 *
 * Browser automatically sets:
 * multipart/form-data; boundary=...
 */
export async function post_doctor(formData) {

    console.log(
        "========== POST DOCTOR =========="
    );

    for (const [key, value] of formData.entries()) {
        console.log(
            key,
            value instanceof File
                ? `${value.name} (${value.size} bytes)`
                : value
        );
    }

    console.log(
        "================================="
    );


    const response = await fetch(
        `${API_BASE_URL}/doctors/`,
        {
            method: "POST",

            credentials: "include",

            // DO NOT ADD Content-Type HERE
            headers: {
                Accept: "application/json",
            },

            body: formData,
        }
    );


    const data =
        await response.json().catch(
            () => ({})
        );


    if (!response.ok) {

        console.error(
            "Doctor creation error:",
            data
        );

        throw new Error(
            data.detail ||
            "Failed to create doctor"
        );
    }


    return data;
}


/**
 * Update doctor
 */
export async function put_doctor(
    doctorId,
    formData
) {

    console.log(
        "========== UPDATE DOCTOR =========="
    );

    for (const [key, value] of formData.entries()) {
        console.log(
            key,
            value instanceof File
                ? `${value.name} (${value.size} bytes)`
                : value
        );
    }

    console.log(
        "==================================="
    );


    const response = await fetch(
        `${API_BASE_URL}/doctors/${doctorId}/`,
        {
            method: "PATCH",

            credentials: "include",

            headers: {
                Accept: "application/json",
            },

            // Keep FormData
            body: formData,
        }
    );


    const data =
        await response.json().catch(
            () => ({})
        );


    if (!response.ok) {

        console.error(
            "Doctor update error:",
            data
        );

        throw new Error(
            data.detail ||
            "Failed to update doctor"
        );
    }


    return data;
}


/**
 * Delete doctor
 */
export async function delete_doctor(
    doctorId
) {

    const response = await fetch(
        `${API_BASE_URL}/doctors/${doctorId}/`,
        {
            method: "DELETE",

            credentials: "include",

            headers: {
                Accept: "application/json",
            },
        }
    );


    if (!response.ok) {

        const data =
            await response.json().catch(
                () => ({})
            );

        console.error(
            "Doctor deletion error:",
            data
        );

        throw new Error(
            data.detail ||
            "Failed to delete doctor"
        );
    }


    return true;
}