import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

if (!API_BASE_URL) {
    console.warn(
        "NEXT_PUBLIC_DJANGO_API_URL is not configured."
    );
}

/**
 * Safely parse API response.
 */
async function parseResponse(response) {
    const contentType =
        response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    try {
        return await response.text();
    } catch {
        return null;
    }
}

/**
 * Extract useful Django REST Framework error message.
 */
function getErrorMessage(data, fallback) {
    if (!data) {
        return fallback;
    }

    if (typeof data === "string") {
        return data;
    }

    if (data.detail) {
        return String(data.detail);
    }

    if (data.message) {
        return String(data.message);
    }

    if (typeof data === "object") {
        const messages = [];

        Object.entries(data).forEach(
            ([field, value]) => {
                if (Array.isArray(value)) {
                    messages.push(
                        `${field}: ${value.join(", ")}`
                    );
                } else if (
                    typeof value === "object" &&
                    value !== null
                ) {
                    messages.push(
                        `${field}: ${JSON.stringify(value)}`
                    );
                } else {
                    messages.push(
                        `${field}: ${String(value)}`
                    );
                }
            }
        );

        if (messages.length > 0) {
            return messages.join(" | ");
        }
    }

    return fallback;
}

/**
 * Generic inventory request.
 */
async function inventoryRequest(
    url,
    options = {},
    errorPrefix = "Inventory API error"
) {
    try {
        const response = await fetch(url, {
            ...options,
            credentials: "include",
            headers: {
                Accept: "application/json",
                ...(options.body
                    ? {
                        "Content-Type":
                            "application/json",
                    }
                    : {}),
                ...(options.headers || {}),
            },
        });

        const data = await parseResponse(response);

        if (!response.ok) {
            const message = getErrorMessage(
                data,
                `${errorPrefix} (${response.status})`
            );

            const error = new Error(message);

            error.status = response.status;
            error.data = data;

            throw error;
        }

        return data;
    } catch (error) {
        console.error(errorPrefix, error);

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(errorPrefix);
    }
}

/**
 * GET inventory.
 *
 * Optional query parameters:
 *
 * get_inventory({
 *     search: "paracetamol",
 *     item_type: "MEDICINE",
 *     stock: "out_of_stock"
 * })
 */
export async function get_inventory(params = {}) {
    const query = new URLSearchParams();

    if (params.search?.trim()) {
        query.set(
            "search",
            params.search.trim()
        );
    }

    if (
        params.item_type &&
        params.item_type !== "ALL"
    ) {
        query.set(
            "item_type",
            params.item_type
        );
    }

    if (
        params.stock &&
        params.stock !== "ALL"
    ) {
        query.set(
            "stock",
            params.stock
        );
    }

    const queryString =
        query.toString();

    const url =
        `${API_BASE_URL}/inventory/` +
        (queryString
            ? `?${queryString}`
            : "");

    return inventoryRequest(
        url,
        {
            method: "GET",
        },
        "Failed to load inventory"
    );
}

/**
 * POST inventory.
 */
export async function post_inventory(data) {
    return inventoryRequest(
        `${API_BASE_URL}/inventory/`,
        {
            method: "POST",
            body: JSON.stringify(data),
        },
        "Failed to create inventory item"
    );
}

/**
 * PUT inventory.
 */
export async function put_inventory(id, data) {
    if (!id) {
        throw new Error(
            "Inventory item ID is required."
        );
    }

    return inventoryRequest(
        `${API_BASE_URL}/inventory/${id}/`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        },
        "Failed to update inventory item"
    );
}

/**
 * PATCH inventory.
 *
 * Useful if your serializer supports partial updates.
 */
export async function patch_inventory(id, data) {
    if (!id) {
        throw new Error(
            "Inventory item ID is required."
        );
    }

    return inventoryRequest(
        `${API_BASE_URL}/inventory/${id}/`,
        {
            method: "PATCH",
            body: JSON.stringify(data),
        },
        "Failed to partially update inventory item"
    );
}

/**
 * DELETE inventory.
 */
export async function delete_inventory(id) {
    if (!id) {
        throw new Error(
            "Inventory item ID is required."
        );
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/inventory/${id}/`,
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
                await parseResponse(response);

            const message =
                getErrorMessage(
                    data,
                    `Failed to delete inventory item (${response.status})`
                );

            throw new Error(message);
        }

        return true;
    } catch (error) {
        console.error(
            "DELETE inventory error:",
            error
        );

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            "Failed to delete inventory item"
        );
    }
}