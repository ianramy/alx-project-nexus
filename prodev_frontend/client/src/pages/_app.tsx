// src/pages/_app.tsx

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { SignupDraftProvider } from "@/context/SignupDraftContext";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <ThemeProvider>
                <SignupDraftProvider>
                    <Component {...pageProps} />
                </SignupDraftProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
