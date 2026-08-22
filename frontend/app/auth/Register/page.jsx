"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import {
    HeartPulse,
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Stethoscope,
    Building2,
    ArrowRight,
    ShieldCheck,
    Brain,
    Activity,
} from "lucide-react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agree, setAgree] = useState(false);
    const [username, setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [Organization_name,setOrganization_name] = useState("");
    const [Specialization, setSpecialization] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter()
    async function handleSubmit(event) {
        event.preventDefault();
        // toast.error("This didn't work.")
        const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8001/api';
        setLoading(true);
        if (password === confirmPassword) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/auth/register/`,
                    {
                        method: "POST",
                        headers: {"Content-Type": "application/json",},
                        body: JSON.stringify({
                            username,
                            email,
                            Organization_name,
                            Specialization,
                            password,
                        }),
                    }
                );
                const data = {
                    "username": username,
                    "email": email,
                    "Organization_name": Organization_name,
                    "Specialization": Specialization,
                    "password": password
                }


                console.log(data)

                if (!response.ok) {
                    // Django validation error
                    if (data.email) {
                        toast.error("Email already exists");
                    } else if (data.username) {
                        toast.error("Username already exists");
                    } else {
                        toast.error("Registration failed");
                    }

                    return;
                }
                console.log(data);
                router.push("/auth/Login");
                setSuccess("Account created Successfully")

            } catch (e) {
                setError("Something went wrong");
                console.log(e)
            } finally {
                setLoading(false);
            }
        }else {
            setLoading(true);
            setError("Passwords and confirm password don't match");
        }
    }
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);
    useEffect(() => {
        if (success) {
            toast.success(success);
        }
    }, [success]);


    return (

        <main className="min-h-screen bg-slate-50">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* ================================================= */}
                {/* LEFT SIDE */}
                {/* ================================================= */}

                <section className="relative hidden overflow-hidden bg-slate-950 lg:flex">

                    {/* Background decoration */}

                    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

                    <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />


                    <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

                        {/* Logo */}

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-40 items-center justify-center ">
                                <Image
                                    src="/logo_enhance.png"
                                    alt="Clinora logo"
                                    width={200}
                                    height={200}
                                />
                            </div>

                            <div>
                                <h1 className="text-lg font-bold">
                                    <Image
                                        src="/logo_text_enhance.png"
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

                                Bring AI into
                                <span className="text-blue-500">
                  {" "}your clinical workflow.
                </span>

                            </h2>


                            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 xl:text-base">

                                Create your professional account and access
                                AI-powered disease prediction tools, patient
                                analysis, prediction history, and clinical reports.

                            </p>


                            {/* Features */}

                            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                <Feature
                                    icon={<Brain size={18} />}
                                    title="AI Models"
                                    description="Multiple prediction models"
                                />

                                <Feature
                                    icon={<Activity size={18} />}
                                    title="Analytics"
                                    description="Track clinical insights"
                                />

                                <Feature
                                    icon={<ShieldCheck size={18} />}
                                    title="Secure"
                                    description="Protected workspace"
                                />

                            </div>

                        </div>


                        {/* Bottom */}

                        <div className="flex items-center gap-2 text-xs text-slate-500">

                            <ShieldCheck size={14} />

                            Secure clinical workspace

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* RIGHT SIDE */}
                {/* ================================================= */}

                <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

                    <div className="w-full max-w-md">

                        {/* Mobile logo */}

                        <div className="mb-8 flex items-center gap-3 lg:hidden">

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


                        {/* Heading */}

                        <div className="mb-7">

                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Create your account
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Set up your professional account to get started.
                            </p>

                        </div>


                        {/* ================================================= */}
                        {/* FORM */}
                        {/* ================================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >

                            {/* Full name */}

                            <div>

                                <label
                                    htmlFor="fullName"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Full name
                                </label>


                                <div className="relative">

                                    <User
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
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Dr. John Smith"
                                        onChange={(e)=>{setUsername(e.target.value)}}
                                        required
                                        className="
                      h-11
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


                            {/* Email */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Professional email
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
                                        onChange={(e)=>{setEmail(e.target.value)}}
                                        placeholder="doctor@example.com"
                                        required
                                        className="
                      h-11
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


                            {/* Professional information */}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                {/* Specialization */}

                                <div>

                                    <label
                                        htmlFor="specialization"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Specialization
                                    </label>


                                    <div className="relative">

                                        <Stethoscope
                                            size={17}
                                            className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                                        />


                                        <select
                                            id="specialization"
                                            name="specialization"
                                            required
                                            onChange={(e)=>{setSpecialization(e.target.value)}}
                                            defaultValue=""
                                            className="
                        h-11
                        w-full
                        appearance-none
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        pl-11
                        pr-3
                        text-sm
                        text-slate-700
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                                        >

                                            <option value="" disabled>
                                                Select
                                            </option>

                                            <option value={"Cardiology"}>Cardiology</option>
                                            <option value={"Endocrinology"}>Endocrinology</option>
                                            <option value={"Pulmonology"}>Pulmonology</option>
                                            <option value={"Radiology"}>Radiology</option>
                                            <option value={"General"}>General Medicine</option>
                                            <option value={"Other"}>Other</option>

                                        </select>

                                    </div>

                                </div>


                                {/* Organization */}

                                <div>

                                    <label
                                        htmlFor="organization"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Organization
                                    </label>


                                    <div className="relative">

                                        <Building2
                                            size={17}
                                            className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                                        />


                                        <input
                                            id="organization"
                                            name="organization"
                                            type="text"
                                            onChange={(e)=>{setOrganization_name(e.target.value)}}
                                            placeholder="Hospital / Clinic"
                                            className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        pl-11
                        pr-3
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

                            </div>


                            {/* Password */}

                            <div>

                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>


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
                                        autoComplete="new-password"
                                        placeholder="Create a strong password"
                                        onChange={(e)=>{setPassword(e.target.value)}}

                                        required
                                        minLength={8}
                                        className="
                      h-11
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
                      p-1
                      text-slate-400
                      hover:text-slate-600
                    "
                                    >

                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}

                                    </button>

                                </div>


                                <p className="mt-1.5 text-[10px] text-slate-400">
                                    Use at least 8 characters with a mix of letters,
                                    numbers, and symbols.
                                </p>

                            </div>


                            {/* Confirm password */}

                            <div>

                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Confirm password
                                </label>


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
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        placeholder="Confirm your password"
                                        onChange={(e)=>{setConfirmPassword(e.target.value)}}

                                        required
                                        minLength={8}
                                        className="
                      h-11
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
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      p-1
                      text-slate-400
                      hover:text-slate-600
                    "
                                    >

                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* Terms */}

                            <div className="pt-1">

                                <label className="flex cursor-pointer items-start gap-2.5">

                                    <input
                                        type="checkbox"
                                        checked={agree}
                                        onChange={(e) =>
                                            setAgree(e.target.checked)
                                        }
                                        required
                                        className="
                      mt-0.5
                      h-4
                      w-4
                      shrink-0
                      rounded
                      border-slate-300
                      accent-blue-600
                    "
                                    />


                                    <span className="text-xs leading-5 text-slate-500">

                    I agree to the{" "}

                                        <Link
                                            href="/terms"
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                      Terms of Service
                    </Link>

                                        {" "}and{" "}

                                        <Link
                                            href="/privacy"
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                      Privacy Policy
                    </Link>

                    .

                  </span>

                                </label>

                            </div>


                            {/* Create account */}

                            <button
                                type="submit"
                                disabled={!agree}
                                className="
                  flex
                  h-11
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
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-500/20
                "
                            >

                                {loading?"Creating account": "Create account"}

                                <ArrowRight size={17} />

                            </button>

                        </form>


                        {/* Login */}

                        <p className="mt-7 text-center text-sm text-slate-500">

                            Already have an account?{" "}

                            <Link
                                href="/auth/Login"
                                className="font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Sign in
                            </Link>

                        </p>


                        {/* Security note */}

                        <div className="mt-7 flex items-start gap-2 rounded-lg bg-slate-100 p-3.5">

                            <ShieldCheck
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-500"
                            />

                            <p className="text-[10px] leading-5 text-slate-500">

                                Account security and protection of clinical
                                information depend on the authentication,
                                authorization, encryption, and data-protection
                                controls implemented by your backend.

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