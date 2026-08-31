"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    History,
    Package,
    Plus,
    ShieldCheck,
    Stethoscope,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";

import { useAuth } from "@/context/AuthContext";

import {
    get_Totalpatients,
    get_Totaldoctors,
    get_OutOfStockTotal,
    get_StockTotal,
    get_patientAnalytics,
    get_genderanalytic,
    get_stockanalytic,
    get_lowstock,
    get_recentpatients
} from "@/app/lib/api/analytic_api";
// ============================================================
// TYPES
// ============================================================

type Patient = {
    id?: number;
    name: string;
    gender?: string;
    age?: number;
    phone?: string;
    created_at?: string;
};

type InventoryItem = {
    id?: number;
    name: string;
    quantity: number;
    item_type?: string;
};

type Doctor = {
    id?: number;
    name: string;
    specialization?: string;
};


// ============================================================
// DEMO DATA
// Replace these with your Django API data later.
// ============================================================




const recentPatients: Patient[] = [
    {
        id: 1,
        name: "Michael Brown",
        gender: "Male",
        age: 42,
        phone: "+977 9800000000",
    },
    {
        id: 2,
        name: "Sarah Wilson",
        gender: "Female",
        age: 35,
        phone: "+977 9811111111",
    },
    {
        id: 3,
        name: "Robert Davis",
        gender: "Male",
        age: 51,
        phone: "+977 9822222222",
    },
    {
        id: 4,
        name: "Emily Johnson",
        gender: "Female",
        age: 29,
        phone: "+977 9833333333",
    },
];



// ============================================================
// MAIN DASHBOARD
// ============================================================

export default function DashboardBody() {
    const { user } = useAuth();
    const [totalPatientNumber,settotalPatientNumber] = useState("")
    const [totalDoctorNumber,settotalDoctorNumber] = useState("")
    const [patientAnalytics,setpatientAnalytics] = useState([])
    const [username, setUsername] = useState("Doctor");
    const [genderData,setgenderData] = useState([])
    const [inventoryData,setinventoryData] = useState([])
    const [lowStockItems,setlowStockItems] = useState([])
    const [recentPatients,setrecentPatients] = useState([])
    useEffect(() => {
        const fetchrecentPatients = async () => {
            try {
                const data = await get_recentpatients();
                setrecentPatients(data);
            } catch (error) {
                console.error("Failed to fetch stock analytics:", error);
            }
        };

        fetchrecentPatients();
    },[]);
    useEffect(() => {
        const fetchlowstock = async () => {
            try {
                const data = await get_lowstock();
                setlowStockItems(data);
            } catch (error) {
                console.error("Failed to fetch stock analytics:", error);
            }
        };

        fetchlowstock();
    },[]);
    useEffect(() => {
        if (user?.username) {
            setUsername(user.username);
        }
    }, [user]);
    useEffect(() => {
        const fetchTotalPatients = async () => {
            try {
                const data = await get_Totalpatients();

                settotalPatientNumber(data);
                console.log(data);
            } catch (error) {
                console.error("Failed to fetch total patients:", error);
            }
        };

        fetchTotalPatients();
    }, []);

    useEffect(() => {
        const fetchTotalDoctors = async () => {
            try {
                const data = await get_Totaldoctors();

                settotalDoctorNumber(data);
                console.log(data);
            } catch (error) {
                console.error("Failed to fetch total patients:", error);
            }
        };

        fetchTotalDoctors()
    }, []);



    const [outOfStockTotal, setOutOfStockTotal] = useState(0);

    useEffect(() => {
        const fetchOutOfStock = async () => {
            try {
                const data = await get_OutOfStockTotal();
                setOutOfStockTotal(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOutOfStock();
    }, []);




    const [StockTotal, setStockTotal] = useState(0);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const data = await get_StockTotal();
                setStockTotal(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStock();
    }, []);


    useEffect(() => {
        const fetchStock = async () => {
            try {
                const data = await get_patientAnalytics();
                setpatientAnalytics(data);
            } catch (error) {

                console.error(error);
            }
        };

        fetchStock();
    }, []);

        useEffect(() => {
            const fetchgender = async () => {
                try {
                    const data = await get_genderanalytic();
                    setgenderData(data);
                } catch (error) {

                    console.error(error);
                }
            };

            fetchgender();
    }, []);
    useEffect(() => {
        const fetchStockAnalytics = async () => {
            try {
                const data = await get_stockanalytic();
                setinventoryData(data);
            } catch (error) {
                console.error("Failed to fetch stock analytics:", error);
            }
        };

        fetchStockAnalytics();
    }, []);
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>


                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Good morning, Dr. {username}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Manage your hospital, patients, doctors and inventory.
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:flex">
                        <CalendarDays size={16} />
                        <span>Today</span>
                    </div>

                    <Link
                        href="/dashboard/patients"
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <Plus size={17} />
                        Add Patient
                    </Link>

                </div>
            </div>


            {/* ==================================================
                STAT CARDS
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total Patients"
                    value={totalPatientNumber}
                    description="+12 this month"
                    icon={<Users size={20} />}
                    iconStyle="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    trend="up"
                />

                <StatCard
                    title="Total Doctors"
                    value={totalDoctorNumber}
                    description="Active medical staff"
                    icon={<Stethoscope size={20} />}
                    iconStyle="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                    trend="neutral"
                />

                <StatCard
                    title="Inventory Items"
                    value={StockTotal}
                    description="Across all categories"
                    icon={<Package size={20} />}
                    iconStyle="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    trend="up"
                />

                <StatCard
                    title="Low Stock"
                    value={outOfStockTotal}
                    description="Items need attention"
                    icon={<AlertTriangle size={20} />}
                    iconStyle="bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                    trend="down"
                />

            </div>


            {/* ==================================================
                ANALYTICS
            ================================================== */}

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* PATIENT ANALYTICS */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Patient Analytics
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Patient registrations over the last several months
                            </p>
                        </div>

                        <TrendingUp
                            size={18}
                            className="text-green-500"
                        />

                    </div>

                    <div className="mt-6 h-[280px] w-full">

                        <ResponsiveContainer width="100%" height="100%">

                            <AreaChart data={patientAnalytics}>

                                <defs>
                                    <linearGradient
                                        id="patientGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopOpacity={0.25}
                                        />

                                        <stop
                                            offset="95%"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    className="stroke-slate-200 dark:stroke-slate-800"
                                />

                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={11}
                                />

                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={11}
                                />

                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "1px solid #e2e8f0",
                                        fontSize: "12px",
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="patients"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    fill="url(#patientGradient)"
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* GENDER ANALYTICS */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Patient Distribution
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Patient gender distribution
                        </p>
                    </div>

                    <div className="mt-4 h-[210px]">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie
                                    data={genderData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={78}
                                    paddingAngle={4}
                                >

                                    {genderData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                [
                                                    "#2563eb",
                                                    "#8b5cf6",
                                                    "#14b8a6",
                                                ][index]
                                            }
                                        />
                                    ))}

                                </Pie>

                                <Tooltip />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                    <div className="space-y-3">

                        {genderData.map((item, index) => (

                            <div
                                key={item.name}
                                className="flex items-center justify-between"
                            >

                                <div className="flex items-center gap-2">

                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                [
                                                    "#2563eb",
                                                    "#8b5cf6",
                                                    "#14b8a6",
                                                ][index],
                                        }}
                                    />

                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {item.name}
                                    </span>

                                </div>

                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {item.value}%
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            </div>


            {/* ==================================================
                INVENTORY ANALYTICS
            ================================================== */}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Inventory Overview
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Current stock by category
                            </p>
                        </div>

                        <Link
                            href="/dashboard/inventory"
                            className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400"
                        >
                            View inventory
                            <ArrowRight size={14} />
                        </Link>

                    </div>

                    <div className="mt-6 h-[250px]">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart data={inventoryData}>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={11}
                                />

                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={11}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="stock"
                                    fill="#2563eb"
                                    radius={[5, 5, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* LOW STOCK */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Low Stock
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Items requiring attention
                            </p>
                        </div>

                        <AlertTriangle
                            size={18}
                            className="text-red-500"
                        />

                    </div>

                    <div className="mt-5 space-y-3">

                        {lowStockItems.map((item) => (

                            <div
                                key={item.id}
                                className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 dark:border-slate-800"
                            >

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">
                                    <Package size={17} />
                                </div>

                                <div className="min-w-0 flex-1">

                                    <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        {item.name}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                        {item.item_type}
                                    </p>

                                </div>

                                <span className="text-xs font-semibold text-red-500">
                                    {item.quantity} left
                                </span>

                            </div>

                        ))}

                    </div>

                    <Link
                        href="/dashboard/inventory"
                        className="mt-4 flex items-center justify-center gap-1 rounded-lg bg-slate-50 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        Manage inventory
                        <ArrowRight size={13} />
                    </Link>

                </div>

            </div>


            {/* ==================================================
                DISEASE PREDICTION
            ================================================== */}

            <div className="mt-6">

                <div className="mb-4 flex items-center justify-between">

                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Disease Prediction
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Use the FastAPI-powered disease prediction tools
                        </p>
                    </div>

                    <Activity
                        size={18}
                        className="text-blue-500"
                    />

                </div>


                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                    <PredictionCard
                        title="Heart Disease"
                        description="Assess cardiovascular disease risk."
                        href="/dashboard/heart-disease"
                        icon={<Activity size={20} />}
                        iconStyle="bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                    />

                    <PredictionCard
                        title="Diabetes"
                        description="Analyze diabetes risk from clinical data."
                        href="/dashboard/diabetes"
                        icon={<Activity size={20} />}
                        iconStyle="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    />

                    <PredictionCard
                        title="Lung Disease"
                        description="Evaluate respiratory disease indicators."
                        href="/dashboard/lung-disease"
                        icon={<Activity size={20} />}
                        iconStyle="bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
                    />

                    <PredictionCard
                        title="Stroke"
                        description="Analyze stroke disease risk."
                        href="/dashboard/stroke"
                        icon={<Activity size={20} />}
                        iconStyle="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                    />

                    <PredictionCard
                        title="Pneumonia"
                        description="Analyze pneumonia from clinical data."
                        href="/dashboard/pneumonia"
                        icon={<Activity size={20} />}
                        iconStyle="bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    />

                </div>

            </div>


            {/* ==================================================
                RECENT PATIENTS
            ================================================== */}

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">

                    <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">

                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Recent Patients
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Recently registered patients
                            </p>
                        </div>

                        <Link
                            href="/dashboard/patients"
                            className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400"
                        >
                            View all
                            <ArrowRight size={14} />
                        </Link>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[600px]">

                            <thead className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">

                            <tr>

                                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                    Patient
                                </th>

                                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                    Gender
                                </th>

                                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                    Age
                                </th>

                                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                    Phone
                                </th>



                            </tr>

                            </thead>

                            <tbody>

                            {recentPatients.map((patient) => (

                                <tr
                                    key={patient.id}
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                >

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">

                                                {patient.name
                                                    .split(" ")
                                                    .map((name) => name[0])
                                                    .join("")}

                                            </div>

                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    {patient.name}
                                                </span>

                                        </div>

                                    </td>

                                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                                        {patient.gender || "-"}
                                    </td>

                                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                                        {patient.age || "-"}
                                    </td>

                                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                                        {patient.phone || "-"}
                                    </td>


                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* ==================================================
                    QUICK ACTIONS
                ================================================== */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Quick Actions
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Frequently used hospital tools
                    </p>


                    <div className="mt-5 space-y-3">

                        <QuickAction
                            href="/dashboard/patients"
                            title="Patients"
                            description="Manage patient records"
                            icon={<Users size={18} />}
                            iconStyle="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        />

                        <QuickAction
                            href="/dashboard/doctors"
                            title="Doctors"
                            description="Manage doctors and staff"
                            icon={<Stethoscope size={18} />}
                            iconStyle="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                        />

                        <QuickAction
                            href="/dashboard/inventory"
                            title="Inventory"
                            description="Manage hospital inventory"
                            icon={<Package size={18} />}
                            iconStyle="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        />

                        <QuickAction
                            href="/dashboard/history"
                            title="Prediction History"
                            description="View previous AI predictions"
                            icon={<History size={18} />}
                            iconStyle="bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                        />

                    </div>

                </div>

            </div>


            {/* ==================================================
                SYSTEM INFORMATION
            ================================================== */}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* DJANGO */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle2 size={20} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Hospital Management
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Django backend services
                            </p>
                        </div>

                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">

                        <SystemItem
                            name="Patients"
                            status="Active"
                        />

                        <SystemItem
                            name="Doctors"
                            status="Active"
                        />

                        <SystemItem
                            name="Inventory"
                            status="Active"
                        />

                    </div>

                </div>


                {/* FASTAPI */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Activity size={20} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Disease Prediction API
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                FastAPI prediction services
                            </p>
                        </div>

                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-900/20">

                        <div className="flex items-center gap-2">

                            <span className="h-2 w-2 rounded-full bg-green-500" />

                            <span className="text-xs font-medium text-green-700 dark:text-green-400">
                                Prediction service available
                            </span>

                        </div>

                        <span className="text-[10px] text-green-600 dark:text-green-400">
                            FastAPI
                        </span>

                    </div>

                </div>

            </div>


            {/* ==================================================
                MEDICAL DISCLAIMER
            ================================================== */}

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">

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
                        professionals. They should not replace clinical
                        judgment, diagnosis, or professional medical advice.
                    </p>

                </div>

            </div>

        </div>
    );
}


// ============================================================
// STAT CARD
// ============================================================

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
    trend: "up" | "down" | "neutral";
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

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

                {trend === "down" && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-red-500 dark:text-red-400">
                        <TrendingDown size={13} />
                        Attention
                    </span>
                )}

                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {description}
                </span>

            </div>

        </div>
    );
}


// ============================================================
// PREDICTION CARD
// ============================================================

function PredictionCard({
                            title,
                            description,
                            href,
                            icon,
                            iconStyle,
                        }: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    iconStyle: string;
}) {
    return (
        <Link
            href={href}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
        >

            <div className="flex items-start justify-between">

                <div className={`rounded-lg p-2.5 ${iconStyle}`}>
                    {icon}
                </div>

                <ArrowRight
                    size={16}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600 dark:text-slate-700 dark:group-hover:text-blue-400"
                />

            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                {title}
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                {description}
            </p>

            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                <Activity size={12} />
                Start prediction
            </div>

        </Link>
    );
}


// ============================================================
// QUICK ACTION
// ============================================================

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
            className="group flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition hover:border-blue-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-blue-900 dark:hover:bg-slate-800"
        >

            <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
            >
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
                className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400"
            />

        </Link>
    );
}


// ============================================================
// SYSTEM ITEM
// ============================================================

function SystemItem({
                        name,
                        status,
                    }: {
    name: string;
    status: string;
}) {
    return (
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">

            <div className="flex items-center gap-2">

                <CheckCircle2
                    size={14}
                    className="text-green-500"
                />

                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    {name}
                </span>

            </div>

            <p className="mt-1 text-[10px] text-green-600 dark:text-green-400">
                {status}
            </p>

        </div>
    );
}