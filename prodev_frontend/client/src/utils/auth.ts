// src/utils/auth.ts

import API_BASE_URL from "./api";
import { 
    LoginRequest, 
    LoginResponse, 
    SignInRequest, 
    SignInResponse, 
    LogoutRequest 
} from "@/interfaces/auth";


export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
	const res = await fetch(`${API_BASE_URL}/auth/login/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	if (!res.ok) throw new Error("Login failed");
	return res.json();
};

export const signUpUser = async (payload: SignInRequest): Promise<SignInResponse> => {
	const res = await fetch(`${API_BASE_URL}/users/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	if (!res.ok) throw new Error("Signup failed");
	return res.json();
};

export const logoutUser = async (payload: LogoutRequest): Promise<void> => {
	await fetch(`${API_BASE_URL}/auth/logout/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
};
