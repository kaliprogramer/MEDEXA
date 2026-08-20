"use client"
import toast, { Toaster } from "react-hot-toast";
import {AuthProvider} from "@/context/AuthContext";
import {useEffect} from "react";
export default function RootLayout({children,}: { children: React.ReactNode; }) {
    useEffect(() => {
        const message = sessionStorage.getItem("loginFail");

        if (message) {
            toast.error(message);
            sessionStorage.removeItem("loginFail");
        }
    }, []);
    return (<>
             <Toaster position="top-right" />
                <AuthProvider>
                    {children}
                </AuthProvider>
        </>
    );
}