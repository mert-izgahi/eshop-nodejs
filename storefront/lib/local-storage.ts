"use client";


class LocalStorage {
    accessToken: string;
    adminAccessKey: string;
    hasAdminAccess: boolean;
    constructor() {
        this.accessToken = "";
        this.adminAccessKey = "";
        this.hasAdminAccess = false;
    }

    authenticateUser(token: string) {
        if (typeof window !== 'undefined') {
            this.accessToken = token;
            localStorage.setItem("accessToken", JSON.stringify({ accessToken: token }));
        }
    }

    authorizeAdmin(key: string) {
        if (typeof window !== 'undefined') {
            this.adminAccessKey = key;
            localStorage.setItem("adminAccessKey", key);
            localStorage.setItem("hasAdminAccess", "true");
        }
    }


    unAuthenticateUser() {
        if (typeof window !== 'undefined') {
            this.accessToken = "";
            localStorage.removeItem("accessToken");
        }
    }


    unAuthorizeAdmin() {
        if (typeof window !== 'undefined') {
            this.adminAccessKey = "";
            localStorage.removeItem("adminAccessKey");
            localStorage.removeItem("hasAdminAccess");
        }
    }

    clearAll() {
        if (typeof window !== 'undefined') {
            this.accessToken = "";
            this.adminAccessKey = "";
            localStorage.removeItem("accessToken");
            localStorage.removeItem("adminAccessKey");
            localStorage.removeItem("hasAdminAccess");
        }
    }
}

export const storage = new LocalStorage();
