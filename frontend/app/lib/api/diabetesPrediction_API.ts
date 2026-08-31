

// app/lib/api/diabetesPrediction_API.ts

export interface DiabetesDiseaseInput {
    name: string;
    age: number;
    gender: number;
    polyuria: number;
    polydipsia: number;
    sudden_weight_loss: number;
    weakness: number;
    polyphagia: number;
    genital_thrush: number;
    visual_blurring: number;
    itching: number;
    irritability: number;
    delayed_healing: number;
    partial_paresis: number;
    muscle_stiffness: number;
    alopecia: number;
    obesity: number;
}

export interface DiabetesDiseasePrediction {
    prediction: number; // 0 or 1
    probability?: number;
    risk_level?: 'Low' | 'Medium' | 'High';
    message?: string;
}

const API_BASE_URL =
    process.env.NEXT_PUBLIC_FASTAPI_API_URL;

export async function predictDiabetes(
    data: DiabetesDiseaseInput
): Promise<DiabetesDiseasePrediction> {
    try {
        const endpoint = `${API_BASE_URL}/diabetes/predict/`;

        const response = await fetch(endpoint, {
            method: 'POST',
            credentials:"include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            throw new Error(
                errorData.detail ||
                `API error: ${response.status} ${response.statusText}`
            );
        }

        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Diabetes Prediction API error:', error);
        throw error;
    }
}