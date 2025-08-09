// src/context/theme-context.tsx
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void; clearToSystem: () => void };

const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");

    // Hydrate from storage/system AFTER the initial SSR script already set the class
    useEffect(() => {
        const stored = (localStorage.getItem("theme") as Theme | null) ?? null;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setThemeState(stored ?? (prefersDark ? "dark" : "light"));
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const setTheme = (t: Theme) => setThemeState(t);
    const toggle = () => setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    const clearToSystem = () => {
        localStorage.removeItem("theme"); // next load uses system again
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const next = prefersDark ? "dark" : "light";
        setThemeState(next);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggle, clearToSystem }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
