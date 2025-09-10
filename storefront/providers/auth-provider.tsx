"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { IAccount } from "@/types";
import { usePathname } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios-client';
import { SignInSchema, SignUpSchema } from '@/lib/zod';
import { toast } from 'sonner';
import { getTokens, setTokens, clearTokens, getToken } from '@/lib/local-storage';

interface AuthContextType {
    user: IAccount | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    isSigningIn: boolean;
    isSigningUp: boolean;
    isSigningOut: boolean;
    signIn: (credentials: SignInSchema) => Promise<void>;
    signUp: (userData: SignUpSchema) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ProtectedRoutes = ['/profile', '/orders', '/settings'];
const AuthRoutes = ['/sign-in', '/sign-up'];


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IAccount | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();
    const queryClient = useQueryClient();

    // Get tokens dynamically instead of storing in state
    const getStoredTokens = () => {
        if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
        return getTokens();
    };

    const { mutateAsync: login, isPending: isSigningIn } = useMutation({
        mutationFn: async (credentials: SignInSchema) => {
            const response = await api.post('/api/v1/auth/login', credentials);
            const { data } = response.data;
            return data;
        },
        onSuccess: (data) => {
            setTokens(data.accessToken, data.refreshToken);
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
            setTokens(data.accessToken, data.refreshToken);
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
            clearTokens();
            setUser(null);
            setIsAuthenticated(false);
            queryClient.clear();
            toast.success('Logged out successfully');
        },
        onError: () => {
            // Even if logout fails on server, clear local state
            clearTokens();
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

    const {mutateAsync: verifyAccessToken} = useMutation({
        mutationFn: async () => {
            const { accessToken } = getStoredTokens();
            if (!accessToken) throw new Error('No token');

            // Use axios instance without automatic token injection for this call
            const response = await api.post('/api/v1/auth/verify-access-token', { accessToken },{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            const { data } =await response.data;

            return data;
        },
        onError: (error) => {
            console.error('Token verification failed:', error);
            throw error;
        }
    });

    const getCurrentUser = useQuery<IAccount>({
        queryKey: ['user'],
        queryFn: async () => {
            const { accessToken } = getStoredTokens();
            if (!accessToken) throw new Error('No token');

            const response = await api.get('/api/v1/auth/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { data } = response.data;
            return data;
        },
        enabled: false, // We'll manually trigger this
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

    // Token refresh functionality
    const refreshTokens = async (): Promise<{ accessToken: string; refreshToken: string }> => {
        try {
            const { refreshToken } = getStoredTokens();
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            const response = await api.post('/api/v1/auth/refresh', { refreshToken });
            const { data } = response.data;
            return data;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return Promise.reject(error);
        }
    };

    const checkAuth = async () => {
        setIsCheckingAuth(true);
        console.log("Checking authentication...");
        
        try {
            const { accessToken } = getStoredTokens();
            if (accessToken) {
                try {
                    // First, verify the access token
                    const verificationSuccess = await verifyAccessToken();
                    console.log('Access token verification success:', verificationSuccess);
                    
                    if(!verificationSuccess) {
                        throw new Error('Access token is invalid');
                    }
                    // If verification succeeds, get user data
                    const userResult = await getCurrentUser.refetch();
                    if (userResult.data) {
                        setUser(userResult.data);
                        setIsAuthenticated(true);
                    } else {
                        throw new Error('Failed to get user data');
                    }
                } catch (verificationError) {
                    console.log('Access token verification failed, attempting refresh...');

                    // If access token verification fails, try to refresh
                    const refreshSuccess = await refreshTokens();

                    if (refreshSuccess) {
                        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshSuccess;
                        setTokens(newAccessToken, newRefreshToken);

                        // After successful refresh, try to get user data again
                        try {
                            const userResult = await getCurrentUser.refetch();
                            if (userResult.data) {
                                setUser(userResult.data);
                                setIsAuthenticated(true);
                            } else {
                                throw new Error('Failed to get user data after refresh');
                            }
                        } catch (userError) {
                            throw new Error('Failed to authenticate after token refresh');
                        }
                    } else {
                        throw new Error('Token refresh failed');
                    }
                }
            } else {
                clearTokens();
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            clearTokens();
        } finally {
            setIsCheckingAuth(false);
        }
    };

    // Only run on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            checkAuth();
        }
    }, []); // Remove accessToken dependency to avoid infinite loops



    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isCheckingAuth,
                isSigningIn,
                isSigningUp,
                isSigningOut,
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