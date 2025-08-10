// src/utils/http.ts

export class ApiError extends Error {
	status: number;
	data: unknown;
	constructor(status: number, data: unknown, message?: string) {
		super(message ?? `HTTP ${status}`);
		this.status = status;
		this.data = data;
	}
}

type SmartInit = RequestInit & {
	skipAuth?: boolean; // don't attach Authorization (e.g. login/refresh endpoints)
};

// ---- token helpers (localStorage + cookies fallback) ------------------------

const readCookie = (name: string): string | null => {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : null;
};

const getAccessToken = (): string | null => {
	if (typeof window === "undefined") return null;
	// Preferred keys first, but support legacy ones
	const keys = ["accessToken", "access", "access_token", "jwt", "token"];
	for (const k of keys) {
		const v = localStorage.getItem(k);
		if (v) return v;
	}
	return (
		readCookie("accessToken") ||
		readCookie("access") ||
		readCookie("access_token")
	);
};

// ---- core smartFetch --------------------------------------------------------

export const smartFetch = async <T = unknown>(
	url: string,
	init: SmartInit = {}
): Promise<T> => {
	const headers = new Headers(init.headers ?? {});
	const token = init.skipAuth ? null : getAccessToken(); // const, not let

	if (token && !headers.has("Authorization")) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	if (init.body && !headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	const res = await fetch(url, { ...init, headers });

	let data: unknown = null;
	const text = await res.text();
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = text;
	}

	if (!res.ok) {
		const detail =
			(typeof data === "object" &&
				data &&
				(data as { detail?: string }).detail) ||
			res.statusText;
		throw new ApiError(res.status, data, String(detail));
	}

	return data as T;
};
