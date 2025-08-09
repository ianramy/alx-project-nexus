// src/utils/actions.ts

import API_BASE_URL from "./api";
import { Action } from "@/interfaces/action";


export const fetchActions = async (): Promise<Action[]> => {
	try {
		const res = await fetch(`${API_BASE_URL}/actions`);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data: Action[] = await res.json();
		console.log("Data fetched:", data);
		return data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("API Error:", err.message);
		} else {
			console.error("Unknown error:", err);
		}
		throw err;
	}
};
