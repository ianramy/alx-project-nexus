// src/pages/onboarding.tsx

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSignupDraft } from "@/context/SignupDraftContext";
import { signUpUser } from "@/utils/auth";
import type { SignInRequest } from "@/interfaces/auth";
import { stripEmpty } from "@/utils/sanitize";
import { ApiError } from "@/utils/http";
import Button from "@/components/common/Button";
import BackButton from "@/components/common/BackButton";

type DrfErrors = Record<string, string[]>;

function ErrorText({ children }: { children: React.ReactNode }) {
    return (
        <p className="mt-1 text-xs text-red-600">
            {children}
        </p>
    );
}

function ErrorAlert({ errors }: { errors: DrfErrors }) {
    const items = Object.entries(errors);
    if (!items.length) return null;
    return (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-800 text-sm px-3 py-2">
            <strong className="font-semibold">We found some issues:</strong>
            <ul className="list-disc ml-5 mt-1">
                {items.map(([field, msgs]) => (
                    <li key={field}>
                        <b>{field}</b>: {msgs.join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function OnboardingPage() {
    const router = useRouter();
    const { draft, setDraft } = useSignupDraft();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        avatar: "",
        bio: "",
        phone_number: "",
        date_of_birth: "",
        gender: "prefer_not_say",
        city: "",
    });
    const [step, setStep] = useState<"edit" | "review">("edit");
    const [submitting, setSubmitting] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<DrfErrors>({});

    useEffect(() => {
        if (!draft?.email || !draft?.password || !draft?.username) {
            router.replace("/auth?mode=signup");
        }
    }, [draft, router]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (fieldErrors[name]) {
            const clone = { ...fieldErrors };
            delete clone[name];
            setFieldErrors(clone);
        }
    };

    const combinedPayload = useMemo(() => {
        if (!draft) return null;

        const cityId =
            form.city.trim() === "" ? null : Number.isNaN(Number(form.city)) ? null : Number(form.city);

        const payload = {
            username: draft.username!,
            email: draft.email!,
            password: draft.password!,
            first_name: form.first_name,
            last_name: form.last_name,
            avatar: form.avatar ? form.avatar : null,
            bio: form.bio,
            phone_number: form.phone_number,
            date_of_birth: form.date_of_birth || null,
            gender: form.gender || null,
            profile_complete: true,
            city: cityId,
        };
        return stripEmpty(payload);
    }, [draft, form]);

    const onSkip = () => setStep("review");
    const onContinue = () => setStep("review");
    const onBack = () => setStep("edit");

    const onSubmit = async () => {
        if (!combinedPayload) return;
        setSubmitting(true);
        setErrorText(null);
        setFieldErrors({});
        try {
            await signUpUser(combinedPayload as SignInRequest);
            setDraft(null);
            router.replace("/home");
        } catch (e) {
            if (e instanceof ApiError && e.data && typeof e.data === "object") {
                setFieldErrors(e.data as DrfErrors);
                setErrorText("Please fix the highlighted fields.");
            } else {
                setErrorText((e instanceof Error && e.message) ? e.message : "Signup failed.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="hidden md:block bg-[url('/assets/images/auth.jpg')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
            </div>
                            <div className="absolute top-4 left-4 md:hidden">
                                <BackButton />
                            </div>
            

            <div className="relative flex items-center justify-center p-6 sm:p-8">
                <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold text-center">Account Setup</h2>
                    <p className="text-center text-sm text-gray-600 mb-6">
                        We’ll use these to build your profile. You can skip for now.
                    </p>

                    {step === "edit" && (
                        <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); onContinue(); }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First name</label>
                                    <input
                                        name="first_name"
                                        className={`mt-1 w-full rounded-lg border ${fieldErrors.first_name ? "border-red-400" : "border-gray-300"} bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400`}
                                        onChange={handleChange}
                                        autoComplete="given-name"
                                    />
                                    {fieldErrors.first_name && <ErrorText>{fieldErrors.first_name.join(", ")}</ErrorText>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last name</label>
                                    <input
                                        name="last_name"
                                        className={`mt-1 w-full rounded-lg border ${fieldErrors.last_name ? "border-red-400" : "border-gray-300"} bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400`}
                                        onChange={handleChange}
                                        autoComplete="family-name"
                                    />
                                    {fieldErrors.last_name && <ErrorText>{fieldErrors.last_name.join(", ")}</ErrorText>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Avatar URL (optional)</label>
                                <input
                                    name="avatar"
                                    className={`mt-1 w-full rounded-lg border ${fieldErrors.avatar ? "border-red-400" : "border-gray-300"} bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400`}
                                    onChange={handleChange}
                                />
                                {fieldErrors.avatar && <ErrorText>{fieldErrors.avatar.join(", ")}</ErrorText>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Profile bio</label>
                                <textarea
                                    name="bio"
                                    className={`mt-1 w-full rounded-lg border ${fieldErrors.bio ? "border-red-400" : "border-gray-300"} bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400`}
                                    onChange={handleChange}
                                />
                                {fieldErrors.bio && <ErrorText>{fieldErrors.bio.join(", ")}</ErrorText>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone number</label>
                                <input
                                    name="phone_number"
                                    className={`mt-1 w-full rounded-lg border ${fieldErrors.phone_number ? "border-red-400" : "border-gray-300"} bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400`}
                                    onChange={handleChange}
                                />
                                {fieldErrors.phone_number && <ErrorText>{fieldErrors.phone_number.join(", ")}</ErrorText>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Date of birth</label>
                                    <input
                                        name="date_of_birth"
                                        type="date"
                                        className={`mt-1 w-full rounded-lg border ${fieldErrors.date_of_birth ? "border-red-400" : "border-gray-300"} bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400`}
                                        onChange={handleChange}
                                    />
                                    {fieldErrors.date_of_birth && <ErrorText>{fieldErrors.date_of_birth.join(", ")}</ErrorText>}
                                </div>
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select
                                        name="gender"
                                        className={`mt-1 w-full rounded-lg border ${fieldErrors.gender ? "border-red-400" : "border-gray-300"} bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400`}
                                        defaultValue="prefer_not_say"
                                        onChange={handleChange}
                                    >
                                        <option value="prefer_not_say">Prefer not to say</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {fieldErrors.gender && <ErrorText>{fieldErrors.gender.join(", ")}</ErrorText>}
                                </div>
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">City ID</label>
                                    <input
                                        name="city"
                                        className={`mt-1 w-full rounded-lg border ${fieldErrors.city ? "border-red-400" : "border-gray-300"} bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-400`}
                                        onChange={handleChange}
                                        placeholder="e.g. 42"
                                    />
                                    {fieldErrors.city && <ErrorText>{fieldErrors.city.join(", ")}</ErrorText>}
                                </div>
                            </div>

                            {/* Buttons now use the shared <Button /> like Auth */}
                            <div className="flex gap-3 mt-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onSkip}
                                    className="flex-1"
                                >
                                    Skip for now
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                >
                                    Review
                                </Button>
                            </div>
                                <span className="text-sm text-gray-600">
                                    Want to start all over?
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size= "sm"
                                    onClick={() => router.push("/auth?mode=signup")}
                                    className="flex-1"
                                >
                                    Back to signup
                                </Button>
                            </span>
                        </form>
                    )}

                    {step === "review" && combinedPayload && (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-4 sm:p-5">
                                <h3 className="font-semibold mb-2">Review your details</h3>
                                <ul className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                    <li><b>Email:</b> {draft?.email}</li>
                                    <li><b>Username:</b> {draft?.username}</li>
                                    <li><b>First name:</b> {combinedPayload.first_name ?? <em className="text-gray-400">—</em>}</li>
                                    <li><b>Last name:</b> {combinedPayload.last_name ?? <em className="text-gray-400">—</em>}</li>
                                    <li><b>Phone:</b> {combinedPayload.phone_number ?? <em className="text-gray-400">—</em>}</li>
                                    <li><b>DOB:</b> {combinedPayload.date_of_birth ?? <em className="text-gray-400">—</em>}</li>
                                    <li><b>Gender:</b> {combinedPayload.gender ?? <em className="text-gray-400">—</em>}</li>
                                    <li><b>City ID:</b> {combinedPayload.city ?? <em className="text-gray-400">—</em>}</li>
                                    <li className="sm:col-span-2"><b>Avatar:</b> {combinedPayload.avatar ?? <em className="text-gray-400">—</em>}</li>
                                    <li className="sm:col-span-2"><b>Bio:</b> {combinedPayload.bio ?? <em className="text-gray-400">—</em>}</li>
                                </ul>
                            </div>

                            {Object.keys(fieldErrors).length > 0 && <ErrorAlert errors={fieldErrors} />}

                            {errorText && Object.keys(fieldErrors).length === 0 && (
                                <p className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                                    {errorText}
                                </p>
                            )}

                            {/* Buttons: Back (secondary) + Create account (primary) */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onBack}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    onClick={onSubmit}
                                    disabled={submitting}
                                    className="flex-1"
                                >
                                    {submitting ? "Creating..." : "Create account"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
