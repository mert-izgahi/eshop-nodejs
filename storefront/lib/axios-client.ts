// lib/axios-client.ts
import axios from 'axios';
import { getToken, setTokens, clearTokens } from './local-storage';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});




const signOut = () => {
    clearTokens();
    if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
    }
};


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only handle 401s that haven't been retried and aren't from auth endpoints
        if (error.response?.status === 401 && !originalRequest._retry) {
            const authEndpoints = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh', '/api/v1/auth/verify-access-token'];
            const isAuthEndpoint = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

            // Don't retry auth endpoints to avoid infinite loops
            if (isAuthEndpoint) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                const refreshToken = getToken('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await api.post('/api/v1/auth/refresh', {
                    refreshToken
                });

                // Adjust this based on your actual API response structure
                const { data } = response.data;
                const { accessToken, refreshToken: newRefreshToken } = data;

                console.log('Token refreshed successfully via interceptor');

                // Update tokens using the same format as AuthContext
                setTokens(accessToken, newRefreshToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed in interceptor:', refreshError);
                // Clear tokens and redirect to login on refresh failure
                signOut();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;