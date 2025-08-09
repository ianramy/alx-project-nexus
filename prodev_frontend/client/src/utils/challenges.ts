// src/utils/challenges.ts

import API_BASE_URL from "./api";
import { Challenge } from "@/interfaces/challenge";


export const fetchChallenges = async (): Promise<Challenge[]> => {
	try {
		const res = await fetch(`${API_BASE_URL}/challenges`);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data: Challenge[] = await res.json();
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
