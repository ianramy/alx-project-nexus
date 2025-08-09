// src/context/auth-context.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { AuthUser, LoginRequest, LoginResponse } from "@/interfaces/auth";
import { loginUser, logoutUser } from "@/utils/auth";

interface AuthContextType {
	user: AuthUser | null;
	accessToken: string | null;
	login: (credentials: LoginRequest) => Promise<void>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);

	// Safe accessToken retrieval on client-side
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedAccess = localStorage.getItem("access");
			if (storedAccess) {
				setAccessToken(storedAccess);
			}
		}
	}, []);

	const login = async (credentials: LoginRequest) => {
		const res: LoginResponse = await loginUser(credentials);
		if (typeof window !== "undefined") {
			localStorage.setItem("access", res.access);
			localStorage.setItem("refresh", res.refresh);
		}
		setAccessToken(res.access);
	};

	const logout = async () => {
		if (typeof window !== "undefined") {
			const refresh = localStorage.getItem("refresh");
			if (refresh) {
				await logoutUser({ refresh });
			}
			localStorage.removeItem("access");
			localStorage.removeItem("refresh");
		}
		setAccessToken(null);
		setUser(null);
	};

	useEffect(() => {
		const fetchProfile = async () => {
			try {
                console.log("Attempting fetch with access token:", accessToken);
				const res = await fetch("http://localhost:8000/api/users/me/", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				if (!res.ok) throw new Error("Unauthorized");
				const userData = await res.json();
				setUser(userData);
			} catch (err) {
				setAccessToken(null);
				if (typeof window !== "undefined") {
					localStorage.removeItem("access");
				}
			}
		};

		if (accessToken) {
			fetchProfile();
		}
	}, [accessToken]);

	return (
		<AuthContext.Provider
			value={{
				user,
				accessToken,
				login,
				logout,
				isAuthenticated: !!accessToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
