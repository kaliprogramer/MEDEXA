"use client";

import { useEffect, useState } from "react";

import {
    UploadCloud,
    X,
    RotateCcw,
    Stethoscope,
    BarChart3,
    AlertTriangle,
    CircleAlert,
    Download,
    Save,
    History,
    Check,
    Wind,
    ImageIcon,
    Brain,
    Eye,
} from "lucide-react";


// =====================================================
// TYPES
// =====================================================

type PredictionState = "idle" | "loading" | "result";

interface TopPrediction {
    disease: string;
    probability: number;
}

interface LungPrediction {
    prediction: string;
    confidence: number;
    top_predictions: TopPrediction[];

    // Grad-CAM image returned by FastAPI
    // Example:
    // data:image/png;base64,iVBORw0KGgo...
    gradcam_image?: string | null;
}


// =====================================================
// RECENT PREDICTIONS
// =====================================================

const recentPredictions = [
    {
        name: "Michael Brown",
        prediction: "Bacterial Pneumonia",
        risk: "High (82%)",
        date: "May 11, 2024",
    },
    {
        name: "Sarah Wilson",
        prediction: "Normal",
        risk: "Low (96%)",
        date: "May 10, 2024",
    },
    {
        name: "Robert Davis",
        prediction: "Viral Pneumonia",
        risk: "Medium (64%)",
        date: "May 09, 2024",
    },
];


// =====================================================
// API
// =====================================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function LungDiseaseBody() {

    const [imageFile, setImageFile] =
        useState<File | null>(null);

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    const [predictionState, setPredictionState] =
        useState<PredictionState>("idle");

    const [prediction, setPrediction] =
        useState<LungPrediction | null>(null);

    const [error, setError] =
        useState<string | null>(null);


    // =================================================
    // CLEAN PREVIEW URL
    // =================================================

    useEffect(() => {

        return () => {

            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }

        };

    }, [imagePreview]);


    // =================================================
    // IMAGE SELECT
    // =================================================

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = event.target.files?.[0];

        if (!file) return;


        if (!file.type.startsWith("image/")) {

            setError(
                "Please upload a valid image file."
            );

            return;
        }


        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {

            setError(
                "Image size must be less than 10MB."
            );

            return;
        }


        setError(null);
        setPrediction(null);
        setPredictionState("idle");


        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }


        setImageFile(file);

        setImagePreview(
            URL.createObjectURL(file)
        );

    };


    // =================================================
    // REMOVE IMAGE
    // =================================================

    const handleRemoveImage = () => {

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(null);
        setImagePreview(null);
        setPrediction(null);
        setPredictionState("idle");
        setError(null);

    };


    // =================================================
    // RESET
    // =================================================

    const handleReset = () => {

        handleRemoveImage();

    };


    // =================================================
    // PREDICT
    // =================================================

    const handlePredict = async () => {

        if (!imageFile) {

            setError(
                "Please upload a lung X-ray image first."
            );

            return;
        }


        setPredictionState("loading");
        setError(null);
        setPrediction(null);


        try {

            const formData = new FormData();

            formData.append(
                "file",
                imageFile
            );


            const response = await fetch(
                `${API_BASE_URL}/lung-disease/predict`,
                {
                    method: "POST",
                    body: formData,
                }
            );


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.detail ||
                    "Prediction failed."
                );

            }


            console.log(
                "Lung API response:",
                result
            );


            setPrediction(result);

            setPredictionState("result");

        } catch (error) {

            console.error(
                "Lung prediction error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to connect to the prediction API."
            );

            setPredictionState("idle");

        }

    };


    // =================================================
    // RENDER
    // =================================================

    return (

        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">


            {/* ================================================= */}
            {/* PAGE HEADER */}
            {/* ================================================= */}

            <div className="mt-20 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">

                        <Wind size={25} />

                    </div>


                    <div>

                        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">

                            Lung Disease Prediction

                        </h1>


                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                            AI-powered lung disease classification
                            from chest X-ray

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
                {/* LEFT: IMAGE UPLOAD */}
                {/* ================================================= */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">


                    {/* HEADER */}

                    <div className="mb-6 flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">

                            <ImageIcon size={19} />

                        </div>


                        <div>

                            <h2 className="font-semibold text-slate-900 dark:text-white">

                                Chest X-ray Image

                            </h2>


                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">

                                Upload one chest X-ray image for AI analysis

                            </p>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* UPLOAD */}
                    {/* ================================================= */}

                    {!imagePreview ? (

                        <label
                            htmlFor="lung-image"
                            className="
                                flex
                                min-h-[360px]
                                cursor-pointer
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                border-2
                                border-dashed
                                border-slate-300
                                bg-slate-50
                                px-6
                                text-center
                                transition
                                hover:border-blue-400
                                hover:bg-blue-50/30
                                dark:border-slate-600
                                dark:bg-slate-900/50
                                dark:hover:border-blue-500
                                dark:hover:bg-blue-900/20
                            "
                        >

                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">

                                <UploadCloud size={36} />

                            </div>


                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">

                                Upload Chest X-ray

                            </h3>


                            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-400">

                                Drag and drop your X-ray image here,
                                or click to browse your computer.

                            </p>


                            <span className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700">

                                Choose Image

                            </span>


                            <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">

                                JPG, JPEG, PNG • Maximum 10MB

                            </p>


                            <input
                                id="lung-image"
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                className="hidden"
                                onChange={handleImageChange}
                            />

                        </label>

                    ) : (

                        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900">

                            <div className="flex min-h-[360px] items-center justify-center p-3">

                                <img
                                    src={imagePreview}
                                    alt="Uploaded chest X-ray"
                                    className="max-h-[500px] w-full rounded-lg object-contain"
                                />

                            </div>


                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="
                                    absolute
                                    right-3
                                    top-3
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-black/70
                                    text-white
                                    transition
                                    hover:bg-red-600
                                "
                                aria-label="Remove image"
                            >

                                <X size={17} />

                            </button>


                            <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">

                                <div className="flex items-center justify-between gap-3">

                                    <div className="min-w-0">

                                        <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">

                                            {imageFile?.name}

                                        </p>


                                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">

                                            {imageFile
                                                ? `${(
                                                    imageFile.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)} MB`
                                                : ""
                                            }

                                        </p>

                                    </div>


                                    <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">

                                        Image Ready

                                    </span>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

                    {error && (

                        <div className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">

                            <CircleAlert
                                size={17}
                                className="mt-0.5 shrink-0 text-red-500 dark:text-red-400"
                            />


                            <p className="text-xs leading-5 text-red-600 dark:text-red-400">

                                {error}

                            </p>

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* BUTTONS */}
                    {/* ================================================= */}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                        <button
                            type="button"
                            onClick={handleReset}
                            className="
                                flex
                                h-11
                                flex-1
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                border
                                border-slate-200
                                text-sm
                                font-medium
                                text-slate-700
                                transition
                                hover:bg-slate-50
                                dark:border-slate-700
                                dark:text-slate-300
                                dark:hover:bg-slate-700
                            "
                        >

                            <RotateCcw size={17} />

                            Reset

                        </button>


                        <button
                            type="button"
                            onClick={handlePredict}
                            disabled={
                                !imageFile ||
                                predictionState === "loading"
                            }
                            className="
                                flex
                                h-11
                                flex-1
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-blue-600
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:hover:bg-blue-500
                            "
                        >

                            {predictionState === "loading" ? (

                                <>

                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                                    Analyzing X-ray...

                                </>

                            ) : (

                                <>

                                    <Stethoscope size={18} />

                                    Predict Now

                                </>

                            )}

                        </button>

                    </div>


                    {/* ================================================= */}
                    {/* MODEL INFO */}
                    {/* ================================================= */}

                    <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-900/20">

                        <div className="flex gap-3">

                            <Wind
                                size={17}
                                className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                            />

                            <div>

                                <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-300">

                                    AI Model

                                </h3>


                                <p className="mt-1 text-xs leading-5 text-blue-700/80 dark:text-blue-300/80">

                                    ResNet50 analyzes the chest X-ray
                                    and provides disease probabilities
                                    together with an AI attention map.

                                </p>


                                <div className="mt-3 flex flex-wrap gap-1.5">

                                    {[
                                        "Bacterial Pneumonia",
                                        "Corona Virus Disease",
                                        "Normal",
                                        "Tuberculosis",
                                        "Viral Pneumonia",
                                    ].map((name) => (

                                        <span
                                            key={name}
                                            className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                        >

                                            {name}

                                        </span>

                                    ))}

                                </div>

                            </div>

                        </div>

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


                {predictionState === "result" && prediction && (

                    <PredictionResult
                        prediction={prediction}
                        originalImage={imagePreview}
                    />

                )}

            </div>


            {/* ================================================= */}
            {/* RECENT PREDICTIONS */}
            {/* ================================================= */}

            <div className="mt-6">

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

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

                                <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Patient
                                </th>

                                <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Prediction
                                </th>

                                <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Confidence
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
                                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
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

        </div>
    );
}


// =====================================================
// READY STATE
// =====================================================

function ReadyState() {

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">

            <ResultHeader
                subtitle="AI-powered chest X-ray analysis"
            />


            <div className="flex min-h-[420px] flex-col items-center justify-center px-4 text-center">

                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">

                    <Stethoscope
                        size={36}
                        strokeWidth={1.8}
                    />

                </div>


                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">

                    Ready for X-ray Analysis

                </h3>


                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">

                    Upload a chest X-ray image on the left and click{" "}

                    <strong className="font-semibold text-slate-700 dark:text-slate-300">

                        Predict Now

                    </strong>

                    {" "}to classify the image and generate an
                    AI attention map.

                </p>


                <div className="my-7 h-px w-full max-w-md bg-slate-100 dark:bg-slate-700" />


                <div className="w-full max-w-md text-left">

                    <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">

                        Possible classifications

                    </h4>


                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <AnalysisItem>
                            Bacterial Pneumonia
                        </AnalysisItem>

                        <AnalysisItem>
                            Corona Virus Disease
                        </AnalysisItem>

                        <AnalysisItem>
                            Normal
                        </AnalysisItem>

                        <AnalysisItem>
                            Tuberculosis
                        </AnalysisItem>

                        <AnalysisItem>
                            Viral Pneumonia
                        </AnalysisItem>

                    </div>

                </div>


                <div className="mt-7 flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">

                    <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />

                    Waiting for X-ray image

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

            <ResultHeader
                subtitle="Processing chest X-ray"
            />


            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">

                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">

                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400" />

                </div>


                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">

                    Analyzing Chest X-ray

                </h3>


                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">

                    The neural network is analyzing the uploaded
                    image and generating classification probabilities
                    and an AI attention map.

                </p>


                <div className="mt-7 w-full max-w-sm">

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">

                        <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600 dark:bg-blue-500" />

                    </div>


                    <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">

                        Running ResNet50 + Grad-CAM...

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
                              prediction,
                              originalImage,
                          }: {
    prediction: LungPrediction;
    originalImage: string | null;
}) {

    const resultStyle =
        getResultStyle(prediction.prediction);


    const confidence =
        prediction.confidence * 100;


    return (

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="mb-5 flex items-center justify-between">

                <ResultHeader
                    subtitle="CNN + Grad-CAM chest X-ray analysis"
                />


                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">

                    Completed

                </span>

            </div>


            {/* ================================================= */}
            {/* RESULT */}
            {/* ================================================= */}

            <div className={`rounded-lg border p-4 ${resultStyle.container}`}>

                <div className="flex items-center gap-4">

                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${resultStyle.icon}`}>

                        {prediction.prediction === "Normal" ? (

                            <Check size={25} />

                        ) : (

                            <AlertTriangle size={25} />

                        )}

                    </div>


                    <div className="min-w-0 flex-1">

                        <h3 className={`font-semibold ${resultStyle.text}`}>

                            {prediction.prediction}

                        </h3>


                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">

                            The AI model classified the uploaded
                            chest X-ray as {prediction.prediction}.

                        </p>

                    </div>


                    <div className={`text-2xl font-bold ${resultStyle.text}`}>

                        {confidence.toFixed(1)}%

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* AI ATTENTION / GRAD-CAM */}
            {/* ================================================= */}

            <div className="mt-6 rounded-xl border border-slate-200 p-4 dark:border-slate-700">

                <div className="mb-4 flex items-start justify-between gap-3">

                    <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">

                            <Brain size={19} />

                        </div>


                        <div>

                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">

                                AI Attention Map

                            </h3>


                            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">

                                Grad-CAM highlights image regions that
                                contributed most to the model's prediction.

                            </p>

                        </div>

                    </div>


                    <div className="hidden items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400 sm:flex">

                        <Eye size={12} />

                        Grad-CAM

                    </div>

                </div>


                {prediction.gradcam ? (

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* ORIGINAL */}

                        <div>

                            <div className="mb-2 flex items-center justify-between">

                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">

                                    Original X-ray

                                </span>

                            </div>


                            <div className="overflow-hidden rounded-lg border border-slate-200 bg-black dark:border-slate-700">

                                {originalImage ? (

                                    <img
                                        src={originalImage}
                                        alt="Original chest X-ray"
                                        className="aspect-square w-full object-contain"
                                    />

                                ) : (

                                    <div className="flex aspect-square items-center justify-center text-xs text-slate-400">

                                        Original image unavailable

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* GRAD CAM */}

                        <div>

                            <div className="mb-2 flex items-center justify-between">

                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">

                                    AI Attention

                                </span>


                                <span className="text-[10px] text-slate-400">

                                    Red = stronger attention

                                </span>

                            </div>


                            <div className="overflow-hidden rounded-lg border border-red-200 bg-black dark:border-red-900">

                                <img
                                    src={`data:image/png;base64,${prediction.gradcam}`}
                                    alt={`Grad-CAM attention map for ${prediction.prediction}`}
                                    className="aspect-square w-full object-contain"
                                />

                            </div>

                        </div>

                    </div>

                ) : (

                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">

                        <div className="flex gap-3">

                            <CircleAlert
                                size={17}
                                className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-400"
                            />


                            <div>

                                <h4 className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">

                                    Attention map unavailable

                                </h4>


                                <p className="mt-1 text-xs leading-5 text-yellow-700/80 dark:text-yellow-300/80">

                                    The prediction was completed, but the
                                    backend did not return a Grad-CAM image.

                                </p>

                            </div>

                        </div>

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* CONFIDENCE */}
            {/* ================================================= */}

            <div className="mt-6">

                <div className="mb-3 flex items-center justify-between">

                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">

                        Model Confidence

                    </h3>


                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">

                        {confidence.toFixed(1)}%

                    </span>

                </div>


                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">

                    <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-700 dark:bg-blue-500"
                        style={{
                            width: `${Math.min(
                                Math.max(confidence, 0),
                                100
                            )}%`,
                        }}
                    />

                </div>

            </div>


            {/* ================================================= */}
            {/* TOP PREDICTIONS */}
            {/* ================================================= */}

            <div className="mt-6 rounded-lg border border-slate-200 p-4 dark:border-slate-700">

                <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">

                    Classification Probabilities

                </h3>


                <div className="space-y-4">

                    {prediction.top_predictions.map(
                        (item, index) => {

                            const probability =
                                item.probability * 100;


                            return (

                                <div key={item.disease}>

                                    <div className="mb-1.5 flex items-center justify-between gap-3">

                                        <div className="flex min-w-0 items-center gap-2">

                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">

                                                {index + 1}

                                            </span>


                                            <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">

                                                {item.disease}

                                            </span>

                                        </div>


                                        <span className="shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-400">

                                            {probability.toFixed(1)}%

                                        </span>

                                    </div>


                                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">

                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all duration-700"
                                            style={{
                                                width: `${Math.min(
                                                    Math.max(
                                                        probability,
                                                        0
                                                    ),
                                                    100
                                                )}%`,
                                            }}
                                        />

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            </div>


            {/* ================================================= */}
            {/* CLINICAL INTERPRETATION */}
            {/* ================================================= */}

            <div className="mt-6 rounded-lg border border-slate-200 p-4 dark:border-slate-700">

                <div className="flex gap-3">

                    <Brain
                        size={17}
                        className="mt-0.5 shrink-0 text-purple-600 dark:text-purple-400"
                    />


                    <div>

                        <h3 className="text-xs font-semibold text-slate-900 dark:text-white">

                            AI Attention Interpretation

                        </h3>


                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">

                            The highlighted areas represent regions that
                            influenced the neural network's classification.
                            Grad-CAM is an interpretability visualization,
                            not a precise anatomical segmentation or
                            confirmed lesion boundary.

                        </p>

                    </div>

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

                            This AI classification and attention map are
                            assistive tools and should not replace professional
                            medical diagnosis or clinical judgment.

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
                    className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                >

                    <Download size={17} />

                    Download Report

                </button>


                <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
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

function ResultHeader({
                          subtitle,
                      }: {
    subtitle: string;
}) {

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
// RESULT STYLE
// =====================================================

function getResultStyle(
    disease: string
) {

    if (disease === "Normal") {

        return {
            container:
                "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20",

            icon:
                "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",

            text:
                "text-green-600 dark:text-green-400",
        };

    }


    return {
        container:
            "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20",

        icon:
            "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400",

        text:
            "text-red-500 dark:text-red-400",
    };

}