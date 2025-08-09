// src/pages/_app.tsx

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
            <ThemeProvider>
			    <Component {...pageProps} />
		    </ThemeProvider>
		</AuthProvider>
	);
}
