// app/lib/api/strokePrediction_API.ts

// =====================================================
// INPUT
// =====================================================

export interface StrokeInput {
    gender: number;
    age: number;
    hypertension: number;
    heart_disease: number;
    ever_married: number;
    work_type: number;
    Residence_type: number;
    avg_glucose_level: number;
    bmi: number;
    smoking_status: number;
}


// =====================================================
// RESPONSE
// =====================================================

export interface StrokePrediction {
    prediction: number;
    probabilities: {
        "0": number;
        "1": number;
    };
}


// =====================================================
// API URL
// =====================================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


// =====================================================
// ERROR FORMATTER
// =====================================================

function formatApiError(errorData: any): string {

    // FastAPI validation error
    if (Array.isArray(errorData?.detail)) {

        return errorData.detail
            .map((error: any) => {

                if (typeof error === "string") {
                    return error;
                }

                if (error?.msg) {
                    const location = Array.isArray(error.loc)
                        ? error.loc.join(" → ")
                        : "";

                    return location
                        ? `${location}: ${error.msg}`
                        : error.msg;
                }

                return JSON.stringify(error);

            })
            .join("\n");
    }


    // Normal FastAPI error
    if (typeof errorData?.detail === "string") {
        return errorData.detail;
    }


    // Other API error
    if (typeof errorData?.message === "string") {
        return errorData.message;
    }


    return "Stroke prediction request failed.";
}


// =====================================================
// PREDICT STROKE
// =====================================================

export async function predictStroke(
    data: StrokeInput
): Promise<StrokePrediction> {

    try {

        const endpoint =
            `${API_BASE_URL}/stroke/predict`;


        const response = await fetch(endpoint, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(data),
        });


        // =============================================
        // READ RESPONSE
        // =============================================

        const result = await response.json().catch(() => null);


        // =============================================
        // ERROR
        // =============================================

        if (!response.ok) {

            console.error(
                "Stroke API error response:",
                result
            );

            throw new Error(
                formatApiError(result)
            );
        }


        // =============================================
        // SUCCESS
        // =============================================

        return result as StrokePrediction;

    } catch (error) {

        console.error(
            "Stroke prediction error:",
            error
        );

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            "Unable to connect to stroke prediction API."
        );
    }
}