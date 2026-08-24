"use client";

import { useState } from "react";
import {
    Copy,
    Check,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Activity,
    HeartPulse,
    Droplets,
    Brain,

    Stethoscope,
    Server,
    Code2,
} from "lucide-react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_AI_API_URL || "http://127.0.0.1:8000";

type Endpoint = {
    id: string;
    method: "GET" | "POST";
    path: string;
    title: string;
    description: string;
    icon: any;
    body?: Record<string, any>;
contentType?: string;
};

const endpoints: Endpoint[] = [
    {
        id: "heart-disease",
        method: "POST",
        path: "/heartdisease/predict",
        title: "Heart Disease Prediction",
        description:
            "Predict the likelihood of heart disease using clinical patient data.",
        icon: HeartPulse,
        body: {
            age: 45,
            anaemia: 0,
            creatinine_phosphokinase: 582,
            diabetes: 0,
            ejection_fraction: 38,
            high_blood_pressure: 1,
            platelets: 265000,
            serum_creatinine: 1.9,
            serum_sodium: 130,
            sex: 1,
            smoking: 0,
        },
    },
    {
        id: "diabetes",
        method: "POST",
        path: "/diabetes/predict",
        title: "Diabetes Prediction",
        description:
            "Predict diabetes using symptoms and demographic information.",
        icon: Droplets,
        body: {
            age: 40,
            gender: 1,
            polyuria: 1,
            polydipsia: 1,
            sudden_weight_loss: 0,
            weakness: 1,
            polyphagia: 1,
            genital_thrush: 0,
            visual_blurring: 1,
            itching: 1,
            irritability: 0,
            delayed_healing: 1,
            partial_paresis: 0,
            muscle_stiffness: 0,
            alopecia: 0,
            obesity: 1,
        },
    },
    {
        id: "lung-disease",
        method: "POST",
        path: "/lung-disease/predict",
        title: "Lung Disease Prediction",
        description:
            "Upload a medical image and predict the associated lung disease.",
        icon: Activity,
        contentType: "multipart/form-data",
        body: {
            file: "medical-image.jpg",
        },
    },
    {
        id: "stroke",
        method: "POST",
        path: "/stroke/predict",
        title: "Stroke Prediction",
        description:
            "Predict stroke risk using demographic and clinical information.",
        icon: Brain,
        body: {
            age: 60,
            gender: 1,
            hypertension: 0,
            heart_disease: 0,
            ever_married: 1,
            work_type: 2,
            Residence_type: 1,
            avg_glucose_level: 120.5,
            bmi: 28.4,
            smoking_status: 1,
        },
    },
    {
        id: "chronic-kidney",
        method: "POST",
        path: "/chronic-kidney/predict",
        title: "Chronic Kidney Disease",
        description:
            "Predict chronic kidney disease using laboratory and clinical data.",
        icon: Brain,
        body: {
            age: 48,
            bp: 80,
            sg: 1.02,
            al: 1,
            su: 0,
            rbc: 1,
            pc: 1,
            pcc: 0,
            ba: 0,
            bgr: 121,
            bu: 36,
            sc: 1.2,
            sod: 138,
            pot: 4.2,
            hemo: 15.4,
            pcv: 44,
            wc: 7800,
            rc: 5.2,
            htn: 0,
            dm: 0,
            cad: 0,
            appet: 1,
            pe: 0,
            ane: 0,
        },
    },
];

const methodStyles = {
    GET: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    POST: "text-blue-500 bg-blue-500/10 border-blue-500/20",
};

function JsonBlock({ data }: { data: any }) {
    return (
        <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0b1120] p-5 text-sm leading-6 text-slate-300">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
    );
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <button
            onClick={copy}
            className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title="Copy"
        >
            {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </button>
    );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
    const [open, setOpen] = useState(true);
    const Icon = endpoint.icon;

    return (
        <section
            id={endpoint.id}
            className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900/50"
            >
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
              <span
                  className={`rounded-md border px-2 py-0.5 text-xs font-bold ${
                      methodStyles[endpoint.method]
                  }`}
              >
                {endpoint.method}
              </span>

                            <code className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {endpoint.path}
                            </code>
                        </div>

                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            {endpoint.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {endpoint.description}
                        </p>
                    </div>
                </div>

                {open ? (
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
                ) : (
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                )}
            </button>

            {open && (
                <div className="border-t border-slate-200 dark:border-slate-800">
                    {/* Endpoint URL */}
                    <div className="border-b border-slate-200 p-5 dark:border-slate-800">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Endpoint
                            </h3>

                            <CopyButton value={`${API_BASE_URL}${endpoint.path}`} />
                        </div>

                        <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
              <span
                  className={`rounded-md border px-2 py-1 text-xs font-bold ${
                      methodStyles[endpoint.method]
                  }`}
              >
                {endpoint.method}
              </span>

                            <code className="whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                                {API_BASE_URL}
                                {endpoint.path}
                            </code>
                        </div>
                    </div>

                    {/* Request */}
                    <div className="border-b border-slate-200 p-5 dark:border-slate-800">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Request
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Content-Type:{" "}
                                    <code>
                                        {endpoint.contentType || "application/json"}
                                    </code>
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    document
                                        .getElementById(`${endpoint.id}-try`)
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "center",
                                        })
                                }
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                            >
                                <Code2 className="h-4 w-4" />
                                Try it
                            </button>
                        </div>

                        {endpoint.contentType === "multipart/form-data" ? (
                            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1120]">
                                <div className="border-b border-slate-800 px-4 py-3">
                                    <code className="text-xs text-slate-400">
                                        multipart/form-data
                                    </code>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between">
                                        <code className="text-sm text-slate-300">file *</code>

                                        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                      binary
                    </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <JsonBlock data={endpoint.body} />
                        )}
                    </div>

                    {/* Response */}
                    <div className="border-b border-slate-200 p-5 dark:border-slate-800">
                        <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                            Responses
                        </h3>

                        <div className="mb-4 flex items-center gap-3">
              <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-500">
                200
              </span>

                            <span className="text-sm text-slate-600 dark:text-slate-400">
                Successful Response
              </span>
                        </div>

                        <div className="mb-4 rounded-xl border border-slate-800 bg-[#0b1120] p-5">
                            <code className="text-sm text-slate-300">
                                {
                                    "{\n  \"prediction\": \"result\",\n  \"status\": \"success\"\n}"
                                }
                            </code>
                        </div>

                        <div className="flex items-center gap-3">
              <span className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500">
                422
              </span>

                            <span className="text-sm text-slate-600 dark:text-slate-400">
                Validation Error
              </span>
                        </div>
                    </div>

                    {/* Try it */}
                    <div
                        id={`${endpoint.id}-try`}
                        className="scroll-mt-24 bg-slate-50 p-5 dark:bg-slate-900/40"
                    >
                        <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                            <Server className="h-4 w-4 text-blue-500" />
                            Try this endpoint
                        </h3>

                        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                            <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  cURL
                </span>

                                <CopyButton
                                    value={`curl -X ${endpoint.method} "${API_BASE_URL}${endpoint.path}"`}
                                />
                            </div>

                            <pre className="overflow-x-auto text-xs leading-6 text-slate-600 dark:text-slate-400">
                <code>
                  {endpoint.contentType === "multipart/form-data"
                      ? `curl -X POST "${API_BASE_URL}${endpoint.path}" \\
  -F "file=@medical-image.jpg"`
                      : `curl -X POST "${API_BASE_URL}${endpoint.path}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(endpoint.body)}'`}
                </code>
              </pre>
                        </div>

                        <a
                            href={`${API_BASE_URL}/docs`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            Open FastAPI Swagger
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            )}
        </section>
    );
}

export default function ApiDocsPage() {
    const [activeSection, setActiveSection] = useState("overview");

    const scrollTo = (id: string) => {
        setActiveSection(id);

        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <div className="mt-16 min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">

            <div className="mx-auto flex max-w-[1600px]">


                {/* Main */}
                <main className="min-w-0 flex-1">
                    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
                        {/* Overview */}
                        <section id="overview" className="scroll-mt-24">
                            <div className="mb-8">
                                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
                    API v1.0.0
                  </span>

                                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    OAS 3.1
                  </span>
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    MEDEXA Disease Prediction API
                                </h1>

                                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
                                    API for disease prediction using trained machine learning
                                    models. Integrate disease prediction capabilities directly
                                    into your applications.
                                </p>
                            </div>

                            {/* Base URL */}
                            <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                                <div className="mb-2 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Base URL
                                        </p>

                                        <code className="mt-1 block text-sm text-slate-700 dark:text-slate-300">
                                            {API_BASE_URL}
                                        </code>
                                    </div>

                                    <CopyButton value={API_BASE_URL} />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="mb-12 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                                    <p className="text-2xl font-bold">5</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Prediction APIs
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                                    <p className="text-2xl font-bold">POST</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Prediction method
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                                    <p className="text-2xl font-bold">JSON</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Request format
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Endpoints */}
                        <div className="mb-5">
                            <h2 className="text-xl font-bold">Endpoints</h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Available disease prediction endpoints.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {endpoints.map((endpoint) => (
                                <EndpointCard
                                    key={endpoint.id}
                                    endpoint={endpoint}
                                />
                            ))}
                        </div>

                        {/* Footer */}
                        <footer className="mt-12 border-t border-slate-200 py-8 text-center dark:border-slate-800">
                            <p className="text-xs text-slate-500">
                                DoctRisk Disease Prediction API · OpenAPI 3.1 · v1.0.0
                            </p>
                        </footer>
                    </div>
                </main>
                {/* Sidebar */}
                <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#020617] lg:block">
                    <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Documentation
                    </p>

                    <nav className="space-y-1">
                        <button
                            onClick={() => scrollTo("overview")}
                            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                                activeSection === "overview"
                                    ? "bg-blue-500/10 font-semibold text-blue-500"
                                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
                            }`}
                        >
                            Overview
                        </button>

                        <div className="pt-4">
                            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Endpoints
                            </p>

                            {endpoints.map((endpoint) => {
                                const Icon = endpoint.icon;

                                return (
                                    <button
                                        key={endpoint.id}
                                        onClick={() => scrollTo(endpoint.id)}
                                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                                            activeSection === endpoint.id
                                                ? "bg-blue-500/10 font-semibold text-blue-500"
                                                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />

                                        <span className="truncate">
                      {endpoint.title}
                    </span>
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    <div className="mt-8 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                        <p className="text-xs font-semibold">OpenAPI</p>

                        <p className="mt-1 text-xs text-slate-500">
                            OpenAPI Specification 3.1
                        </p>

                        <a
                            href={`${API_BASE_URL}/openapi.json`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-500 hover:underline"
                        >
                            openapi.json
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </aside>
            </div>
        </div>
    );
}