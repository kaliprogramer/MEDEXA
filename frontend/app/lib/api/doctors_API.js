const API_BASE_URL =
    process.env.NEXT_PUBLIC_DJANGO_API_URL ||
    "http://localhost:8001/api";


/**
 * Get all doctors
 */
export async function get_doctors(page = 1) {
    const response = await fetch(
        `${API_BASE_URL}/doctors/?page=${page}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        console.error(
            "Doctor fetch error:",
            errorData
        );

        throw new Error(
            errorData.detail ||
            "Failed to fetch doctors"
        );
    }

    return response.json();
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