// src/hooks/useAuth.ts

import { useState, useEffect } from "react";
import { AuthUser } from "@/interfaces/auth";
import { fetchUserProfile } from "@/utils/profile";

export default function useAuth() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const user = await fetchUserProfile();
				setUser(user);
			} catch {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	return { user, loading };
}
