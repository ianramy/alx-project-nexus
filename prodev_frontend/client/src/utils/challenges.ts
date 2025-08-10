// src/utils/challenges.ts

import API_BASE_URL from "./api";
import { Challenge } from "@/interfaces/challenge";
import { smartFetch } from "./http";


const url = (path: string) => {
	const base = (API_BASE_URL || "").replace(/\/+$/, "");
	const suffix = path.replace(/^\/+/, "");
	return `${base}/${suffix}`;
};

export const fetchChallenges = async (): Promise<Challenge[]> => {
	return smartFetch<Challenge[]>(url("challenges/"));
};

export const fetchChallenge = async (id: number): Promise<Challenge> => {
	return smartFetch<Challenge>(url(`challenges/${id}/`));
};

export const joinChallenge = async (id: number): Promise<Challenge> => {
    
	return smartFetch<Challenge>(url(`challenges/${id}/join/`), {
		method: "POST",
	});
};

export const leaveChallenge = async (id: number): Promise<void> => {
	await smartFetch<void>(url(`challenges/${id}/leave/`), {
		method: "POST",
	});
};
