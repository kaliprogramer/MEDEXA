"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {Toaster} from "react-hot-toast";

function DashboardContent({
                              children,
                          }: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const {
        user,
        loading,
        isAuthenticated,
    } = useAuth();

    useEffect(() => {
        console.log(user)
        if (!loading && !isAuthenticated) {

            sessionStorage.setItem("loginFail","Not authenticated please login");
            router.replace("/auth/Login");
        }
    }, [loading, isAuthenticated, router]);

    // Check authentication
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <p className="text-slate-700 dark:text-slate-200">
                    Checking authentication...
                </p>
            </div>
        );
    }

    // Redirecting to login
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Header />
            <Toaster position="top-right"/>

            <Sidebar />

            <main className="min-h-screen ml-0 lg:ml-64 p-4 pt-1">
                {children}
            </main>
        </div>
    );
}

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <DashboardContent>
                {children}
            </DashboardContent>
        </AuthProvider>
    );
}