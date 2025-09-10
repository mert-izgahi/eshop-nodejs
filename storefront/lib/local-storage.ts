"use client";


const getTokens = (): { accessToken: string | null; refreshToken: string | null } => {
    try {
        const accessTokenItem = localStorage.getItem('accessToken');
        const refreshTokenItem = localStorage.getItem('refreshToken');
        return {
            accessToken: accessTokenItem ? JSON.parse(accessTokenItem).accessToken : null,
            refreshToken: refreshTokenItem ? JSON.parse(refreshTokenItem).refreshToken : null,
        };
    } catch (error) {
        // If parsing fails, clear corrupted tokens
        clearTokens();
        return { accessToken: null, refreshToken: null };
    }
}




const getToken = (tokenType: 'accessToken' | 'refreshToken'): string | null => {
    if (typeof window === 'undefined') return null;

    try {
        const token = localStorage.getItem(tokenType);
        if (!token) return null;

        const parsed = JSON.parse(token);
        return tokenType === 'accessToken' ? parsed.accessToken : parsed.refreshToken;

    } catch (error) {
        return null;
    }
};

const setTokens = (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', JSON.stringify({ accessToken }));
        localStorage.setItem('refreshToken', JSON.stringify({ refreshToken }));
    }
};

const clearTokens = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

export { getToken, setTokens, clearTokens, getTokens };