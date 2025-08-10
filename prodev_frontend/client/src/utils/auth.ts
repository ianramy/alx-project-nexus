// src/utils/auth.ts

import API_BASE_URL from "./api";
import {
	LoginRequest,
	LoginResponse,
	SignInRequest,
	SignInResponse,
} from "@/interfaces/auth";
import { smartFetch, ApiError } from "@/utils/http";

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const LEGACY_ACCESS_KEYS = ["access", "access_token", "jwt", "token"];
const LEGACY_REFRESH_KEYS = ["refresh", "refresh_token"];

const base = (API_BASE_URL || "").replace(/\/+$/, "");

const migrateIfLegacy = (
	val: string | null,
	legacyKeys: string[],
	targetKey: string
) => {
	if (!val && typeof window !== "undefined") {
		for (const k of legacyKeys) {
			const legacy = localStorage.getItem(k);
			if (legacy) {
				localStorage.setItem(targetKey, legacy);
				return legacy;
			}
		}
	}
	return val;
};

export const getAccessToken = (): string | null => {
	if (typeof window === "undefined") return null;
	const current = localStorage.getItem(ACCESS_KEY);
	return migrateIfLegacy(current, LEGACY_ACCESS_KEYS, ACCESS_KEY);
};

export const getRefreshToken = (): string | null => {
	if (typeof window === "undefined") return null;
	const current = localStorage.getItem(REFRESH_KEY);
	return migrateIfLegacy(current, LEGACY_REFRESH_KEYS, REFRESH_KEY);
};

export const setTokens = (access: string, refresh?: string | null) => {
	if (typeof window === "undefined") return;
	localStorage.setItem(ACCESS_KEY, access);
	// keep legacy access for old readers (optional)
	localStorage.setItem("access", access);
	if (refresh) {
		localStorage.setItem(REFRESH_KEY, refresh);
		localStorage.setItem("refresh", refresh);
	}
};

export const clearTokens = () => {
	if (typeof window === "undefined") return;
	[
		ACCESS_KEY,
		REFRESH_KEY,
		...LEGACY_ACCESS_KEYS,
		...LEGACY_REFRESH_KEYS,
	].forEach((k) => {
		localStorage.removeItem(k);
	});
};

const logApiError = (label: string, err: unknown) => {
	if (err instanceof ApiError) {
		console.error(`${label}:`, { status: err.status, data: err.data });
	} else {
		console.error(`${label} (unknown):`, err);
	}
};

export const loginUser = async (
	payload: LoginRequest
): Promise<LoginResponse> => {
	try {
		const data = await smartFetch<LoginResponse & { refresh?: string }>(
			`${base}/auth/login/`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
				skipAuth: true,
			}
		);
		if (!data?.access) throw new Error("No access token in response");
		const refresh = "refresh" in data ? data.refresh : undefined;
		setTokens(data.access, refresh ?? null);
		return data;
	} catch (err) {
		logApiError("Login failed", err);
		throw err;
	}
};

export const signUpUser = async (
	payload: SignInRequest
): Promise<SignInResponse> => {
	try {
		return await smartFetch<SignInResponse>(`${base}/users/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			skipAuth: true,
		});
	} catch (err) {
		logApiError("Signup failed", err);
		throw err;
	}
};

export const refreshAccessToken = async (): Promise<string> => {
	const refresh = getRefreshToken();
	if (!refresh) throw new Error("No refresh token");
	const data = await smartFetch<{ access: string }>(
		`${base}/auth/token-refresh/`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refresh }),
			skipAuth: true,
		}
	);
	if (!data?.access) throw new Error("No access token in refresh response");
	// update + keep legacy in sync
	setTokens(data.access, refresh);
	return data.access;
};

export const logoutUser = async (): Promise<void> => {
	const refresh = getRefreshToken();
	try {
		if (refresh) {
			await smartFetch<void>(`${base}/auth/logout/`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refresh }),
			});
		}
	} catch (err) {
		logApiError("Logout failed", err);
	} finally {
		clearTokens();
	}
};

export const updateCurrentUser = async (
	payload: Partial<{
		username: string;
		email: string;
		first_name: string;
		last_name: string;
		avatar: string | null;
		bio: string | null;
		phone_number: string | null;
		date_of_birth: string | null;
		gender: string | null;
		city: number | null;
	}>
): Promise<unknown> => {
	try {
		return await smartFetch<unknown>(`${base}/users/me/`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
	} catch (err) {
		logApiError("Update current user failed", err);
		throw err;
	}
};

export const updateUserById = async (
	id: number | string,
	payload: Record<string, unknown>
): Promise<unknown> => {
	try {
		return await smartFetch<unknown>(`${base}/users/${id}/`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
	} catch (err) {
		logApiError(`Update user ${id} failed`, err);
		throw err;
	}
};

export const changeCurrentUserPassword = async (payload: {
	current_password: string;
	new_password: string;
	re_new_password: string;
}): Promise<{ detail: string }> => {
	try {
		return await smartFetch<{ detail: string }>(`${base}/users/me/password/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
	} catch (err) {
		logApiError("Change password failed", err);
		throw err;
	}
};
