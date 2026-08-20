"use client";
import DashboardBody from "@/app/dashboard/dashboard_body";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import toast from "react-hot-toast";
function page() {
    const router = useRouter();

    const {
        user,
        loading,
        isAuthenticated,
    } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace("/auth/Login");
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }
    useEffect(() => {
        const message = sessionStorage.getItem("loginSuccess");

        if (message) {
            toast.success(message);
            sessionStorage.removeItem("loginSuccess");
        }
    }, []);

    return (
    <>
      <div className={`mt-20 mb-6 dark:bg-`}>
        <DashboardBody/>
      </div>
    </>
  )
}

export default page