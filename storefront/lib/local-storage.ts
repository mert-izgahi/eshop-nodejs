"use client";

class LocalStorage {
  private readonly ACCESS_TOKEN_KEY = "accessToken";
  private readonly ADMIN_ACCESS_KEY = "adminAccessKey";
  

  get accessToken(): string | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    try {
      return stored ? JSON.parse(stored).accessToken : null;
    } catch {
      return null;
    }
  }

  get adminAccessKey(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.ADMIN_ACCESS_KEY);
  }

  authenticateUser(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, JSON.stringify({ accessToken: token }));
  }

  unAuthenticateUser() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  authorizeAdmin(key: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.ADMIN_ACCESS_KEY, key);
  }

  unAuthorizeAdmin() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.ADMIN_ACCESS_KEY);
  }

  clearAll() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_ACCESS_KEY);
  }
}

export const storage = new LocalStorage();
