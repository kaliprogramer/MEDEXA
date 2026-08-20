"use client";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";

import {
    HeartPulse,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Brain,
    Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8001/api';
        setLoading(true);
        setError("");
        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/login/`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json",},
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError("Invalid email or password");
                return;
            }            // console.log(data);


            sessionStorage.setItem("loginSuccess", "Login Successfully");
            router.push("/dashboard");

        } catch (e) {
            setError("Something went wrong");
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(error){
            toast.error(error);
        }
    }, [error]);
    useEffect(() => {
        if(success){
            toast.success(success);
        }
    }, [success]);

    return (
        <main className="min-h-screen bg-slate-50">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* ================================================= */}
                {/* LEFT SIDE - BRANDING */}
                {/* ================================================= */}

                <section className="relative hidden overflow-hidden bg-slate-950 lg:flex">

                    {/* Decorative background */}

                    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

                    <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />


                    <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

                        {/* Logo */}

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-40 items-center justify-center ">
                                <Image
                                    src="/Logo.png"
                                    alt="Clinora logo"
                                    width={200}
                                    height={200}
                                />
                            </div>

                            <div>
                                <h1 className="text-lg font-bold">
                                    <Image
                                        src="/logo_text.png"
                                        alt="Clinora logo"
                                        width={400}
                                        height={400}
                                    />
                                </h1>

                                <h1 className=" text-shadow-slate-100 pl-9 font-bold">
                                    Clinical AI Assistant and Management
                                </h1>
                            </div>
                        </div>


                        {/* Main content */}

                        <div className="max-w-xl">




                            <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">

                                Smarter clinical
                                <span className="text-blue-500">
                  {" "}insights.
                </span>

                            </h2>


                            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 xl:text-base">

                                Analyze patient information with AI-powered
                                prediction models designed to assist healthcare
                                professionals in making informed clinical decisions.

                            </p>


                            {/* Feature cards */}

                            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                <Feature
                                    icon={<Brain size={18} />}
                                    title="AI Models"
                                    description="Multiple disease models"
                                />

                                <Feature
                                    icon={<Activity size={18} />}
                                    title="Clinical Data"
                                    description="Patient analysis"
                                />

                                <Feature
                                    icon={<ShieldCheck size={18} />}
                                    title="Secure"
                                    description="Protected records"
                                />

                            </div>

                        </div>


                        {/* Bottom */}

                        <div className="flex items-center gap-2 text-xs text-slate-500">

                            <ShieldCheck size={14} />

                            Built for healthcare professionals

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* RIGHT SIDE - LOGIN */}
                {/* ================================================= */}

                <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

                    <div className="w-full max-w-md">

                        {/* Mobile logo */}

                        <div className="mb-10 flex items-center gap-3 lg:hidden">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                                <HeartPulse size={21} />
                            </div>

                            <div>

                                <h1 className="font-bold text-slate-900">
                                    MediPredict AI
                                </h1>

                                <p className="text-xs text-slate-400">
                                    Clinical AI Assistant
                                </p>

                            </div>

                        </div>


                        {/* Login heading */}

                        <div className="mb-8">

                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Welcome back
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Sign in to access your clinical dashboard.
                            </p>

                        </div>


                        {/* ================================================= */}
                        {/* LOGIN FORM */}
                        {/* ================================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Email */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Email address
                                </label>


                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                                    />


                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="doctor@example.com"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="
                      h-12
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      pl-11
                      pr-4
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                                    />

                                </div>

                            </div>


                            {/* Password */}

                            <div>

                                <div className="mb-2 flex items-center justify-between">

                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Password
                                    </label>


                                    <Link
                                        href="/forgot-password"
                                        className="
                      text-xs
                      font-medium
                      text-blue-600
                      hover:text-blue-700
                    "
                                    >
                                        Forgot password?
                                    </Link>

                                </div>


                                <div className="relative">

                                    <Lock
                                        size={18}
                                        className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                                    />


                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="
                      h-12
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      pl-11
                      pr-11
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-md
                      p-1
                      text-slate-400
                      transition
                      hover:text-slate-600
                    "
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* Remember me */}

                            <div className="flex items-center">

                                <label className="flex cursor-pointer items-center gap-2">

                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(e.target.checked)
                                        }
                                        className="
                      h-4
                      w-4
                      rounded
                      border-slate-300
                      text-blue-600
                      accent-blue-600
                      focus:ring-blue-500
                    "
                                    />

                                    <span className="text-sm text-slate-600">
                    Remember me
                  </span>

                                </label>

                            </div>


                            {/* Login button */}

                            <button
                                type="submit"
                                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  shadow-blue-600/20
                  transition
                  hover:bg-blue-700
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-500/20
                "
                            >

                                {loading ? "Logging in..." : "Login"}

                                <ArrowRight size={17} />

                            </button>

                        </form>


                        {/* Divider */}

                        <div className="my-7 flex items-center gap-4">

                            <div className="h-px flex-1 bg-slate-200" />

                            <span className="text-xs text-slate-400">
                OR
              </span>

                            <div className="h-px flex-1 bg-slate-200" />

                        </div>


                        {/* Google */}

                        <button
                            type="button"
                            className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-3
                rounded-lg
                border
                border-slate-200
                bg-white
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
              "
                        >

                            <GoogleIcon />

                            Continue with Google

                        </button>


                        {/* Register */}

                        <p className="mt-8 text-center text-sm text-slate-500">

                            Don't have an account?{" "}

                            <Link
                                href="/auth/Register"
                                className="font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Create an account
                            </Link>

                        </p>


                        {/* Disclaimer */}

                        <div className="mt-10 flex items-start gap-2 rounded-lg bg-slate-100 p-3.5">

                            <ShieldCheck
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-500"
                            />

                            <p className="text-[10px] leading-5 text-slate-500">

                                Your account and clinical data should be
                                protected according to your application's
                                security and privacy requirements.

                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}


// =====================================================
// FEATURE
// =====================================================

function Feature({
                     icon,
                     title,
                     description,
                 }) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                {icon}
            </div>

            <p className="text-xs font-semibold text-slate-200">
                {title}
            </p>

            <p className="mt-1 text-[10px] leading-4 text-slate-500">
                {description}
            </p>

        </div>
    );
}


// =====================================================
// GOOGLE ICON
// =====================================================

function GoogleIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                fill="#4285F4"
                d="M21.35 12.27c0-.68-.06-1.34-.17-1.97H12v3.73h5.22a4.46 4.46 0 0 1-1.94 2.92v2.42h3.14c1.84-1.7 2.93-4.2 2.93-7.1Z"
            />

            <path
                fill="#34A853"
                d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.42c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.5A9.75 9.75 0 0 0 12 21.75Z"
            />

            <path
                fill="#FBBC05"
                d="M6.53 13.86a5.86 5.86 0 0 1 0-3.72v-2.5H3.29a9.75 9.75 0 0 0 0 8.72l3.24-2.5Z"
            />

            <path
                fill="#EA4335"
                d="M12 6.11c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.22 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.39l3.24 2.5C7.3 7.83 9.46 6.11 12 6.11Z"
            />
        </svg>
    );
}