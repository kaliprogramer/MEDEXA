const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

export async function post_report(data) {
    const response = await fetch(`${API_URL}/report/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    console.log("Django response:", result);

    if (!response.ok) {
        throw new Error(JSON.stringify(result));
    }

    return result;
}