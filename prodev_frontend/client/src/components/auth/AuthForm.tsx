// src/components/auth/AuthForm.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import { LoginRequest, SignInRequest } from "@/interfaces/auth";
import { loginUser, signUpUser } from "@/utils/auth";
import Button from "@/components/common/Button";

interface AuthFormProps {
    mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
    const [form, setForm] = useState<Partial<LoginRequest & SignInRequest>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === "login") {
                const loginData: LoginRequest = {
                    email: form.email!,
                    password: form.password!,
                };
                const res = await loginUser(loginData);
                // Debug logs (can remove later)
                console.log("ACCESS TOKEN:", res.access);
                console.log("REFRESH TOKEN:", res.refresh);
                localStorage.setItem("access", res.access);
                localStorage.setItem("refresh", res.refresh);
            } else {
                const signUpData: SignInRequest = {
                    username: form.username!,
                    email: form.email!,
                    password: form.password!,
                    first_name: form.first_name || "",
                    last_name: form.last_name || "",
                    avatar: null,
                    bio: "",
                    phone_number: "",
                    date_of_birth: "2000-01-01",
                    gender: "prefer_not_say",
                    profile_complete: true,
                    city: null,
                };
                await signUpUser(signUpData);
            }

            router.push("/profile");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 animate-[fadeIn_.3s_ease]">
            {mode === "signup" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            First name
                        </label>
                        <input
                            name="first_name"
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
                            onChange={handleChange}
                            autoComplete="given-name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last name
                        </label>
                        <input
                            name="last_name"
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
                            onChange={handleChange}
                            autoComplete="family-name"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            name="username"
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
                            onChange={handleChange}
                            autoComplete="username"
                            required={mode === "signup"}
                        />
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    name="email"
                    type="email"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    {/* helper spot */}
                    {mode === "signup" && (
                        <span className="text-xs text-gray-500">
                            Min 6 characters recommended
                        </span>
                    )}
                </div>
                <div className="relative">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-transparent"
                        onChange={handleChange}
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute inset-y-0 right-2 my-auto h-8 w-8 rounded-md text-gray-500 hover:text-gray-800 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        title={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? "👀" : "😏"}
                    </button>
                </div>
            </div>

            {error && (
                <p className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                    {error}
                </p>
            )}

            <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Processing..." : mode === "login" ? "Login" : "Create account"}
            </Button>

            <style jsx global>{`
            @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
        }
        `}</style>
        </form>
    );
}
