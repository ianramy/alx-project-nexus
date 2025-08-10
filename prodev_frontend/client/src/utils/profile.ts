// src/utils/profile.ts

import API_BASE_URL from "./api";
import { Challenge } from "@/interfaces/challenge";
import { Leaderboard } from "@/interfaces/leaderboard";
import { smartFetch } from "./http";
import { Action } from "@/interfaces/action";

const url = (path: string) => {
	const base = (API_BASE_URL || "").replace(/\/+$/,"");
	const suffix = path.replace(/^\/+/, "");
	return `${base}/${suffix}`;
};

/**
 * List challenges for the current user.
 * If currentUserId provided, filter client-side by participants.
 * (Server endpoint is public; smartFetch will still attach auth if present.)
 */
export const fetchUserChallenges = async (currentUserId?: number): Promise<Challenge[]> => {
	const list = await smartFetch<Challenge[]>(url("challenges/"));
	if (!currentUserId) return list;
	return list.filter(c =>
		Array.isArray(c.participants) &&
		c.participants.some(p => Number(p.id) === Number(currentUserId))
	);
};

/**
 * Leaderboard entries for current user.
 * Assumes your API under /api/leaderboard/ returns only the caller’s entries
 * (common in your project). If not, add a `?me=1` server filter and keep this.
 */
export const fetchUserLeaderboard = async (): Promise<Leaderboard[]> => {
	return smartFetch<Leaderboard[]>(url("leaderboard/"));
};

/**
 * Current user's eco actions. Your EcoActionViewSet already filters to request.user.
 */
export const fetchUserActions = async (): Promise<Action[]> => {
	return smartFetch<Action[]>(url("actions/eco-actions/"));
};
