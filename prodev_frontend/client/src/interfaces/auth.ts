// src/interfaces/auth.ts


import {City} from "@/interfaces/location"


export interface AuthUser {
	id: number;
	username: string;
	email: string;
	first_name: string | null;
	last_name: string | null;
	avatar: string | null;
	bio: string | null;
	phone_number: string | null;
	date_of_birth: string | null;
	gender: "male" | "female" | "other" | "prefer_not_say";
	profile_complete: boolean | null;
    city?: City | null;
}

// LOGIN
export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	access: string;
	refresh: string;
}

// SIGN IN / REGISTER
export interface SignInRequest {
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	avatar: string | null;
	bio: string;
	phone_number: string;
	date_of_birth: string;
	gender: "male" | "female" | "other" | "prefer_not_say";
	profile_complete: boolean;
	city: number | null;
	password: string;
}

export type SignInResponse = AuthUser;

// LOGOUT
export interface LogoutRequest {
	refresh: string;
}

export interface LogoutResponse {}
