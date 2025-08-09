// src/pages/auth.tsx

import { useEffect, useState } from "react";
import AuthForm from "@/components/auth/AuthForm";
import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "signup">("login");

    // read ?mode= from query so /auth?mode=signup opens on signup
    useEffect(() => {
        if (typeof window === "undefined") return;
        const url = new URL(window.location.href);
        const m = url.searchParams.get("mode");
        if (m === "signup" || m === "login") setMode(m);
    }, []);

    const isLogin = mode === "login";

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

            {/* HEADER */}
            <header className="absolute top-4 right-4 z-20">
                <div className="font-semibold tracking-tight text-lg text-black drop-shadow">
                    <span className="text-green-400">Carbon</span>Jar
                </div>
            </header>
            {/* Left: image */}
            <div
                className={`
                    relative hidden md:block
                    bg-[url('/assets/images/auth.jpg')] bg-cover bg-center
                `}
                aria-hidden
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                <div className="absolute top-4 left-4">
                    <BackButton />
                </div>
                <div className="absolute bottom-8 left-8 text-white max-w-sm">
                    <h2 className="text-3xl font-bold drop-shadow-md">
                        Change the world, one action at a time.
                    </h2>
                    <p className="mt-2 text-white/90">
                        Join challenges, log eco-actions, and climb the leaderboard.
                    </p>
                </div>
            </div>

            {/* Right: form */}
            <div className="relative flex items-center justify-center p-6 sm:p-8">
                <div className="absolute top-4 left-4 md:hidden">
                    <BackButton />
                </div>

                <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-2xl font-bold text-gray-900">
                        {isLogin ? "Welcome Back" : "Create your account"}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {isLogin
                            ? "Log in to continue your eco journey."
                            : "Sign up to start tracking your impact."}
                    </p>

                    <div className="mt-6">
                        <AuthForm mode={mode} />
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3">
                        <span className="text-sm text-gray-600">
                            {isLogin ? "New here?" : "Already a member?"}
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setMode(isLogin ? "signup" : "login")}
                        >
                            {isLogin ? "Create account" : "Log in"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
