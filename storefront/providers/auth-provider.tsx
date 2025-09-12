"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { AccountType } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios-client";
import { SignInSchema, SignUpSchema } from "@/lib/zod";
import { toast } from "sonner";
import { storage } from "@/lib/local-storage";

interface AuthContextType {
    user: AccountType | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    isSigningIn: boolean;
    isSigningUp: boolean;
    isSigningUpAsPartner: boolean;
    isSigningOut: boolean;
    signIn: (credentials: SignInSchema) => Promise<void>;
    signUp: (userData: SignUpSchema) => Promise<void>;
    signUpAsPartner: (userData: SignUpSchema) => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AccountType | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const queryClient = useQueryClient();

    // 🔑 Login
    const { mutateAsync: login, isPending: isSigningIn } = useMutation({
        mutationFn: async (credentials: SignInSchema) => {
            const { data } = await api.post("/api/v1/auth/login", credentials);
            return data.data;
        },
        onSuccess: (data) => {
            storage.authenticateUser(data.accessToken);
            setUser(data);
            setIsAuthenticated(true);
            queryClient.setQueryData(["user"], data);
            toast.success("Logged in successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Login failed");
        },
    });

    // 🔑 Register
    const { mutateAsync: register, isPending: isSigningUp } = useMutation({
        mutationFn: async (userData: SignUpSchema) => {
            const { data } = await api.post("/api/v1/auth/register", userData);
            return data.data;
        },
        onSuccess: (data) => {
            storage.authenticateUser(data.accessToken);
            setUser(data);
            setIsAuthenticated(true);
            queryClient.setQueryData(["user"], data);
            toast.success("Registered successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Registration failed");
        },
    });

    const { mutateAsync: registerAsPartner, isPending: isSigningUpAsPartner } = useMutation({
        mutationFn: async (userData: SignUpSchema) => {
            const { data } = await api.post("/api/v1/auth/register-as-partner", userData);
            return data.data;
        },
        onSuccess: (data) => {
            storage.authenticateUser(data.accessToken);
            setUser(data);
            setIsAuthenticated(true);
            queryClient.setQueryData(["user"], data);
            toast.success("Registered successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Registration failed");
        },
    });

    // 🔑 Logout
    const { mutateAsync: logout, isPending: isSigningOut } = useMutation<void>({
        mutationFn: async () => {
            return api.post("/api/v1/auth/logout");
        },
        onSuccess: () => {
            storage.clearAll();
            setUser(null);
            setIsAuthenticated(false);
            queryClient.clear();
            toast.success("Logged out successfully");
            window.location.href = "/sign-in";
        },
        onError: () => {
            storage.clearAll();
            setUser(null);
            setIsAuthenticated(false);
            queryClient.clear();
        },
    });

    // 🔑 Get current user
    const getCurrentUser = useQuery<AccountType>({
        queryKey: ["user"],
        queryFn: async () => {
            const token = storage.accessToken;
            if (!token) throw new Error("No access token");
            const { data } = await api.get("/api/v1/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data.data;
        },
        enabled: false,
        retry: false,
    });

    // 🔄 On mount, check if user is already logged in
    useEffect(() => {
        const token = storage.accessToken;
        if (!token) {
            setIsCheckingAuth(false);
            return;
        }

        getCurrentUser.refetch()
            .then(({ data }) => {
                if (data) {
                    setUser(data);
                    setIsAuthenticated(true);
                }
            })
            .catch(() => {
                storage.clearAll();
                setUser(null);
                setIsAuthenticated(false);
            })
            .finally(() => setIsCheckingAuth(false));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isCheckingAuth,
                isSigningIn,
                isSigningUp,
                isSigningUpAsPartner,
                isSigningOut,
                signIn: login,
                signUp: register,
                signUpAsPartner: registerAsPartner,
                signOut: logout,
                refreshUser: () => getCurrentUser.refetch(),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
