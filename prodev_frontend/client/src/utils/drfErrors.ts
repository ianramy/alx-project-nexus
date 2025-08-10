// src/utils/drfErrors.ts

export type DrfErrors = Record<string, string[]>;
export function drfToString(e: unknown): string {
	if (!e || typeof e !== "object") return "Request failed.";
	const d = e as DrfErrors;
	return Object.entries(d)
		.map(([k, v]) => `${k}: ${v.join(", ")}`)
		.join("\n");
}
