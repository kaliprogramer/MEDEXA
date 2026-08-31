"use client";

import { useState } from "react";

import {
    Users,
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
    Brain,
    HeartPulse,
    Droplets,
} from "lucide-react";

import {
    predictStroke,
    type StrokePredictionResponse,
} from "@/app/lib/api/strokePrediction_API";


// =====================================================
// TYPES
// =====================================================

type PredictionState =
    | "idle"
    | "loading"
    | "result";

type RecentPrediction = {
    name: string;
    prediction: string;
    risk: string;
    date: string;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function StrokePrediction() {

    // =================================================
    // FORM STATE
    // =================================================
    const genderMap: Record<string, number> = {
        Male: 1,
        Female: 0,
        Other: 2,
    };

    const everMarriedMap: Record<string, number> = {
        Yes: 1,
        No: 0,
    };

    const workTypeMap: Record<string, number> = {
        Private: 1,
        employed: 0,
        Govt_job: 2,
        children: 3,
        Never_worked: 4,
        "Self-employed": 5,
    };

    const residenceTypeMap: Record<string, number> = {
        Urban: 1,
        Rural: 0,
    };

    const smokingStatusMap: Record<string, number> = {
        "formerly smoked": 1,
        "never smoked": 0,
        smokes: 2,
        Unknown: 3,
    };

    const [formData, setFormData] = useState({
        name: "",  // Changed from patientName to name
        gender: "",
        age: "",
        hypertension: "",
        heart_disease: "",
        ever_married: "",
        work_type: "",
        Residence_type: "",
        avg_glucose_level: "",
        bmi: "",
        smoking_status: "",
    });

    // =================================================
    // PREDICTION STATE
    // =================================================

    const [predictionState, setPredictionState] =
        useState<PredictionState>("idle");

    // =================================================
    // RESULT
    // =================================================

    const [predictionResult, setPredictionResult] =
        useState<StrokePredictionResponse | null>(null);

    // =================================================
    // ERROR
    // =================================================

    const [error, setError] =
        useState<string | null>(null);

    // =================================================
    // RECENT PREDICTIONS STATE
    // =================================================

    const [recentPredictions, setRecentPredictions] = useState<RecentPrediction[]>([
        {
            name: "Michael Brown",
            prediction: "Stroke",
            risk: "High (82%)",
            date: "May 11, 2024",
        },
        {
            name: "Sarah Wilson",
            prediction: "No Stroke",
            risk: "Low (18%)",
            date: "May 10, 2024",
        },
        {
            name: "Robert Davis",
            prediction: "Stroke",
            risk: "Medium (54%)",
            date: "May 09, 2024",
        },
    ]);

    // =================================================
    // INPUT HANDLER
    // =================================================

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =================================================
    // PREDICT
    // =================================================

    const handlePredict = async () => {
        setError(null);
        setPredictionResult(null);

        // =============================================
        // BASIC VALIDATION
        // =============================================

        if (
            !formData.name ||  // Changed from patientName to name
            !formData.gender ||
            !formData.age ||
            !formData.hypertension ||
            !formData.heart_disease ||
            !formData.ever_married ||
            !formData.work_type ||
            !formData.Residence_type ||
            !formData.avg_glucose_level ||
            !formData.bmi ||
            !formData.smoking_status
        ) {
            setError(
                "Please complete all required patient information."
            );
            return;
        }

        // =============================================
        // LOADING
        // =============================================

        setPredictionState("loading");

        try {
            // =========================================
            // CONVERT FORM DATA
            // =========================================

            const payload = {
                name: formData.name,  // Changed from patientName to name
                age: Number(formData.age),
                gender: genderMap[formData.gender],
                hypertension: Number(formData.hypertension),
                heart_disease: Number(formData.heart_disease),
                ever_married: everMarriedMap[formData.ever_married],
                work_type: workTypeMap[formData.work_type],
                Residence_type: residenceTypeMap[formData.Residence_type],
                avg_glucose_level: Number(formData.avg_glucose_level),
                bmi: Number(formData.bmi),
                smoking_status: smokingStatusMap[formData.smoking_status],
            };

            console.log(
                "Stroke prediction payload:",
                payload
            );

            // =========================================
            // CALL FASTAPI
            // =========================================

            const result =
                await predictStroke(payload);

            console.log(
                "Stroke prediction result:",
                result
            );

            // =========================================
            // SAVE RESULT
            // =========================================

            setPredictionResult(result);
            setPredictionState("result");

            // =========================================
            // ADD TO RECENT PREDICTIONS
            // =========================================

            const riskLevel = getRiskLevel(result);
            const probability = getProbability(result);

            const newPrediction: RecentPrediction = {
                name: formData.name,  // Changed from patientName to name
                prediction: result.prediction === 1 ? "Stroke" : "No Stroke",
                risk: `${riskLevel} (${probability.toFixed(1)}%)`,
                date: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
            };

            setRecentPredictions(prev => [newPrediction, ...prev]);

        } catch (err) {
            console.error(
                "Stroke prediction error:",
                err
            );
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to connect to prediction API."
            );
            setPredictionState("idle");
        }
    };

    // =================================================
    // HELPER FUNCTIONS
    // =================================================

    const getProbability = (result: StrokePredictionResponse): number => {
        const strokeProbabilityRaw = result?.probabilities?.["1"] ?? 0;
        const strokeProbability = Number.isFinite(Number(strokeProbabilityRaw))
            ? Number(strokeProbabilityRaw) * 100
            : 0;
        return Math.min(Math.max(strokeProbability, 0), 100);
    };

    const getRiskLevel = (result: StrokePredictionResponse): string => {
        const probability = getProbability(result);
        return probability >= 50 ? "High" : probability >= 20 ? "Medium" : "Low";
    };

    // =================================================
    // RESET
    // =================================================

    const handleReset = () => {
        setFormData({
            name: "",  // Changed from patientName to name
            gender: "",
            age: "",
            hypertension: "",
            heart_disease: "",
            ever_married: "",
            work_type: "",
            Residence_type: "",
            avg_glucose_level: "",
            bmi: "",
            smoking_status: "",
        });
        setPredictionResult(null);
        setPredictionState("idle");
        setError(null);
    };

    // =================================================
    // RENDER
    // =================================================

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* ================================================= */}
            {/* PAGE HEADER */}
            {/* ================================================= */}

            <div className="mb-6 mt-20 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">
                        <Brain size={25} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                            Stroke Prediction
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            AI-powered stroke risk prediction based on patient data
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

            {/* ================================================= */}
            {/* MAIN GRID */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* ================================================= */}
                {/* PATIENT INFORMATION */}
                {/* ================================================= */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                    {/* CARD HEADER */}
                    <div className="mb-6 flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Users size={19} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-900 dark:text-white">
                                Patient Information
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Enter patient information for stroke risk analysis
                            </p>
                        </div>
                    </div>

                    {/* ================================================= */}
                    {/* FORM */}
                    {/* ================================================= */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* PATIENT NAME */}
                        <InputField
                            label="Patient Name"
                            name="name"  // Changed from patientName to name
                            value={formData.name}  // Changed from patientName to name
                            placeholder="Enter full name"
                            type="text"
                            onChange={handleChange}
                            required
                        />

                        {/* GENDER */}
                        <SelectField
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            options={[
                                { label: "Male", value: "Male" },
                                { label: "Female", value: "Female" },
                                { label: "Other", value: "Other" },
                            ]}
                            onChange={handleChange}
                            required
                        />

                        {/* AGE */}
                        <InputField
                            label="Age"
                            name="age"
                            value={formData.age}
                            placeholder="Enter age"
                            type="number"
                            onChange={handleChange}
                            required
                        />

                        {/* HYPERTENSION */}
                        <SelectField
                            label="Hypertension"
                            name="hypertension"
                            value={formData.hypertension}
                            options={[
                                { label: "Yes", value: "1" },
                                { label: "No", value: "0" },
                            ]}
                            onChange={handleChange}
                            required
                        />

                        {/* HEART DISEASE */}
                        <SelectField
                            label="Heart Disease"
                            name="heart_disease"
                            value={formData.heart_disease}
                            options={[
                                { label: "Yes", value: "1" },
                                { label: "No", value: "0" },
                            ]}
                            onChange={handleChange}
                            required
                        />

                        {/* EVER MARRIED */}
                        <SelectField
                            label="Ever Married"
                            name="ever_married"
                            value={formData.ever_married}
                            options={[
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" },
                            ]}
                            onChange={handleChange}
                            required
                        />

                        {/* WORK TYPE */}
                        <SelectField
                            label="Work Type"
                            name="work_type"
                            value={formData.work_type}
                            options={[
                                { label: "Private", value: "Private" },
                                { label: "Self-employed", value: "Self-employed" },
                                { label: "Government Job", value: "Govt_job" },
                                { label: "Children", value: "children" },
                                { label: "Never Worked", value: "Never_worked" },
                            ]}
                            onChange={handleChange}
                            required
                        />

                        {/* RESIDENCE */}
                        <SelectField
                            label="Residence Type"
                            name="Residence_type"
                            value={formData.Residence_type}
                            options={[
                                { label: "Urban", value: "Urban" },
                                { label: "Rural", value: "Rural" },
                            ]}
                            onChange={handleChange}
                            required
                        />

                        {/* GLUCOSE */}
                        <InputField
                            label="Average Glucose Level"
                            name="avg_glucose_level"
                            value={formData.avg_glucose_level}
                            placeholder="e.g. 95.5"
                            type="number"
                            step="0.1"
                            onChange={handleChange}
                            required
                        />

                        {/* BMI */}
                        <InputField
                            label="BMI"
                            name="bmi"
                            value={formData.bmi}
                            placeholder="e.g. 27.5"
                            type="number"
                            step="0.1"
                            onChange={handleChange}
                            required
                        />

                        {/* SMOKING */}
                        <SelectField
                            label="Smoking Status"
                            name="smoking_status"
                            value={formData.smoking_status}
                            options={[
                                { label: "Never Smoked", value: "never smoked" },
                                { label: "Formerly Smoked", value: "formerly smoked" },
                                { label: "Currently Smokes", value: "smokes" },
                                { label: "Unknown", value: "Unknown" },
                            ]}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

                    {error && (
                        <div className="mt-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                            <CircleAlert
                                size={18}
                                className="mt-0.5 shrink-0 text-red-500 dark:text-red-400"
                            />
                            <div>
                                <h3 className="text-xs font-semibold text-red-700 dark:text-red-300">
                                    Prediction Error
                                </h3>
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ================================================= */}
                    {/* BUTTONS */}
                    {/* ================================================= */}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        {/* RESET */}
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <RotateCcw size={17} />
                            Reset
                        </button>

                        {/* PREDICT */}
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
                                    Predict Stroke Risk
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* ================================================= */}
                {/* RIGHT SIDE */}
                {/* ================================================= */}

                {predictionState === "idle" && (
                    <ReadyState />
                )}

                {predictionState === "loading" && (
                    <LoadingState />
                )}

                {predictionState === "result" && predictionResult && (
                    <PredictionResult
                        result={predictionResult}
                        patientName={formData.name}  // Changed from patientName to name
                    />
                )}
            </div>

            {/* ================================================= */}
            {/* RECENT PREDICTIONS */}
            {/* ================================================= */}

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Recent Stroke Predictions
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
                        </tr>
                        </thead>
                        <tbody>
                        {recentPredictions.map((patient, index) => (
                            <tr
                                key={`${patient.name}-${index}`}
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
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


// =====================================================
// INPUT FIELD
// =====================================================

function InputField({
                        label,
                        name,
                        value,
                        placeholder,
                        type,
                        step,
                        onChange,
                        required = false,
                    }: {
    label: string;
    name: string;
    value: string;
    placeholder: string;
    type: string;
    step?: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    required?: boolean;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <input
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                step={step}
                placeholder={placeholder}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                required={required}
            />
        </div>
    );
}


// =====================================================
// SELECT FIELD
// =====================================================

function SelectField({
                         label,
                         name,
                         value,
                         options,
                         onChange,
                         required = false,
                     }: {
    label: string;
    name: string;
    value: string;
    options: {
        label: string;
        value: string;
    }[];
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    required?: boolean;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                required={required}
            >
                <option value="">
                    Select
                </option>
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}


// =====================================================
// READY STATE
// =====================================================

function ReadyState() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <ResultHeader />
            <div className="flex min-h-[420px] flex-col items-center justify-center px-4 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Brain size={36} strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Ready for Prediction
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Enter the patient's information on the left and click{" "}
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">
                        Predict Stroke Risk
                    </strong>
                    {" "}to analyze the patient's stroke risk.
                </p>
                <div className="my-7 h-px w-full max-w-md bg-slate-100 dark:bg-slate-700" />
                <div className="w-full max-w-md text-left">
                    <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                        What will be analyzed
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <AnalysisItem>Patient demographics</AnalysisItem>
                        <AnalysisItem>Hypertension</AnalysisItem>
                        <AnalysisItem>Heart disease</AnalysisItem>
                        <AnalysisItem>Glucose & BMI</AnalysisItem>
                    </div>
                </div>
                <div className="mt-7 flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                    Waiting for patient data
                </div>
            </div>
        </div>
    );
}


// =====================================================
// LOADING STATE
// =====================================================

function LoadingState() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <ResultHeader />
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Analyzing Stroke Risk
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    The AI model is analyzing the patient's clinical information.
                </p>
                <div className="mt-7 w-full max-w-sm">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                        <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600 dark:bg-blue-500" />
                    </div>
                    <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                        Processing prediction...
                    </p>
                </div>
            </div>
        </div>
    );
}


// =====================================================
// PREDICTION RESULT
// =====================================================

function PredictionResult({
                              result,
                              patientName,
                          }: {
    result: StrokePredictionResponse;
    patientName?: string;
}) {
    // -------------------------------------------------
    // GET STROKE PROBABILITY
    // -------------------------------------------------

    const strokeProbabilityRaw =
        result?.probabilities?.["1"] ?? 0;

    const strokeProbability =
        Number.isFinite(Number(strokeProbabilityRaw))
            ? Number(strokeProbabilityRaw) * 100
            : 0;

    const probability = Math.min(
        Math.max(strokeProbability, 0),
        100
    );

    // -------------------------------------------------
    // PREDICTION
    // -------------------------------------------------

    const isStroke =
        Number(result?.prediction) === 1;

    // -------------------------------------------------
    // CALCULATE RISK LEVEL
    // -------------------------------------------------

    const riskLevel =
        probability >= 50
            ? "High"
            : probability >= 20
                ? "Medium"
                : "Low";

    // -------------------------------------------------
    // STYLES
    // -------------------------------------------------

    const riskColor =
        riskLevel === "High"
            ? "red"
            : riskLevel === "Medium"
                ? "yellow"
                : "green";

    const boxStyle =
        riskColor === "red"
            ? "border-red-200 bg-red-50/40 dark:border-red-800 dark:bg-red-900/20"
            : riskColor === "yellow"
                ? "border-yellow-200 bg-yellow-50/40 dark:border-yellow-800 dark:bg-yellow-900/20"
                : "border-green-200 bg-green-50/40 dark:border-green-800 dark:bg-green-900/20";

    const iconStyle =
        riskColor === "red"
            ? "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400"
            : riskColor === "yellow"
                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400"
                : "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400";

    const textStyle =
        riskColor === "red"
            ? "text-red-500 dark:text-red-400"
            : riskColor === "yellow"
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-green-600 dark:text-green-400";

    // -------------------------------------------------
    // FORMAT PROBABILITY
    // -------------------------------------------------

    const formattedProbability =
        probability.toFixed(2);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="mb-5 flex items-center justify-between">
                <ResultHeader />
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    Completed
                </span>
            </div>

            {/* ================================================= */}
            {/* PATIENT NAME DISPLAY */}
            {/* ================================================= */}

            {patientName && (
                <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Patient:
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {patientName}
                        </span>
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* RESULT */}
            {/* ================================================= */}

            <div className={`rounded-lg border p-4 ${boxStyle}`}>
                <div className="flex items-center gap-4">
                    {/* ICON */}
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
                    >
                        {isStroke ? (
                            <AlertTriangle size={25} />
                        ) : (
                            <Check size={25} />
                        )}
                    </div>

                    {/* TEXT */}
                    <div className="flex-1">
                        <h3 className={`font-semibold ${textStyle}`}>
                            {isStroke
                                ? "Stroke Risk Detected"
                                : "Low Stroke Risk"
                            }
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {isStroke
                                ? "The model predicts an elevated probability of stroke. Further clinical evaluation is recommended."
                                : "The model predicts a low probability of stroke based on the provided patient information."
                            }
                        </p>
                    </div>

                    {/* PROBABILITY */}
                    <div
                        className={`text-2xl font-bold ${textStyle}`}
                    >
                        {formattedProbability}%
                    </div>
                </div>
            </div>

            {/* ================================================= */}
            {/* STROKE PROBABILITY */}
            {/* ================================================= */}

            <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Stroke Probability
                    </h3>
                    <span
                        className={`text-xs font-semibold ${textStyle}`}
                    >
                        {riskLevel} Risk
                    </span>
                </div>

                {/* PROGRESS BAR */}
                <div className="relative">
                    <div className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" />

                    {/* POINTER */}
                    <div
                        className="absolute -top-1.5 h-5 w-1 rounded-full bg-white shadow dark:bg-slate-800"
                        style={{
                            left: `${probability}%`,
                        }}
                    />

                    {/* VALUE */}
                    <div
                        className={`absolute -top-8 -translate-x-1/2 rounded-md px-2 py-1 text-[10px] font-semibold text-white ${
                            riskLevel === "High"
                                ? "bg-red-500"
                                : riskLevel === "Medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                        }`}
                        style={{
                            left: `${probability}%`,
                        }}
                    >
                        {formattedProbability}%
                    </div>
                </div>

                {/* SCALE */}
                <div className="mt-4 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* ================================================= */}
            {/* KEY INDICATORS */}
            {/* ================================================= */}

            <div className="mt-6 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Prediction Summary
                </h3>

                <div className="space-y-4">
                    {/* PREDICTION */}
                    <ResultIndicator
                        icon={<Brain size={15} />}
                        name="Prediction"
                        value={
                            isStroke
                                ? "Stroke"
                                : "No Stroke"
                        }
                        type={
                            isStroke
                                ? "danger"
                                : "success"
                        }
                    />

                    {/* RISK */}
                    <ResultIndicator
                        icon={<Activity size={15} />}
                        name="Risk Level"
                        value={riskLevel}
                        type={
                            riskLevel === "High"
                                ? "danger"
                                : riskLevel === "Medium"
                                    ? "warning"
                                    : "success"
                        }
                    />

                    {/* PROBABILITY */}
                    <ResultIndicator
                        icon={<Droplets size={15} />}
                        name="Stroke Probability"
                        value={`${formattedProbability}%`}
                        type={
                            riskLevel === "High"
                                ? "danger"
                                : riskLevel === "Medium"
                                    ? "warning"
                                    : "success"
                        }
                    />

                    {/* NO STROKE PROBABILITY */}
                    <ResultIndicator
                        icon={<Check size={15} />}
                        name="No Stroke Probability"
                        value={`${(100 - probability).toFixed(2)}%`}
                        type="success"
                    />
                </div>
            </div>

            {/* ================================================= */}
            {/* IMPORTANT NOTE */}
            {/* ================================================= */}

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex gap-3">
                    <CircleAlert
                        size={17}
                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                    />
                    <div>
                        <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                            Important Note
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-blue-700/80 dark:text-blue-300/80">
                            This AI prediction is an assistive tool and
                            should not replace professional medical
                            judgment. Clinical history, examination,
                            and appropriate diagnostic testing should
                            also be considered.
                        </p>
                    </div>
                </div>
            </div>

            {/* ================================================= */}
            {/* ACTIONS */}
            {/* ================================================= */}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                    <Download size={17} />
                    Download Report
                </button>
                <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                    <Save size={17} />
                    Save to Record
                </button>
            </div>
        </div>
    );
}


// =====================================================
// RESULT HEADER
// =====================================================

function ResultHeader() {
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
                    AI-powered stroke risk analysis
                </p>
            </div>
        </div>
    );
}


// =====================================================
// ANALYSIS ITEM
// =====================================================

function AnalysisItem({
                          children,
                      }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <Check size={12} />
            </div>
            {children}
        </div>
    );
}


// =====================================================
// RESULT INDICATOR
// =====================================================

function ResultIndicator({
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
        danger:
            "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400",
        warning:
            "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
        success:
            "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
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