// src/utils/users.ts

import API_BASE_URL from "./api";
import { User } from "@/interfaces/user";

export const fetchUsers = async (): Promise<User[]> => {
	try {
		const res = await fetch(`${API_BASE_URL}/users`);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data: User[] = await res.json();
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

