// src/interfaces/action.ts

export interface Action {
	id: number;
	user: number;
	action_type: string;
	description: string;
	points: number;
	challenge: number;
}
