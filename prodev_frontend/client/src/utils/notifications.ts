// src/utils/notifications.ts

import API_BASE_URL from "./api";
import { Notification } from "@/interfaces/notification";


export const fetchNotifications = async (): Promise<Notification[]> => {
	try {
		const res = await fetch(`${API_BASE_URL}/notifications`);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data: Notification[] = await res.json();
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
