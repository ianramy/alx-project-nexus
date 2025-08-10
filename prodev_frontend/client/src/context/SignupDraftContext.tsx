// src/context/SignupDraftContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";

export type SignupDraft = {
    email?: string;
    password?: string;
    username?: string;
    // optional fields (filled in onboarding)
    first_name?: string;
    last_name?: string;
    avatar?: string | null;
    bio?: string | null;
    phone_number?: string | null;
    date_of_birth?: string | null;
    gender?: "male" | "female" | "other" | "prefer_not_say" | "" | null;
    profile_complete?: boolean;
    city?: number | null;
};

type Ctx = {
    draft: SignupDraft | null;
    setDraft: (d: SignupDraft | null) => void;
};

const SignupDraftContext = createContext<Ctx | undefined>(undefined);

export function SignupDraftProvider({ children }: { children: React.ReactNode }) {
    const [draft, setDraftState] = useState<SignupDraft | null>(null);

    // revive from localStorage so refresh doesn't nuke it
    useEffect(() => {
        try {
            const raw = localStorage.getItem("signup_draft");
            if (raw) setDraftState(JSON.parse(raw));
        } catch { }
    }, []);

    const setDraft = (d: SignupDraft | null) => {
        setDraftState(d);
        try {
            if (d) localStorage.setItem("signup_draft", JSON.stringify(d));
            else localStorage.removeItem("signup_draft");
        } catch { }
    };

    return (
        <SignupDraftContext.Provider value={{ draft, setDraft }}>
            {children}
        </SignupDraftContext.Provider>
    );
}

export function useSignupDraft() {
    const ctx = useContext(SignupDraftContext);
    if (!ctx) throw new Error("useSignupDraft must be used within SignupDraftProvider");
    return ctx;
}
