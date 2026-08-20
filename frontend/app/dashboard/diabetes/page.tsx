"use client";

import { useState } from "react";
import {
    Users,
    UploadCloud,
    X,
    RotateCcw,
    Stethoscope,
    BarChart3,
    AlertTriangle,
    CircleAlert,
    Activity,
    Download,
    Save,
    History,
    Check,
    Droplets,
} from "lucide-react";
import { predictDiabetes } from "@/app/lib/api/diabetesPrediction_API";

type PredictionState = "idle" | "loading" | "result";

type DiabetesFormData = {
    age: string;
    gender: string;
    polyuria: string;
    polydipsia: string;
    sudden_weight_loss: string;
    weakness: string;
    polyphagia: string;
    genital_thrush: string;
    visual_blurring: string;
    itching: string;
    irritability: string;
    delayed_healing: string;
    partial_paresis: string;
    muscle_stiffness: string;
    alopecia: string;
    obesity: string;
};

type DiabetesPredictionResponse = {
    prediction: number;
    probabilities: Record<string, number>;
};

const INITIAL_FORM_DATA: DiabetesFormData = {
    age: "",
    gender: "",
    polyuria: "",
    polydipsia: "",
    sudden_weight_loss: "",
    weakness: "",
    polyphagia: "",
    genital_thrush: "",
    visual_blurring: "",
    itching: "",
    irritability: "",
    delayed_healing: "",
    partial_paresis: "",
    muscle_stiffness: "",
    alopecia: "",
    obesity: "",
};

const fields = [
    { label: "Age", name: "age", placeholder: "Years", type: "number" },
    { label: "Gender", name: "gender", type: "select", options: ["Male", "Female"] },
    { label: "Polyuria", name: "polyuria", type: "select", options: ["Yes", "No"] },
    { label: "Polydipsia", name: "polydipsia", type: "select", options: ["Yes", "No"] },
    { label: "Sudden Weight Loss", name: "sudden_weight_loss", type: "select", options: ["Yes", "No"] },
    { label: "Weakness", name: "weakness", type: "select", options: ["Yes", "No"] },
    { label: "Polyphagia", name: "polyphagia", type: "select", options: ["Yes", "No"] },
    { label: "Genital Thrush", name: "genital_thrush", type: "select", options: ["Yes", "No"] },
    { label: "Visual Blurring", name: "visual_blurring", type: "select", options: ["Yes", "No"] },
    { label: "Itching", name: "itching", type: "select", options: ["Yes", "No"] },
    { label: "Irritability", name: "irritability", type: "select", options: ["Yes", "No"] },
    { label: "Delayed Healing", name: "delayed_healing", type: "select", options: ["Yes", "No"] },
    { label: "Partial Paresis", name: "partial_paresis", type: "select", options: ["Yes", "No"] },
    { label: "Muscle Stiffness", name: "muscle_stiffness", type: "select", options: ["Yes", "No"] },
    { label: "Alopecia", name: "alopecia", type: "select", options: ["Yes", "No"] },
    { label: "Obesity", name: "obesity", type: "select", options: ["Yes", "No"] },
] as const;

const recentPredictions = [
    { name: "Michael Brown", prediction: "Diabetes Disease", risk: "High (82%)", date: "May 11, 2024" },
    { name: "Sarah Wilson", prediction: "Diabetes Disease", risk: "Low (18%)", date: "May 10, 2024" },
    { name: "Robert Davis", prediction: "Diabetes Disease", risk: "Medium (54%)", date: "May 09, 2024" },
];

export default function DiabetesDiseaseBody() {
    const [image, setImage] = useState<string | null>(null);
    const [formData, setFormData] = useState<DiabetesFormData>(INITIAL_FORM_DATA);
    const [predictionState, setPredictionState] = useState<PredictionState>("idle");
    const [prediction, setPrediction] = useState<DiabetesPredictionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const updateField = (name: keyof DiabetesFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handlePredict = async () => {
        setError(null);

        const age = Number(formData.age);

        if (!Number.isFinite(age) || age <= 0) {
            setError("Please enter a valid age.");
            return;
        }

        const requiredFields = Object.entries(formData);
        const missing = requiredFields.some(([key, value]) => key !== "age" && !value);

        if (missing) {
            setError("Please complete all patient fields before predicting.");
            return;
        }

        setPredictionState("loading");

        const binary = (value: string) => (value === "Yes" ? 1 : 0);

        const payload = {
            age,
            gender: formData.gender === "Male" ? 1 : 0,
            polyuria: binary(formData.polyuria),
            polydipsia: binary(formData.polydipsia),
            sudden_weight_loss: binary(formData.sudden_weight_loss),
            weakness: binary(formData.weakness),
            polyphagia: binary(formData.polyphagia),
            genital_thrush: binary(formData.genital_thrush),
            visual_blurring: binary(formData.visual_blurring),
            itching: binary(formData.itching),
            irritability: binary(formData.irritability),
            delayed_healing: binary(formData.delayed_healing),
            partial_paresis: binary(formData.partial_paresis),
            muscle_stiffness: binary(formData.muscle_stiffness),
            alopecia: binary(formData.alopecia),
            obesity: binary(formData.obesity),
        };

        try {
            console.log("Diabetes prediction payload:", payload);

            const result = (await predictDiabetes(payload)) as DiabetesPredictionResponse;

            console.log("Diabetes prediction response:", result);

            if (
                typeof result?.prediction !== "number" ||
                !result?.probabilities ||
                typeof result.probabilities !== "object"
            ) {
                throw new Error("Invalid prediction response received from the AI API.");
            }

            setPrediction(result);
            setPredictionState("result");
        } catch (requestError) {
            console.error("Diabetes prediction error:", requestError);
            setPredictionState("idle");
            setPrediction(null);
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Something went wrong while predicting."
            );
        }
    };

    const handleReset = () => {
        setImage(null);
        setFormData(INITIAL_FORM_DATA);
        setPrediction(null);
        setPredictionState("idle");
        setError(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="mt-20 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">
                        <Droplets size={25} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                            Diabetes Disease Prediction
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            AI-powered prediction based on patient data
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
                        {fields.map((field) => (
                            <div key={field.name}>
                                <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {field.label}
                                </label>

                                {field.type === "select" ? (
                                    <select
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={(e) =>
                                            updateField(field.name, e.target.value)
                                        }
                                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                                    >
                                        <option value="" disabled>
                                            Select
                                        </option>
                                        {field.options.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        name={field.name}
                                        type={field.type}
                                        value={formData[field.name]}
                                        onChange={(e) =>
                                            updateField(field.name, e.target.value)
                                        }
                                        placeholder={field.placeholder}
                                        min={field.name === "age" ? 1 : undefined}
                                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                                    />
                                )}
                            </div>
                        ))}
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
                                Upload relevant medical images such as X-ray, ECG, Echo reports etc.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <label className="flex min-h-[90px] flex-1 cursor-pointer flex-col justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 transition hover:border-blue-400 hover:bg-blue-50/30 dark:border-slate-600 dark:bg-slate-900/50 dark:hover:border-blue-500 dark:hover:bg-blue-900/20">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <UploadCloud size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            Drag & drop your file here, or click to browse
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                            Supports: JPG, PNG, DICOM (Max 10MB)
                                        </p>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setImage(URL.createObjectURL(file));
                                    }}
                                />
                            </label>

                            {image && (
                                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg border dark:border-slate-700 sm:w-32">
                                    <img src={image} alt="Medical preview" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImage(null)}
                                        className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white transition hover:bg-black"
                                    >
                                        <X size={13} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                            <CircleAlert className="mt-0.5 shrink-0" size={17} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <RotateCcw size={17} />
                            Reset
                        </button>

                        <button
                            type="button"
                            onClick={handlePredict}
                            disabled={predictionState === "loading"}
                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-blue-500"
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
                    <PredictionResult prediction={prediction} />
                )}
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Recent Predictions
                    </h2>
                    <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    >
                        View All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left">
                        <thead className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                        <tr>
                            <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Patient Name</th>
                            <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Prediction</th>
                            <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Risk</th>
                            <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Date</th>
                            <th />
                        </tr>
                        </thead>
                        <tbody>
                        {recentPredictions.map((patient) => (
                            <tr
                                key={patient.name}
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                            >
                                <td className="px-5 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">{patient.name}</td>
                                <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400">{patient.prediction}</td>
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
                                <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">{patient.date}</td>
                                <td className="px-5 py-4 text-right">
                                    <button type="button" className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30">
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
        <StateCard
            subtitle="AI-powered clinical risk analysis"
            icon={<Stethoscope size={36} strokeWidth={1.8} />}
            title="Ready for Prediction"
            description={
                <>
                    Enter the patient information and clinical parameters on the left, then click{" "}
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Predict Now</strong>{" "}
                    to analyze the patient&apos;s diabetes disease risk.
                </>
            }
        />
    );
}

function LoadingState() {
    return (
        <StateCard
            subtitle="Processing clinical data"
            icon={
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400" />
            }
            title="Analyzing Patient Data"
            description="Our AI model is analyzing the provided clinical information and calculating the patient's risk."
            loading
        />
    );
}

function StateCard({
                       subtitle,
                       icon,
                       title,
                       description,
                       loading = false,
                   }: {
    subtitle: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
    loading?: boolean;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <BarChart3 size={19} />
                </div>
                <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">Prediction Result</h2>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
                </div>
            </div>

            <div className="flex min-h-[420px] flex-col items-center justify-center px-4 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {icon}
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>

                <div className="my-7 h-px w-full max-w-md bg-slate-100 dark:bg-slate-700" />

                <div className="w-full max-w-md text-left">
                    <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">What will be analyzed</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <AnalysisItem>Patient demographics</AnalysisItem>
                        <AnalysisItem>Diabetes symptoms</AnalysisItem>
                        <AnalysisItem>Clinical indicators</AnalysisItem>
                        <AnalysisItem>Lifestyle indicators</AnalysisItem>
                    </div>
                </div>

                {loading ? (
                    <div className="mt-7 w-full max-w-sm">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                            <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600 dark:bg-blue-500" />
                        </div>
                        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Processing prediction...</p>
                    </div>
                ) : (
                    <div className="mt-7 flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                        <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                        Waiting for patient data
                    </div>
                )}
            </div>
        </div>
    );
}

function PredictionResult({
                              prediction,
                          }: {
    prediction: DiabetesPredictionResponse;
}) {
    const class0 = Number(prediction.probabilities?.["0"] ?? 0);
    const class1 = Number(prediction.probabilities?.["1"] ?? 0);

    const riskProbability = Math.max(0, Math.min(100, class1 * 100));
    const predictedClass = Number(prediction.prediction);

    const isPositive = predictedClass === 1;
    const riskLabel =
        riskProbability >= 70 ? "High Risk Detected" :
            riskProbability >= 40 ? "Moderate Risk" :
                "Low Risk";

    const riskStyle =
        riskProbability >= 70
            ? "border-red-200 bg-red-50/40 text-red-500 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
            : riskProbability >= 40
                ? "border-yellow-200 bg-yellow-50/40 text-yellow-600 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                : "border-green-200 bg-green-50/40 text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400";

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <BarChart3 size={19} />
                    </div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">Prediction Result</h2>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
          Completed
        </span>
            </div>

            <div className={`rounded-lg border p-4 ${riskStyle}`}>
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/70 dark:bg-black/10">
                        {isPositive ? <AlertTriangle size={25} /> : <Check size={25} />}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold">{riskLabel}</h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Model prediction class: {predictedClass}. Class 1 probability is used as the diabetes risk probability.
                        </p>
                    </div>

                    <div className="text-2xl font-bold">{riskProbability.toFixed(1)}%</div>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Risk Probability</h3>

                <div className="relative">
                    <div className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" />
                    <div
                        className="absolute -top-1.5 h-5 w-1 rounded-full bg-white shadow dark:bg-slate-800"
                        style={{ left: `${riskProbability}%` }}
                    />
                    <div
                        className="absolute -top-8 -translate-x-1/2 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white dark:bg-blue-500"
                        style={{ left: `${riskProbability}%` }}
                    >
                        {riskProbability.toFixed(1)}%
                    </div>
                </div>

                <div className="mt-4 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Model Probabilities</h3>

                <div className="space-y-4">
                    <Indicator
                        icon={<Check size={15} />}
                        name="Healthy Probability"
                        value={`${(class0 * 100).toFixed(2)}%`}
                        type="success"
                    />
                    <Indicator
                        icon={<CircleAlert size={15} />}
                        name="Risky Probability"
                        value={`${(class1 * 100).toFixed(2)}%`}
                        type={class1 >= 0.5 ? "danger" : "warning"}
                    />
                    <Indicator
                        icon={<Activity size={15} />}
                        name="Predicted Class"
                        value={String(predictedClass)}
                        type={isPositive ? "danger" : "success"}
                    />
                </div>
            </div>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex gap-3">
                    <CircleAlert size={17} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                        <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-300">Important Note</h3>
                        <p className="mt-1 text-xs leading-5 text-blue-700/80 dark:text-blue-300/80">
                            This AI prediction is based on the provided data and should not replace clinical judgment.
                            Please correlate the result with patient history and appropriate clinical evaluation.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
                    <Download size={17} />
                    Download Report
                </button>
                <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
                    <Save size={17} />
                    Save to Record
                </button>
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
    type: "danger" | "warning" | "success";
}) {
    const styles = {
        danger: "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400",
        warning: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
        success: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    };

    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
                <div className={`rounded-full p-1.5 ${styles[type]}`}>{icon}</div>
                <span className="truncate text-xs text-slate-600 dark:text-slate-400">{name}</span>
            </div>
            <span className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium ${styles[type]}`}>
        {value}
      </span>
        </div>
    );
}