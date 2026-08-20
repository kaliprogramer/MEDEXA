"use client";

import Link from "next/link";
import {useAuth} from "@/context/AuthContext";
import {
    Activity,
    ArrowRight,
    Brain,
    CheckCircle2,
    Clock3,
    Droplets,
    FileText,
    HeartPulse,
    History,
    Scan,
    ShieldCheck,
    Users,
    Wind,
    AlertTriangle,
    TrendingUp,
    CalendarDays,
    ChevronRight,
} from "lucide-react";
import {getMe} from "@/app/lib/api/profile_API";
import {useEffect,useState} from "react";
// =====================================================
// TYPES
// =====================================================

type Prediction = {
    patient: string;
    disease: string;
    risk: "High" | "Medium" | "Low";
    probability: number;
    date: string;
};


// =====================================================
// DATA
// =====================================================

const predictions: Prediction[] = [
    {
        patient: "Michael Brown",
        disease: "Heart Disease",
        risk: "High",
        probability: 82,
        date: "Today, 10:42 AM",
    },
    {
        patient: "Sarah Wilson",
        disease: "Diabetes",
        risk: "Low",
        probability: 18,
        date: "Today, 09:15 AM",
    },
    {
        patient: "Robert Davis",
        disease: "Lung Disease",
        risk: "Medium",
        probability: 54,
        date: "Yesterday, 04:32 PM",
    },
    {
        patient: "Emily Johnson",
        disease: "Pneumonia",
        risk: "High",
        probability: 76,
        date: "Yesterday, 02:18 PM",
    },
    {
        patient: "David Miller",
        disease: "Heart Disease",
        risk: "Low",
        probability: 12,
        date: "May 10, 2024",
    },
];


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function DashboardBody() {
    const [username, setUsername] = useState("");
    const {
        user
    } = useAuth();
    useEffect(() => {
        setUsername(user?.username);
    }, []);

    // setEmail(user.email);
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Good morning, Dr. {username}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Here's what's happening with your clinical AI
                        assistant today.
                    </p>

                </div>


                <div className="flex items-center gap-3">

                    <div className="hidden items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 shadow-sm sm:flex">

                        <CalendarDays size={16} />

                        <span>May 11, 2024</span>

                    </div>


                    <Link
                        href="/dashboard/heart-disease"
                        className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
              dark:hover:bg-blue-500
            "
                    >

                        <Activity size={17} />

                        New Prediction

                    </Link>

                </div>

            </div>


            {/* ================================================= */}
            {/* STAT CARDS */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total Predictions"
                    value="248"
                    description="+18 this month"
                    icon={<Brain size={20} />}
                    iconStyle="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    trend="up"
                />

                <StatCard
                    title="Patients Analyzed"
                    value="184"
                    description="+12 this month"
                    icon={<Users size={20} />}
                    iconStyle="bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                    trend="up"
                />

                <StatCard
                    title="High Risk Cases"
                    value="32"
                    description="12.9% of predictions"
                    icon={<AlertTriangle size={20} />}
                    iconStyle="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                    trend="neutral"
                />

                <StatCard
                    title="Model Accuracy"
                    value="94.8%"
                    description="Across all models"
                    icon={<ShieldCheck size={20} />}
                    iconStyle="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    trend="up"
                />

            </div>


            {/* ================================================= */}
            {/* PREDICTION MODELS */}
            {/* ================================================= */}

            <div className="mt-6">

                <div className="mb-4 flex items-center justify-between">

                    <div>

                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            AI Prediction Models
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Select a model to start a new clinical prediction.
                        </p>

                    </div>

                </div>


                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <PredictionModel
                        title="Heart Disease"
                        description="Predict cardiovascular disease risk."
                        icon={<HeartPulse size={21} />}
                        iconStyle="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                        href="/dashboard/heart-disease"
                        predictions="86 predictions"
                    />

                    <PredictionModel
                        title="Diabetes"
                        description="Analyze diabetes risk from clinical data."
                        icon={<Droplets size={21} />}
                        iconStyle="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        href="/dashboard/diabetes"
                        predictions="64 predictions"
                    />

                    <PredictionModel
                        title="Lung Disease"
                        description="Evaluate respiratory disease indicators."
                        icon={<Wind size={21} />}
                        iconStyle="bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
                        href="/dashboard/lung-disease"
                        predictions="52 predictions"
                    />

                    <PredictionModel
                        title="Stroke"
                        description="Analyze Stroke Disease Prediction."
                        icon={<Scan size={21} />}
                        iconStyle="bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                        href="/dashboard/stroke"
                        predictions="46 predictions"
                    />
                    {/*<PredictionModel*/}
                    {/*    title="Chronic Kidney Disease"*/}
                    {/*    description="Analyze Chronic Kidney Disease Prediction."*/}
                    {/*    icon={<Scan size={21} />}*/}
                    {/*    iconStyle="bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"*/}
                    {/*    href="/dashboard/Chronic_Kidney"*/}
                    {/*    predictions="46 predictions"*/}
                    {/*/>*/}

                </div>

            </div>


            {/* ================================================= */}
            {/* MAIN CONTENT GRID */}
            {/* ================================================= */}

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">


                {/* ================================================= */}
                {/* RECENT PREDICTIONS */}
                {/* ================================================= */}

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm xl:col-span-2">

                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-5">

                        <div>

                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Recent Predictions
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Latest patient analysis results
                            </p>

                        </div>


                        <Link
                            href="/dashboard/history"
                            className="
                flex
                items-center
                gap-1
                text-xs
                font-medium
                text-blue-600
                hover:text-blue-700
                dark:text-blue-400
                dark:hover:text-blue-300
              "
                        >

                            View all

                            <ArrowRight size={14} />

                        </Link>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[650px]">

                            <thead className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">

                            <tr>

                                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Patient
                                </th>

                                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Prediction
                                </th>

                                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Risk
                                </th>

                                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Probability
                                </th>

                                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Date
                                </th>

                                <th />

                            </tr>

                            </thead>


                            <tbody>

                            {predictions.map((prediction) => (

                                <PredictionRow
                                    key={`${prediction.patient}-${prediction.date}`}
                                    prediction={prediction}
                                />

                            ))}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* ================================================= */}
                {/* RIGHT COLUMN */}
                {/* ================================================= */}

                <div className="space-y-6">


                    {/* ================================================= */}
                    {/* RISK OVERVIEW */}
                    {/* ================================================= */}

                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Risk Overview
                                </h2>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Current prediction distribution
                                </p>

                            </div>

                            <TrendingUp
                                size={18}
                                className="text-slate-400 dark:text-slate-500"
                            />

                        </div>


                        <div className="mt-6 flex items-center justify-center">

                            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#22c55e_0_57%,#eab308_57%_78%,#ef4444_78%_100%)]">

                                <div className="
                  flex
                  h-28
                  w-28
                  flex-col
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  dark:bg-slate-800
                ">

                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    248
                  </span>

                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    Predictions
                  </span>

                                </div>

                            </div>

                        </div>


                        <div className="mt-6 space-y-3">

                            <RiskItem
                                label="Low Risk"
                                value="142"
                                percentage="57%"
                                dot="bg-green-500"
                            />

                            <RiskItem
                                label="Medium Risk"
                                value="52"
                                percentage="21%"
                                dot="bg-yellow-500"
                            />

                            <RiskItem
                                label="High Risk"
                                value="54"
                                percentage="22%"
                                dot="bg-red-500"
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* SYSTEM STATUS */}
                    {/* ================================================= */}

                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    AI System Status
                                </h2>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Model availability
                                </p>

                            </div>


                            <span className="
                flex
                items-center
                gap-1.5
                rounded-full
                bg-green-50
                dark:bg-green-900/30
                px-2.5
                py-1
                text-[10px]
                font-medium
                text-green-600
                dark:text-green-400
              ">

                <span className="h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-green-400" />

                All Systems Operational

              </span>

                        </div>


                        <div className="mt-5 space-y-3">

                            <SystemStatus
                                name="Heart Disease Model"
                                status="Operational"
                            />

                            <SystemStatus
                                name="Diabetes Model"
                                status="Operational"
                            />

                            <SystemStatus
                                name="Lung Disease Model"
                                status="Operational"
                            />

                            <SystemStatus
                                name="Pneumonia X-Ray Model"
                                status="Operational"
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* BOTTOM SECTION */}
            {/* ================================================= */}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">


                {/* ================================================= */}
                {/* ACTIVITY */}
                {/* ================================================= */}

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm lg:col-span-2">

                    <div className="mb-5 flex items-center justify-between">

                        <div>

                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Recent Activity
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Latest actions in your workspace
                            </p>

                        </div>

                        <Clock3
                            size={18}
                            className="text-slate-400 dark:text-slate-500"
                        />

                    </div>


                    <div className="space-y-5">

                        <ActivityItem
                            icon={<HeartPulse size={16} />}
                            iconStyle="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                            title="Heart disease prediction completed"
                            description="Michael Brown • High risk detected"
                            time="10 minutes ago"
                        />

                        <ActivityItem
                            icon={<Droplets size={16} />}
                            iconStyle="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            title="Diabetes prediction completed"
                            description="Sarah Wilson • Low risk"
                            time="1 hour ago"
                        />

                        <ActivityItem
                            icon={<FileText size={16} />}
                            iconStyle="bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                            title="Clinical report generated"
                            description="Robert Davis • Lung disease"
                            time="3 hours ago"
                        />

                        <ActivityItem
                            icon={<Users size={16} />}
                            iconStyle="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            title="New patient added"
                            description="Emily Johnson"
                            time="Yesterday"
                        />

                    </div>

                </div>


                {/* ================================================= */}
                {/* QUICK ACTIONS */}
                {/* ================================================= */}

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">

                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Quick Actions
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Frequently used actions
                    </p>


                    <div className="mt-5 space-y-3">

                        <QuickAction
                            href="/dashboard/heart-disease"
                            icon={<HeartPulse size={18} />}
                            title="New Prediction"
                            description="Start a clinical analysis"
                            iconStyle="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        />

                        <QuickAction
                            href="/dashboard/patients"
                            icon={<Users size={18} />}
                            title="Patients"
                            description="Manage patient records"
                            iconStyle="bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                        />

                        <QuickAction
                            href="/dashboard/history"
                            icon={<History size={18} />}
                            title="Prediction History"
                            description="View previous predictions"
                            iconStyle="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        />

                        <QuickAction
                            href="/dashboard/reports"
                            icon={<FileText size={18} />}
                            title="Reports"
                            description="View generated reports"
                            iconStyle="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                        />

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* FOOTER NOTE */}
            {/* ================================================= */}

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 p-4">

                <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                />

                <div>

                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                        Clinical AI Assistance
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-300/80">
                        AI predictions are intended to assist healthcare
                        professionals and should not replace clinical
                        judgment, diagnosis, or professional medical advice.
                    </p>

                </div>

            </div>

        </div>
    );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
                      title,
                      value,
                      description,
                      icon,
                      iconStyle,
                      trend,
                  }: {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
    iconStyle: string;
    trend: "up" | "neutral";
}) {

    return (

        <div className="
      rounded-xl
      border
      border-slate-200
      dark:border-slate-700
      bg-white
      dark:bg-slate-800
      p-5
      shadow-sm
      transition
      hover:shadow-md
      dark:hover:shadow-slate-700/50
    ">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </p>

                </div>


                <div className={`rounded-lg p-2.5 ${iconStyle}`}>
                    {icon}
                </div>

            </div>


            <div className="mt-4 flex items-center gap-2">

                {trend === "up" && (

                    <span className="flex items-center gap-1 text-[11px] font-medium text-green-600 dark:text-green-400">

            <TrendingUp size={13} />

            Up

          </span>

                )}

                <span className="text-[11px] text-slate-400 dark:text-slate-500">
          {description}
        </span>

            </div>

        </div>

    );
}


// =====================================================
// PREDICTION MODEL CARD
// =====================================================

function PredictionModel({
                             title,
                             description,
                             icon,
                             iconStyle,
                             href,
                             predictions,
                         }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    iconStyle: string;
    href: string;
    predictions: string;
}) {

    return (

        <Link
            href={href}
            className="
        group
        rounded-xl
        border
        border-slate-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-800
        p-5
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:border-blue-200
        dark:hover:border-blue-800
        hover:shadow-md
        dark:hover:shadow-slate-700/50
      "
        >

            <div className="flex items-start justify-between">

                <div className={`rounded-lg p-2.5 ${iconStyle}`}>
                    {icon}
                </div>


                <ArrowRight
                    size={17}
                    className="
            text-slate-300
            dark:text-slate-600
            transition
            group-hover:translate-x-1
            group-hover:text-blue-600
            dark:group-hover:text-blue-400
          "
                />

            </div>


            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                {title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {description}
            </p>


            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">

                <Activity size={12} />

                {predictions}

            </div>

        </Link>

    );
}


// =====================================================
// PREDICTION TABLE ROW
// =====================================================

function PredictionRow({
                           prediction,
                       }: {
    prediction: Prediction;
}) {

    const riskStyles = {
        High: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
        Medium: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
        Low: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    };


    return (

        <tr className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50">

            <td className="px-5 py-4">

                <div className="flex items-center gap-3">

                    <div className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-slate-100
            dark:bg-slate-700
            text-[10px]
            font-semibold
            text-slate-600
            dark:text-slate-300
          ">
                        {prediction.patient
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                    </div>

                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {prediction.patient}
          </span>

                </div>

            </td>


            <td className="px-5 py-4">

        <span className="text-xs text-slate-600 dark:text-slate-400">
          {prediction.disease}
        </span>

            </td>


            <td className="px-5 py-4">

        <span
            className={`
            inline-flex
            rounded-full
            px-2.5
            py-1
            text-[10px]
            font-medium
            ${riskStyles[prediction.risk]}
          `}
        >
          {prediction.risk}
        </span>

            </td>


            <td className="px-5 py-4">

        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {prediction.probability}%
        </span>

            </td>


            <td className="px-5 py-4">

        <span className="whitespace-nowrap text-xs text-slate-400 dark:text-slate-500">
          {prediction.date}
        </span>

            </td>


            <td className="px-5 py-4 text-right">

                <button
                    type="button"
                    className="
            rounded-lg
            p-2
            text-slate-400
            dark:text-slate-500
            transition
            hover:bg-blue-50
            dark:hover:bg-blue-900/30
            hover:text-blue-600
            dark:hover:text-blue-400
          "
                >

                    <ArrowRight size={15} />

                </button>

            </td>

        </tr>

    );
}


// =====================================================
// RISK ITEM
// =====================================================

function RiskItem({
                      label,
                      value,
                      percentage,
                      dot,
                  }: {
    label: string;
    value: string;
    percentage: string;
    dot: string;
}) {

    return (

        <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />

                <span className="text-xs text-slate-600 dark:text-slate-400">
          {label}
        </span>

            </div>


            <div className="flex items-center gap-3">

        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {value}
        </span>

                <span className="w-8 text-right text-[10px] text-slate-400 dark:text-slate-500">
          {percentage}
        </span>

            </div>

        </div>

    );
}


// =====================================================
// SYSTEM STATUS
// =====================================================

function SystemStatus({
                          name,
                          status,
                      }: {
    name: string;
    status: string;
}) {

    return (

        <div className="flex items-center justify-between">

            <div className="flex items-center gap-2.5">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">

                    <CheckCircle2 size={15} />

                </div>

                <span className="text-xs text-slate-600 dark:text-slate-400">
          {name}
        </span>

            </div>


            <span className="text-[10px] font-medium text-green-600 dark:text-green-400">
        {status}
      </span>

        </div>

    );
}


// =====================================================
// ACTIVITY ITEM
// =====================================================

function ActivityItem({
                          icon,
                          iconStyle,
                          title,
                          description,
                          time,
                      }: {
    icon: React.ReactNode;
    iconStyle: string;
    title: string;
    description: string;
    time: string;
}) {

    return (

        <div className="flex items-start gap-3">

            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}>
                {icon}
            </div>


            <div className="min-w-0 flex-1">

                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {title}
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {description}
                </p>

            </div>


            <span className="whitespace-nowrap text-[10px] text-slate-400 dark:text-slate-500">
        {time}
      </span>

        </div>

    );
}


// =====================================================
// QUICK ACTION
// =====================================================

function QuickAction({
                         href,
                         icon,
                         title,
                         description,
                         iconStyle,
                     }: {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    iconStyle: string;
}) {

    return (

        <Link
            href={href}
            className="
        group
        flex
        items-center
        gap-3
        rounded-lg
        border
        border-slate-100
        dark:border-slate-700
        p-3
        transition
        hover:border-blue-100
        dark:hover:border-blue-800
        hover:bg-slate-50
        dark:hover:bg-slate-700/50
      "
        >

            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}>
                {icon}
            </div>


            <div className="min-w-0 flex-1">

                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-slate-400 dark:text-slate-500">
                    {description}
                </p>

            </div>


            <ArrowRight
                size={14}
                className="
          text-slate-300
          dark:text-slate-600
          transition
          group-hover:translate-x-0.5
          group-hover:text-blue-600
          dark:group-hover:text-blue-400
        "
            />

        </Link>

    );
}