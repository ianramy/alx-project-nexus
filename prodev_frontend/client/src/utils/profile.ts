// src/utils/profile.ts

import API_BASE_URL from "./api";
import { AuthUser } from "@/interfaces/auth";
import { Challenge } from "@/interfaces/challenge";
import { Leaderboard } from "@/interfaces/leaderboard";
import { Action } from "@/interfaces/action";

export const fetchUserProfile = async (): Promise<AuthUser> => {
	const res = await fetch(`${API_BASE_URL}/users/me/`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("access")}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch profile");
	return res.json();
};

export const fetchUserLeaderboard = async (): Promise<Leaderboard[]> => {
	const res = await fetch(`${API_BASE_URL}/users/me/leaderboard/`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("access")}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch leaderboard");
	return res.json();
};

export const fetchUserChallenges = async (): Promise<Challenge[]> => {
	const res = await fetch(`${API_BASE_URL}/users/me/challenges/`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("access")}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch challenges");
	return res.json();
};

export const fetchUserActions = async (): Promise<Action[]> => {
	const res = await fetch(`${API_BASE_URL}/users/me/actions/`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("access")}`,
		},
	});
	if (!res.ok) throw new Error("Failed to fetch actions");
	return res.json();
};
