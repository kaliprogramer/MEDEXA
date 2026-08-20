// app/lib/api/heartPrediction_API.ts

export interface HeartFailureInput {
    age: number;
    anaemia: number;
    creatinine_phosphokinase: number;
    diabetes: number;
    ejection_fraction: number;
    high_blood_pressure: number;
    platelets: number;
    serum_creatinine: number;
    serum_sodium: number;
    sex: number;
    smoking: number;
}

export interface HeartFailurePrediction {
    prediction: number; // 0 or 1 (0 = No heart failure, 1 = Heart failure)
    probability: number; // Probability between 0 and 1
    risk_level: 'Low' | 'Medium' | 'High';
    message?: string;
}

// IMPORTANT: Update this to match your actual API endpoint
// If your FastAPI backend is running on port 8000 with a different endpoint path
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function predictHeartFailure(data: HeartFailureInput): Promise<HeartFailurePrediction> {
    try {
        // Try common FastAPI endpoints
        const endpoints = [
            `${API_BASE_URL}/heartdisease/predict`,
        ];

        let lastError: Error | null = null;

        // Try each endpoint
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const result = await response.json();
                    return result;
                }

                if (response.status !== 404) {
                    // If it's not a 404, it might be another error
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || `API error: ${response.status}`);
                }
            } catch (err) {
                lastError = err as Error;
                // Continue to try next endpoint
                continue;
            }
        }

        // If all endpoints failed
        throw new Error(`No valid endpoint found. Please check your API URL and endpoints. Last error: ${lastError?.message}`);
    } catch (error) {
        console.error('Prediction API error:', error);
        throw error;
    }
}