// src/utils/leaderboard.ts

import API_BASE_URL from "./api";
import { Leaderboard } from "@/interfaces/leaderboard";


export const fetchLeaderboard = async (): Promise<Leaderboard[]> => {
	try {
		const res = await fetch(`${API_BASE_URL}/leaderboard`);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data: Leaderboard[] = await res.json();
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
