// src/utils/location.ts

import API_BASE_URL from "./api";
import { City } from "@/interfaces/location";


export const fetchCities = async (): Promise<City[]> => {
	try {
		const res = await fetch(`${API_BASE_URL}/location`);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data: City[] = await res.json();
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
