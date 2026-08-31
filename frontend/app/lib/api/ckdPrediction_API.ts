const API_URL = process.env.NEXT_PUBLIC_FASTAPI_API_URL;

export async function predictCKD(
    data: Record<string, number>
) {
    const response = await fetch(
        `${API_URL}/chronic-kidney/predict/`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        const errorText =
            await response.text();

        throw new Error(
            errorText ||
            "CKD prediction failed"
        );
    }

    return response.json();
}