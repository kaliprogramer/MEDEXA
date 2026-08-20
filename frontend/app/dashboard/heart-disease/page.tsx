"use client";

import { useEffect, useState } from "react";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Brain,
    Check,
    CircleAlert,
    Download,
    HeartPulse,
    History,
    RotateCcw,
    Save,
    Stethoscope,
    UploadCloud,
    Users,
    X,
} from "lucide-react";

import {
    predictHeartFailure,
    type HeartFailureInput,
    type HeartFailurePredictionResponse,
} from "@/app/lib/api/heartPrediction_API";

type PredictionState = "idle" | "loading" | "result";

type FormData = {
    age: number;
    sex: "Male" | "Female";
    anaemia: boolean;
    diabetes: boolean;
    smoking: boolean;
    highBloodPressure: boolean;
    creatininePhosphokinase: number;
    ejectionFraction: number;
    platelets: number;
    serumCreatinine: number;
    serumSodium: number;
};

type IndicatorType = "danger" | "warning" | "success";

const INITIAL_FORM_DATA: FormData = {
    age: 50,
    sex: "Male",
    anaemia: false,
    diabetes: false,
    smoking: false,
    highBloodPressure: false,
    creatininePhosphokinase: 250,
    ejectionFraction: 38,
    platelets: 263358,
    serumCreatinine: 1.1,
    serumSodium: 137,
};

const fields = [
    {
        label: "Age",
        name: "age",
        placeholder: "Years",
        type: "number",
    },
    {
        label: "Sex",
        name: "sex",
        type: "select",
        options: ["Male", "Female"],
    },
    {
        label: "Anaemia",
        name: "anaemia",
        type: "select",
        options: ["YES", "NO"],
    },
    {
        label: "Diabetes",
        name: "diabetes",
        type: "select",
        options: ["YES", "NO"],
    },
    {
        label: "Smoking",
        name: "smoking",
        type: "select",
        options: ["YES", "NO"],
    },
    {
        label: "High Blood Pressure",
        name: "highBloodPressure",
        type: "select",
        options: ["YES", "NO"],
    },
    {
        label: "Creatinine Phosphokinase",
        name: "creatininePhosphokinase",
        placeholder: "Enter CPK level",
        type: "number",
    },
    {
        label: "Ejection Fraction (%)",
        name: "ejectionFraction",
        placeholder: "Percentage",
        type: "number",
    },
    {
        label: "Platelets",
        name: "platelets",
        placeholder: "Enter platelet count",
        type: "number",
    },
    {
        label: "Serum Creatinine",
        name: "serumCreatinine",
        placeholder: "Enter serum creatinine",
        type: "number",
    },
    {
        label: "Serum Sodium",
        name: "serumSodium",
        placeholder: "Enter sodium level",
        type: "number",
    },
] as const;

const recentPredictions = [
    {
        name: "Michael Brown",
        prediction: "Heart Failure",
        risk: "High (82%)",
        date: "May 11, 2024",
    },
    {
        name: "Sarah Wilson",
        prediction: "Heart Failure",
        risk: "Low (18%)",
        date: "May 10, 2024",
    },
    {
        name: "Robert Davis",
        prediction: "Heart Failure",
        risk: "Medium (54%)",
        date: "May 09, 2024",
    },
];

export default function HeartDiseaseBody() {
    const [image, setImage] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [predictionState, setPredictionState] =
        useState<PredictionState>("idle");
    const [prediction, setPrediction] =
        useState<HeartFailurePredictionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(image);
            }
        };
    }, [image]);

    const handleInputChange = (name: string, value: string) => {
        setFormData((previous) => {
            if (name === "sex") {
                return {
                    ...previous,
                    sex: value === "Female" ? "Female" : "Male",
                };
            }

            const booleanFields = [
                "anaemia",
                "diabetes",
                "smoking",
                "highBloodPressure",
            ];

            if (booleanFields.includes(name)) {
                return {
                    ...previous,
                    [name]: value === "YES",
                } as FormData;
            }

            const numericFields = [
                "age",
                "creatininePhosphokinase",
                "ejectionFraction",
                "platelets",
                "serumCreatinine",
                "serumSodium",
            ];

            if (numericFields.includes(name)) {
                return {
                    ...previous,
                    [name]: value === "" ? 0 : Number(value),
                } as FormData;
            }

            return previous;
        });
    };

    const handlePredict = async () => {
        try {
            setError(null);
            setPrediction(null);
            setPredictionState("loading");

            const payload: HeartFailureInput = {
                age: Number(formData.age),
                anaemia: formData.anaemia ? 1 : 0,
                creatinine_phosphokinase: Number(
                    formData.creatininePhosphokinase
                ),
                diabetes: formData.diabetes ? 1 : 0,
                ejection_fraction: Number(formData.ejectionFraction),
                high_blood_pressure: formData.highBloodPressure ? 1 : 0,
                platelets: Number(formData.platelets),
                serum_creatinine: Number(formData.serumCreatinine),
                serum_sodium: Number(formData.serumSodium),
                sex: formData.sex === "Male" ? 1 : 0,
                smoking: formData.smoking ? 1 : 0,
            };

            console.log("Heart failure prediction payload:", payload);

            const result = await predictHeartFailure(payload);

            console.log("Heart failure prediction response:", result);

            setPrediction(result);
            setPredictionState("result");
        } catch (requestError) {
            console.error("Heart failure prediction error:", requestError);

            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Something went wrong while predicting."
            );

            setPredictionState("idle");
        }
    };

    const handleReset = () => {
        if (image) {
            URL.revokeObjectURL(image);
        }

        setImage(null);
        setFormData({ ...INITIAL_FORM_DATA });
        setPrediction(null);
        setError(null);
        setPredictionState("idle");
    };

    const handleImageChange = (file: File | undefined) => {
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            setError("The medical image must be smaller than 10 MB.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a JPG, PNG, or other supported image file.");
            return;
        }

        setError(null);

        if (image) {
            URL.revokeObjectURL(image);
        }

        setImage(URL.createObjectURL(file));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="lg:mt-20 mt-5 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">
                        <HeartPulse size={25} />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                            Heart Failure Prediction
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            AI-powered prediction based on patient clinical data
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                    <History size={18} />
                    View History
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                    <div className="mb-6 flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Users size={19} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900 dark:text-white">
                                Patient Information
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Enter patient details to predict the risk
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {fields.map((field) => {
                            const rawValue =
                                formData[field.name as keyof FormData];

                            const value =
                                field.name === "anaemia" ||
                                field.name === "diabetes" ||
                                field.name === "smoking" ||
                                field.name === "highBloodPressure"
                                    ? rawValue
                                        ? "YES"
                                        : "NO"
                                    : rawValue;

                            return (
                                <div key={field.name}>
                                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                                        {field.label}
                                    </label>

                                    {field.type === "select" ? (
                                        <select
                                            name={field.name}
                                            value={String(value)}
                                            onChange={(event) =>
                                                handleInputChange(
                                                    field.name,
                                                    event.target.value
                                                )
                                            }
                                            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                                        >
                                            {field.options.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            name={field.name}
                                            type="number"
                                            min={field.name === "age" ? 0 : undefined}
                                            value={String(value)}
                                            placeholder={field.placeholder}
                                            onChange={(event) =>
                                                handleInputChange(
                                                    field.name,
                                                    event.target.value
                                                )
                                            }
                                            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6">
                        <div className="mb-2">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Upload Medical Image
                                <span className="ml-1 font-normal text-slate-400 dark:text-slate-500">
                                    (Optional)
                                </span>
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Upload a relevant medical image for future multimodal analysis.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <label className="flex min-h-[90px] flex-1 cursor-pointer flex-col justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 transition hover:border-blue-400 hover:bg-blue-50/30 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-blue-500 dark:hover:bg-blue-900/20">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <UploadCloud size={20} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            Click to upload a medical image
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                            JPG, PNG (Max 10MB)
                                        </p>
                                    </div>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(event) =>
                                        handleImageChange(event.target.files?.[0])
                                    }
                                />
                            </label>

                            {image && (
                                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg border dark:border-slate-700 sm:w-32">
                                    <img
                                        src={image}
                                        alt="Medical preview"
                                        className="h-full w-full object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            URL.revokeObjectURL(image);
                                            setImage(null);
                                        }}
                                        className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white transition hover:bg-black"
                                    >
                                        <X size={13} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20">
                            <div className="flex items-start gap-3">
                                <CircleAlert
                                    size={18}
                                    className="mt-0.5 shrink-0 text-red-500"
                                />
                                <div>
                                    <h3 className="text-xs font-semibold text-red-600 dark:text-red-400">
                                        Prediction Failed
                                    </h3>
                                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={predictionState === "loading"}
                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <RotateCcw size={17} />
                            Reset
                        </button>

                        <button
                            type="button"
                            onClick={handlePredict}
                            disabled={predictionState === "loading"}
                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            {predictionState === "loading" ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Stethoscope size={18} />
                                    Predict Now
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {predictionState === "idle" && <ReadyState />}
                {predictionState === "loading" && <LoadingState />}
                {predictionState === "result" && prediction && (
                    <PredictionResult
                        prediction={prediction}
                        formData={formData}
                    />
                )}
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Recent Predictions
                    </h2>
                    <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-slate-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                        View All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left">
                        <thead className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                Patient Name
                            </th>
                            <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                Prediction
                            </th>
                            <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                Risk
                            </th>
                            <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                Date
                            </th>
                            <th />
                        </tr>
                        </thead>

                        <tbody>
                        {recentPredictions.map((patient) => (
                            <tr
                                key={patient.name}
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                            >
                                <td className="px-5 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {patient.name}
                                </td>
                                <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400">
                                    {patient.prediction}
                                </td>
                                <td className="px-5 py-4">
                                        <span
                                            className={
                                                patient.risk.startsWith("High")
                                                    ? "text-red-500 dark:text-red-400"
                                                    : patient.risk.startsWith("Medium")
                                                        ? "text-yellow-600 dark:text-yellow-400"
                                                        : "text-green-600 dark:text-green-400"
                                            }
                                        >
                                            {patient.risk}
                                        </span>
                                </td>
                                <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                                    {patient.date}
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <button
                                        type="button"
                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function ReadyState() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <ResultHeader subtitle="AI-powered clinical risk analysis" />

            <div className="flex min-h-[420px] flex-col items-center justify-center px-4 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Stethoscope size={36} strokeWidth={1.8} />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Ready for Prediction
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Enter the patient information on the left, then click
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">
                        {" Predict Now"}
                    </strong>{" "}
                    to analyze the patient&apos;s heart failure risk.
                </p>

                <div className="my-7 h-px w-full max-w-md bg-slate-100 dark:bg-slate-700" />

                <div className="w-full max-w-md text-left">
                    <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                        What will be analyzed
                    </h4>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <AnalysisItem>Patient demographics</AnalysisItem>
                        <AnalysisItem>Blood pressure indicators</AnalysisItem>
                        <AnalysisItem>Kidney function markers</AnalysisItem>
                        <AnalysisItem>Cardiac function indicators</AnalysisItem>
                    </div>
                </div>

                <div className="mt-7 flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-500" />
                    Waiting for patient data
                </div>
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <ResultHeader subtitle="Processing clinical data" />

            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Analyzing Patient Data
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    The AI model is analyzing the provided clinical information
                    and calculating the patient&apos;s risk.
                </p>

                <div className="mt-7 w-full max-w-sm">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                        <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600 dark:bg-blue-500" />
                    </div>
                    <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                        Waiting for FastAPI response...
                    </p>
                </div>
            </div>
        </div>
    );
}

function PredictionResult({
                              prediction,
                              formData,
                          }: {
    prediction: HeartFailurePredictionResponse;
    formData: FormData;
}) {
    const predictionClass = prediction.prediction;

    // IMPORTANT:
    // Class 1 probability is treated as the heart-failure risk probability.
    const riskProbability = clamp(
        prediction.probabilities["1"] * 100
    );

    const noEventProbability = clamp(
        prediction.probabilities["0"] * 100
    );

    const isHighRisk = predictionClass === 1;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
                <ResultHeader subtitle="AI-powered clinical risk analysis" />

                <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    Completed
                </span>
            </div>

            <div
                className={`rounded-lg border p-4 ${
                    isHighRisk
                        ? "border-red-200 bg-red-50/40 dark:border-red-800/50 dark:bg-red-900/20"
                        : "border-green-200 bg-green-50/40 dark:border-green-800/50 dark:bg-green-900/20"
                }`}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            isHighRisk
                                ? "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                    >
                        {isHighRisk ? (
                            <AlertTriangle size={25} />
                        ) : (
                            <Check size={25} />
                        )}
                    </div>

                    <div className="flex-1">
                        <h3
                            className={`font-semibold ${
                                isHighRisk
                                    ? "text-red-500 dark:text-red-400"
                                    : "text-green-600 dark:text-green-400"
                            }`}
                        >
                            {isHighRisk
                                ? "Higher Risk Detected"
                                : "Lower Risk Detected"}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Model prediction: Class {predictionClass}
                        </p>
                    </div>

                    <div
                        className={`text-2xl font-bold ${
                            isHighRisk
                                ? "text-red-500 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                        }`}
                    >
                        {riskProbability.toFixed(2)}%
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Risk Probability
                    </h3>

                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {riskProbability.toFixed(2)}%
                    </span>
                </div>

                <div className="relative">
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                            className={`h-2 rounded-full transition-all duration-700 ${
                                isHighRisk
                                    ? "bg-red-500"
                                    : "bg-green-500"
                            }`}
                            style={{
                                width: `${riskProbability}%`,
                            }}
                        />
                    </div>
                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Healthy Percentage
                        </p>
                        <p className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">
                            {noEventProbability.toFixed(2)}%
                        </p>
                    </div>

                    <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Risky Percentage
                        </p>
                        <p className="mt-1 text-lg font-semibold text-red-500 dark:text-red-400">
                            {riskProbability.toFixed(2)}%
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Patient Parameters
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Indicator
                        icon={<Users size={15} />}
                        name="Age"
                        value={`${formData.age} years`}
                        type="success"
                    />

                    <Indicator
                        icon={<HeartPulse size={15} />}
                        name="Ejection Fraction"
                        value={`${formData.ejectionFraction}%`}
                        type={
                            formData.ejectionFraction < 40
                                ? "danger"
                                : "success"
                        }
                    />

                    <Indicator
                        icon={<Activity size={15} />}
                        name="Serum Creatinine"
                        value={String(formData.serumCreatinine)}
                        type={
                            formData.serumCreatinine > 1.5
                                ? "danger"
                                : "success"
                        }
                    />

                    <Indicator
                        icon={<Activity size={15} />}
                        name="Serum Sodium"
                        value={`${formData.serumSodium} mmol/L`}
                        type="success"
                    />

                    <Indicator
                        icon={<Brain size={15} />}
                        name="Diabetes"
                        value={formData.diabetes ? "Yes" : "No"}
                        type={
                            formData.diabetes ? "warning" : "success"
                        }
                    />

                    <Indicator
                        icon={<Activity size={15} />}
                        name="High Blood Pressure"
                        value={
                            formData.highBloodPressure ? "Yes" : "No"
                        }
                        type={
                            formData.highBloodPressure
                                ? "warning"
                                : "success"
                        }
                    />
                </div>
            </div>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/50 dark:bg-blue-900/20">
                <div className="flex gap-3">
                    <CircleAlert
                        size={17}
                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                    />

                    <div>
                        <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                            Important Note
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-400">
                            This AI prediction is an assistive result based on
                            the provided patient data. It should not replace
                            professional clinical judgment.
                        </p>
                    </div>
                </div>
            </div>

            <details className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                    View API Response
                </summary>

                <pre className="max-h-64 overflow-auto border-t border-slate-200 p-4 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">
                    {JSON.stringify(prediction, null, 2)}
                </pre>
            </details>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                    <Download size={17} />
                    Print / Save Report
                </button>

                <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                    <Save size={17} />
                    Save to Record
                </button>
            </div>
        </div>
    );
}

function ResultHeader({ subtitle }: { subtitle: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <BarChart3 size={19} />
            </div>

            <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                    Prediction Result
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

function AnalysisItem({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <Check size={12} />
            </div>
            {children}
        </div>
    );
}

function Indicator({
                       icon,
                       name,
                       value,
                       type,
                   }: {
    icon: React.ReactNode;
    name: string;
    value: string;
    type: IndicatorType;
}) {
    const styles: Record<IndicatorType, string> = {
        danger:
            "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400",
        warning:
            "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
        success:
            "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    };

    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
                <div className={`rounded-full p-1.5 ${styles[type]}`}>
                    {icon}
                </div>

                <span className="truncate text-xs text-slate-600 dark:text-slate-400">
                    {name}
                </span>
            </div>

            <span
                className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium ${styles[type]}`}
            >
                {value}
            </span>
        </div>
    );
}

function clamp(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(100, Math.max(0, value));
}