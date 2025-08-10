// src/utils/sanitize.ts

export const sanitizeString = (v: unknown): string => (typeof v === "string" ? v : "");

export const sanitizeNumber = (v: unknown): number => {
	if (typeof v === "number") return v;
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};

export const sanitizeBool = (v: unknown): boolean => {
	if (typeof v === "boolean") return v;
	if (typeof v === "string") return ["true", "1", "yes", "on"].includes(v.toLowerCase());
	if (typeof v === "number") return v !== 0;
	return false;
};

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
	const out = {} as Pick<T, K>;
	for (const k of keys) {
		if (k in obj) out[k] = obj[k];
	}
	return out;
}
export function stripEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(obj)) {
		if (v === undefined || v === null) continue;
		if (typeof v === "string") {
			const t = v.trim();
			if (t !== "") out[k] = t;
			else continue;
		} else {
			out[k] = v;
		}
	}
	return out as Partial<T>;
}
