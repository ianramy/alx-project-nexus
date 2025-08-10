// src/utils/actions.ts

import API_BASE_URL from "./api";
import { Action } from "@/interfaces/action";
import { smartFetch } from "./http";

//  Helper to join base + path safely.
const url = (path: string) => {
	const base = (API_BASE_URL || "").replace(/\/+$/, "");
	const suffix = path.replace(/^\/+/, "");
	return `${base}/${suffix}`;
};

/**
 * Public catalog: list all action templates.
 * GET /api/actions/action-templates/
 */
export const fetchActionTemplates = async (): Promise<Action[]> => {
	return smartFetch<Action[]>(url("actions/action-templates/"));
};

/**
 * Public catalog: get a single action template by id.
 * GET /api/actions/action-templates/:id/
 */
export const fetchActionTemplate = async (id: number): Promise<Action> => {
	return smartFetch<Action>(url(`actions/action-templates/${id}/`));
};

/**
 * Private log: create an EcoAction row for the current user.
 * POST /api/actions/eco-actions/
 * Do NOT include "user" in the payload; the server sets it from the token/session.
 * Returns the created EcoAction (with nested user/challenge per your serializer).
 */
export const markActionDone = async (input: {
	action_type: string;
	description: string;
	points: number;
	challenge?: number | null;
}) => {
	return smartFetch<unknown>(url("actions/eco-actions/"), {
		method: "POST",
		body: JSON.stringify(input),
		// smartFetch adds Authorization automatically (and refreshes on 401)
	});
};

/** Back-compat alias if something else imports this name. */
export const fetchActions = fetchActionTemplates;
