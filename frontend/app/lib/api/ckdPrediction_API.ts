const API_URL = "http://127.0.0.1:8000";

export async function predictCKD(
    data: Record<string, number>
) {
    const response = await fetch(
        `${API_URL}/chronic-kidney/predict/`,
        {
            method: "POST",

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