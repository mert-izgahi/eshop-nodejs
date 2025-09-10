"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { IAccount } from "@/types";
import { usePathname } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';
import { SignInSchema, SignUpSchema } from '@/lib/zod';
import { toast } from 'sonner';
import { storage } from '@/lib/local-storage';

interface AuthContextType {
    user: IAccount | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    isSigningIn: boolean;
    isSigningUp: boolean;
    isSigningOut: boolean;
    isAdmin?: boolean;
    hasAdminAccess?: boolean;
    isSeller?: boolean;
    isCustomer?: boolean;
    signIn: (credentials: SignInSchema) => Promise<void>;
    signUp: (userData: SignUpSchema) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ProtectedRoutes = ['/profile', '/orders', '/settings'];
const AuthRoutes = ['/sign-in', '/sign-up'];
const AdminPrefix = '/admin';
const SellerPrefix = '/seller';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IAccount | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [isCustomer, setIsCustomer] = useState(false);

    const pathname = usePathname();
    const queryClient = useQueryClient();

    const isAdminRoute = pathname?.startsWith(AdminPrefix);
    const isSellerRoute = pathname?.startsWith(SellerPrefix);

    // Get tokens dynamically instead of storing in state

    const { mutateAsync: login, isPending: isSigningIn } = useMutation({
        mutationFn: async (credentials: SignInSchema) => {
            const response = await api.post('/api/v1/auth/login', credentials);
            const { data } = response.data;
            return data;
        },
        onSuccess: (data) => {
            storage.authenticateUser(data.accessToken);
            setUser(data);
            setIsAuthenticated(true);
            queryClient.setQueryData(['user'], data);
            toast.success('Logged in successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Login failed');
        }
    });

    const { mutateAsync: register, isPending: isSigningUp } = useMutation({
        mutationFn: async (userData: SignUpSchema) => {
            const response = await api.post('/api/v1/auth/register', userData);
            const { data } = response.data;
            return data;
        },
        onSuccess: (data) => {
            storage.authenticateUser(data.accessToken);
            setUser(data);
            setIsAuthenticated(true);
            queryClient.setQueryData(['user'], data);
            toast.success('Registered successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Registration failed');
        }
    });

    const { mutateAsync: logout, isPending: isSigningOut } = useMutation({
        mutationFn: async () => {
            const response = await api.post('/api/v1/auth/logout');
            return response.data;
        },
        onSuccess: () => {
            storage.clearAll();
            setUser(null);
            setIsAuthenticated(false);
            queryClient.clear();
            window.location.href = '/sign-in';
            toast.success('Logged out successfully');
        },
        onError: () => {
            // Even if logout fails on server, clear local state
            storage.clearAll();
            setUser(null);
            setIsAuthenticated(false);
            queryClient.clear();
        }
    });

    const signIn = async (credentials: SignInSchema) => {
        await login(credentials);
    };

    const signUp = async (userData: SignUpSchema) => {
        await register(userData);
    }

    const signOut = async () => {
        await logout();
    }


    const getCurrentUser = useQuery<IAccount>({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await api.get('/api/v1/auth/me');
            const { data } = response.data;
            console.log("Current User:", data);
            return data;
        },
        enabled: false, // We'll manually trigger this
        retry: false,
    });


    // Redirect logic
    useEffect(() => {
        if (!isCheckingAuth) {
            if (isAuthenticated && AuthRoutes.includes(pathname)) {
                window.location.href = '/';
            } else if (!isAuthenticated && ProtectedRoutes.includes(pathname)) {
                window.location.href = '/sign-in';
            }
        }
    }, [isAuthenticated, isCheckingAuth, pathname]);

    useEffect(() => {
        if (isAuthenticated) {
            if (isAdminRoute && !isAdmin) {
                window.location.href = '/';
            } else if (isSellerRoute && !isSeller) {
                window.location.href = '/';
            }
        }
    }, [isAuthenticated, isAdmin, isSeller, pathname]);

    useEffect(() => {
        getCurrentUser.refetch()
            .then(({ data }) => {
                if (data) {
                    setUser(data);
                    switch (data.role) {
                        case 'admin':
                            setIsAdmin(true);
                            setIsSeller(false);
                            setIsCustomer(false);
                            break;
                        case 'seller':
                            setIsAdmin(false);
                            setIsSeller(true);
                            setIsCustomer(false);
                            break;
                        case 'customer':
                            setIsAdmin(false);
                            setIsSeller(false);
                            setIsCustomer(true);
                            break;
                        default:
                            setIsAdmin(false);
                            setIsSeller(false);
                            setIsCustomer(false);
                    }

                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    storage.clearAll();
                }
            })
            .catch(() => {
                setUser(null);
                setIsAuthenticated(false);
                storage.clearAll();
            })
            .finally(() => {
                setIsCheckingAuth(false);
            });
    }, []); // run once on mount

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isCheckingAuth,
                isSigningIn,
                isSigningUp,
                isSigningOut,
                isAdmin,
                isSeller,
                isCustomer,
                signIn,
                signUp,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}