"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
    email: string;
    username: string;
    Organization_name: string;
    Specialization: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL =
    process.env.NEXT_PUBLIC_DJANGO_API_URL ||
    "http://localhost:8001/api";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    // -----------------------------------------
    // Refresh access token
    // -----------------------------------------
    async function refreshAccessToken(): Promise<boolean> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/refresh/`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                return false;
            }

            return true;
        } catch (error) {
            console.error("Token refresh failed:", error);
            return false;
        }
    }

    // -----------------------------------------
    // Get current user
    // -----------------------------------------
    async function getCurrentUser(): Promise<boolean> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/me/`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            // Access token is still valid
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                return true;
            }

            // Access token expired
            if (response.status === 401) {
                console.log("Access token expired. Refreshing...");

                const refreshed = await refreshAccessToken();

                // Refresh token also expired/invalid
                if (!refreshed) {
                    setUser(null);
                    return false;
                }

                // Try /me again with new access token
                const retryResponse = await fetch(
                    `${API_BASE_URL}/auth/me/`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!retryResponse.ok) {
                    setUser(null);
                    return false;
                }

                const data = await retryResponse.json();

                setUser(data);

                return true;
            }

            setUser(null);
            return false;

        } catch (error) {
            console.error("Authentication check failed:", error);
            setUser(null);
            return false;
        }
    }

    // -----------------------------------------
    // Initial authentication check
    // -----------------------------------------
    useEffect(() => {
        async function checkAuth() {
            const authenticated = await getCurrentUser();

            if (!authenticated) {
                router.replace("/auth/Login");
            }

            setLoading(false);
        }

        checkAuth();
    }, []);

    // -----------------------------------------
    // Logout
    // -----------------------------------------
    async function logout() {
        try {
            await fetch(
                `${API_BASE_URL}/auth/logout/`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
            router.replace("/auth/Login");
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}