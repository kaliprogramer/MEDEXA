"use client";

import {
    Activity,
    AlertCircle,
    ArrowDown,
    ArrowUp,
    BarChart3,
    CheckCircle2,
    Clock3,
    Code2,
    Database,
    Gauge,
    MoreHorizontal,
    Server,
    TrendingUp,
    XCircle,
} from "lucide-react";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

/* =========================================================
   MOCK DATA
========================================================= */

const requestData = [
    { day: "Mon", requests: 1200, errors: 32 },
    { day: "Tue", requests: 1850, errors: 45 },
    { day: "Wed", requests: 1600, errors: 28 },
    { day: "Thu", requests: 2400, errors: 61 },
    { day: "Fri", requests: 3100, errors: 72 },
    { day: "Sat", requests: 2700, errors: 41 },
    { day: "Sun", requests: 3600, errors: 52 },
];

const endpointData = [
    {
        endpoint: "/heartdisease/predict",
        requests: 5421,
        percentage: 43,
        latency: "82ms",
    },
    {
        endpoint: "/diabetes/predict",
        requests: 3820,
        percentage: 30,
        latency: "74ms",
    },
    {
        endpoint: "/stroke/predict",
        requests: 1982,
        percentage: 16,
        latency: "91ms",
    },
    {
        endpoint: "/lung-disease/predict",
        requests: 1120,
        percentage: 9,
        latency: "143ms",
    },
    {
        endpoint: "/chronic-kidney/predict",
        requests: 840,
        percentage: 7,
        latency: "68ms",
    },
];

const statusData = [
    {
        name: "2xx Success",
        value: 12201,
    },
    {
        name: "4xx Client Error",
        value: 214,
    },
    {
        name: "5xx Server Error",
        value: 67,
    },
];

const recentRequests = [
    {
        id: "req_8f93a2",
        endpoint: "/heartdisease/predict",
        method: "POST",
        status: 200,
        latency: "82ms",
        time: "2 min ago",
    },
    {
        id: "req_2a91fd",
        endpoint: "/diabetes/predict",
        method: "POST",
        status: 200,
        latency: "74ms",
        time: "4 min ago",
    },
    {
        id: "req_72cd11",
        endpoint: "/stroke/predict",
        method: "POST",
        status: 422,
        latency: "31ms",
        time: "7 min ago",
    },
    {
        id: "req_91ad21",
        endpoint: "/lung-disease/predict",
        method: "POST",
        status: 200,
        latency: "143ms",
        time: "9 min ago",
    },
    {
        id: "req_1a82cc",
        endpoint: "/heartdisease/predict",
        method: "POST",
        status: 500,
        latency: "215ms",
        time: "12 min ago",
    },
];

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatCard({
                      title,
                      value,
                      change,
                      icon: Icon,
                      description,
                      positive = true,
                  }: {
    title: string;
    value: string;
    change?: string;
    icon: any;
    description: string;
    positive?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {value}
                    </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
                {change && (
                    <span
                        className={`flex items-center gap-1 text-xs font-semibold ${
                            positive ? "text-emerald-500" : "text-red-500"
                        }`}
                    >
            {positive ? (
                <ArrowUp className="h-3.5 w-3.5" />
            ) : (
                <ArrowDown className="h-3.5 w-3.5" />
            )}

                        {change}
          </span>
                )}

                <span className="text-xs text-slate-400">{description}</span>
            </div>
        </div>
    );
}

function SectionHeader({
                           title,
                           description,
                           action,
                       }: {
    title: string;
    description?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="mb-5 flex items-center justify-between">
            <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>

            {action}
        </div>
    );
}

/* =========================================================
   PAGE
========================================================= */

export default function ApiUsagePage() {
    return (
        <div className="mt-18 min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
            <div>
                {/* =================================================
            API KEY / PLAN BAR
        ================================================= */}



                {/* =================================================
            STAT CARDS
        ================================================= */}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Requests"
                        value="12,482"
                        change="18.4%"
                        description="vs previous period"
                        icon={Activity}
                    />

                    <StatCard
                        title="Successful Requests"
                        value="12,201"
                        change="17.8%"
                        description="vs previous period"
                        icon={CheckCircle2}
                    />

                    <StatCard
                        title="Error Rate"
                        value="2.25%"
                        change="0.42%"
                        description="vs previous period"
                        icon={AlertCircle}
                        positive={false}
                    />

                    <StatCard
                        title="Avg. Latency"
                        value="86ms"
                        change="8.2%"
                        description="faster than last period"
                        icon={Clock3}
                    />
                </div>

                {/* =================================================
            REQUEST CHART
        ================================================= */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <SectionHeader
                        title="API Requests"
                        description="Requests and errors over the selected period."
                        action={
                            <div className="hidden items-center gap-4 sm:flex">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                                    Requests
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="h-2 w-2 rounded-full bg-red-500" />
                                    Errors
                                </div>
                            </div>
                        }
                    />

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={requestData}>
                                <defs>
                                    <linearGradient
                                        id="requestGradient"
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
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                    }}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                    }}
                                />

                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: "1px solid #1e293b",
                                        background: "#020617",
                                        color: "#fff",
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="requests"
                                    strokeWidth={2}
                                    stroke="#3b82f6"
                                    fill="url(#requestGradient)"
                                />

                                <Area
                                    type="monotone"
                                    dataKey="errors"
                                    strokeWidth={2}
                                    stroke="#ef4444"
                                    fill="transparent"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* =================================================
            RATE LIMIT + STATUS
        ================================================= */}

                <div className="mb-6 grid gap-6 lg:grid-cols-2">

                    {/* RATE LIMIT */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <SectionHeader
                            title="Rate Limit Usage"
                            description="Current API request quota."
                        />

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold">
                                    487
                                    <span className="text-base font-normal text-slate-400">
                    {" "}
                                        / 500
                  </span>
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    requests used this minute
                                </p>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-orange-500/20">
                                <Gauge className="h-6 w-6 text-orange-500" />
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-500">
                  97.4% used
                </span>

                                <span className="font-medium text-orange-500">
                  13 remaining
                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                    className="h-full rounded-full bg-orange-500"
                                    style={{ width: "97.4%" }}
                                />
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-3">
                            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                                <p className="text-xs text-slate-400">
                                    Per minute
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    500
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                                <p className="text-xs text-slate-400">
                                    Per day
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    24K
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                                <p className="text-xs text-slate-400">
                                    Monthly
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    250K
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* STATUS */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <SectionHeader
                            title="Response Status"
                            description="Distribution of API responses."
                        />

                        <div className="flex items-center gap-8">
                            <div className="h-[190px] w-[190px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={4}
                                        >
                                            {statusData.map((_, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        index === 0
                                                            ? "#22c55e"
                                                            : index === 1
                                                                ? "#f59e0b"
                                                                : "#ef4444"
                                                    }
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex-1 space-y-4">
                                {statusData.map((status, index) => (
                                    <div key={status.name}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                        <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                                background:
                                    index === 0
                                        ? "#22c55e"
                                        : index === 1
                                            ? "#f59e0b"
                                            : "#ef4444",
                            }}
                        />

                                                <span className="text-xs text-slate-500">
                          {status.name}
                        </span>
                                            </div>

                                            <span className="text-sm font-semibold">
                        {status.value.toLocaleString()}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================
            ENDPOINT ANALYTICS
        ================================================= */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <SectionHeader
                        title="Endpoint Usage"
                        description="Most frequently used prediction endpoints."
                    />

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={endpointData}
                                layout="vertical"
                                margin={{
                                    left: 20,
                                    right: 20,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={false}
                                    className="stroke-slate-200 dark:stroke-slate-800"
                                />

                                <XAxis
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    dataKey="endpoint"
                                    type="category"
                                    width={190}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 11,
                                    }}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="requests"
                                    fill="#3b82f6"
                                    radius={[0, 6, 6, 0]}
                                    barSize={25}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* =================================================
            ENDPOINT TABLE
        ================================================= */}

                <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="p-5">
                        <SectionHeader
                            title="Endpoint Performance"
                            description="Request volume and average response time."
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left">
                            <thead className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                                    Endpoint
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                                    Requests
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                                    Usage
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                                    Avg. Latency
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                                    Status
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {endpointData.map((item) => (
                                <tr
                                    key={item.endpoint}
                                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                                >
                                    <td className="px-5 py-4">
                                        <code className="text-xs text-slate-700 dark:text-slate-300">
                                            {item.endpoint}
                                        </code>
                                    </td>

                                    <td className="px-5 py-4 text-sm font-medium">
                                        {item.requests.toLocaleString()}
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                <div
                                                    className="h-full rounded-full bg-blue-500"
                                                    style={{
                                                        width: `${item.percentage}%`,
                                                    }}
                                                />
                                            </div>

                                            <span className="text-xs text-slate-500">
                          {item.percentage}%
                        </span>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" />
                          {item.latency}
                      </span>
                                    </td>

                                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-500">
                        <CheckCircle2 className="h-3 w-3" />
                        Healthy
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* =================================================
            RECENT REQUESTS
        ================================================= */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="p-5">
                        <SectionHeader
                            title="Recent API Requests"
                            description="Latest requests made using your API key."
                            action={
                                <button className="text-xs font-medium text-blue-500 hover:underline">
                                    View all
                                </button>
                            }
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left">
                            <thead className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                                    Request ID
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                                    Endpoint
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                                    Latency
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                                    Time
                                </th>

                                <th />
                            </tr>
                            </thead>

                            <tbody>
                            {recentRequests.map((request) => {
                                const success = request.status === 200;

                                return (
                                    <tr
                                        key={request.id}
                                        className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                                    >
                                        <td className="px-5 py-4">
                                            <code className="text-xs text-slate-500">
                                                {request.id}
                                            </code>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                          <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-500">
                            {request.method}
                          </span>

                                                <code className="text-xs">
                                                    {request.endpoint}
                                                </code>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                        <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
                                success
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : request.status === 422
                                        ? "bg-orange-500/10 text-orange-500"
                                        : "bg-red-500/10 text-red-500"
                            }`}
                        >
                          {success ? (
                              <CheckCircle2 className="h-3 w-3" />
                          ) : request.status === 422 ? (
                              <AlertCircle className="h-3 w-3" />
                          ) : (
                              <XCircle className="h-3 w-3" />
                          )}

                            {request.status}
                        </span>
                                        </td>

                                        <td className="px-5 py-4 text-xs text-slate-500">
                                            {request.latency}
                                        </td>

                                        <td className="px-5 py-4 text-xs text-slate-500">
                                            {request.time}
                                        </td>

                                        <td className="px-5 py-4">
                                            <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* =================================================
            FOOTER
        ================================================= */}

                <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row dark:border-slate-800">
                    <p>
                        DoctRisk API Analytics
                    </p>

                    <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Server className="h-3.5 w-3.5" />
              API Operational
            </span>

                        <span className="flex items-center gap-1 text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All systems normal
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}