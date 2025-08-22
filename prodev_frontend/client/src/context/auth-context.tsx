// src/context/auth-context.tsx

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import API_BASE_URL from "@/utils/api";
import { AuthUser, LoginRequest, LoginResponse } from "@/interfaces/auth";
import {
    loginUser as apiLogin,
    logoutUser as apiLogout,
    getAccessToken as getStoredAccess,
    getRefreshToken as getStoredRefresh,
    clearTokens,
    refreshAccessToken,
} from "@/utils/auth";
import { smartFetch, ApiError } from "@/utils/http";

interface AuthContextType {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    reloadMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const url = (path: string) => {
    const base = (API_BASE_URL || "").replace(/\/+$/, "");
    const suffix = path.replace(/^\/+/, "");
    return `${base}/${suffix}`;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getStoredAccess();
        setAccessToken(token);
        setLoading(false);
    }, []);

    const loadMe = useCallback(async (): Promise<void> => {
        if (!accessToken) {
            setUser(null);
            return;
        }
        try {
            const me = await smartFetch<AuthUser>(url("users/me/"));
            setUser(me);
        } catch (err) {
            if (err instanceof ApiError && err.status === 401 && getStoredRefresh()) {
                try {
                    const newAccess = await refreshAccessToken();
                    setAccessToken(newAccess);
                    const me = await smartFetch<AuthUser>(url("users/me/"));
                    setUser(me);
                    return;
                } catch {
                    /* fallthrough */
                }
            }
            setUser(null);
            setAccessToken(null);
            clearTokens();
        }
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) {
            setUser(null);
            return;
        }
        void loadMe();
    }, [accessToken, loadMe]);

    const login = useCallback(async (credentials: LoginRequest) => {
        const res: LoginResponse = await apiLogin(credentials);
        localStorage.setItem("access", res.access);
        localStorage.setItem("refresh", res.refresh);
        setAccessToken(res.access);
        await loadMe();
    }, [loadMe]);

    const logout = useCallback(async () => {
        try {
            await apiLogout();
        } finally {
            setUser(null);
            setAccessToken(null);
            clearTokens();
        }
    }, []);

    const value = useMemo<AuthContextType>(() => ({
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        loading,
        login,
        logout,
        reloadMe: loadMe,
    }), [user, accessToken, loading, login, logout, loadMe]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
