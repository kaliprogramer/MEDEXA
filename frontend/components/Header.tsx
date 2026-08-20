"use client";

import { useEffect, useState } from "react";
import {useAuth} from "@/context/AuthContext";
import {
    Search,
    Bell,
    Mail,
    Sun,
    Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {useRouter} from "next/navigation";
interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const router = useRouter();
    const {
        user,
        loading,
        isAuthenticated,
        logout
    } = useAuth();
    async function HandleLogout() {
        await logout();

        router.replace("/auth/Login");
    }
    async function HandleLogin() {
        router.replace("/auth/Login");
    }
    const { theme, setTheme } = useTheme();

    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Toggle light / dark theme
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header

            className="
                fixed
                right-0
                top-0
                z-30
                h-[70px]
                border-b
                border-slate-200
                bg-white
                dark:border-slate-700
                dark:bg-[#030616]
                lg:left-64
            "
        >
            <div
                className="
                    flex
                    h-full
                    items-center
                    justify-between
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >


                {/* ================================================= */}
                {/* LEFT */}
                {/* ================================================= */}

                <div className="flex items-center gap-4">

                    {/* Mobile menu button */}
                    {onMenuClick && (
                        <button
                            type="button"
                            onClick={onMenuClick}
                            className="
                                rounded-lg
                                p-2
                                text-slate-600
                                transition
                                hover:bg-slate-100
                                dark:text-slate-300
                                dark:hover:bg-slate-800
                                lg:hidden
                            "
                            aria-label="Open menu"
                        >
                            <span className="text-lg">☰</span>
                        </button>
                    )}

                </div>


                {/* ================================================= */}
                {/* SEARCH */}
                {/* ================================================= */}

                <div
                    className="
                        hidden
                        max-w-md
                        flex-1
                        px-6
                        md:block
                    "
                >
                    <div className="relative">

                        <Search
                            size={19}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            placeholder="Search patients, reports..."
                            className="
                                h-10
                                w-full
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                pl-10
                                pr-4
                                text-sm
                                text-slate-700
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-blue-400
                                focus:ring-2
                                focus:ring-blue-100

                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:text-slate-200
                                dark:placeholder:text-slate-500
                                dark:focus:border-blue-500
                                dark:focus:ring-blue-900/30
                            "
                        />

                    </div>
                </div>


                {/* ================================================= */}
                {/* RIGHT */}
                {/* ================================================= */}

                <div className="flex items-center gap-2 sm:gap-4">

                    {/* ================================================= */}
                    {/* MOBILE SEARCH */}
                    {/* ================================================= */}

                    <button
                        type="button"
                        className="
                            rounded-lg
                            p-2
                            text-slate-600
                            transition
                            hover:bg-slate-100

                            dark:text-slate-300
                            dark:hover:bg-slate-800

                            md:hidden
                        "
                        aria-label="Search"
                    >
                        <Search size={20} />
                    </button>


                    {/* ================================================= */}
                    {/* NOTIFICATIONS */}
                    {/* ================================================= */}

                    <button
                        type="button"
                        className="
                            relative
                            rounded-lg
                            p-2
                            text-slate-600
                            transition
                            hover:bg-slate-100

                            dark:text-slate-300
                            dark:hover:bg-slate-800
                        "
                        aria-label="Notifications"
                    >
                        <Bell size={20} />

                        <span
                            className="
                                absolute
                                -right-0.5
                                -top-0.5
                                flex
                                h-4
                                min-w-4
                                items-center
                                justify-center
                                rounded-full
                                bg-red-500
                                px-1
                                text-[9px]
                                font-bold
                                text-white
                            "
                        >
                            3
                        </span>

                    </button>


                    {/* ================================================= */}
                    {/* MESSAGES */}
                    {/* ================================================= */}

                    <button
                        type="button"
                        className="
                            hidden
                            rounded-lg
                            p-2
                            text-slate-600
                            transition
                            hover:bg-slate-100

                            dark:text-slate-300
                            dark:hover:bg-slate-800

                            sm:block
                        "
                        aria-label="Messages"
                    >
                        <Mail size={20} />
                    </button>


                    {/* ================================================= */}
                    {/* THEME TOGGLE */}
                    {/* ================================================= */}

                    {mounted && (
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="
                                rounded-lg
                                p-2
                                text-slate-600
                                transition
                                hover:bg-slate-100

                                dark:text-slate-300
                                dark:hover:bg-slate-800
                            "
                            aria-label="Toggle theme"
                        >

                            {theme === "dark" ? (
                                <Sun size={20} />
                            ) : (
                                <Moon size={20} />
                            )}

                        </button>
                    )}
                    {isAuthenticated?<button
                        type="button"
                        onClick={HandleLogout}
                        className="
                                rounded-lg
                                p-2
                                text-slate-600
                                transition
                                hover:bg-slate-100

                                dark:text-slate-300
                                dark:hover:bg-slate-800
                            "
                        aria-label="Toggle theme"
                    >Logout</button>:<button
                        type="button"
                        onClick={HandleLogin}
                        className="
                                rounded-lg
                                p-2
                                text-slate-600
                                transition
                                hover:bg-slate-100

                                dark:text-slate-300
                                dark:hover:bg-slate-800
                            "
                        aria-label="Toggle theme"
                    >Login</button>}

                </div>

            </div>
        </header>
    );
}