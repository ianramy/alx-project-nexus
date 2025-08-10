// src/pages/profile.tsx

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Challenge } from "@/interfaces/challenge";
import { Leaderboard } from "@/interfaces/leaderboard";
import { Action } from "@/interfaces/action";
import {
    fetchUserChallenges,
    fetchUserLeaderboard,
    fetchUserActions,
} from "@/utils/profile";
import { ApiError } from "@/utils/http";
import Logout from "@/components/auth/Logout";
import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import { useRouter } from "next/router";
import Image from "next/image";
import ProfileModal, { EditableUser } from "@/components/profile/ProfileModal";


type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; kind: ToastKind; message: string };

export default function ProfilePage() {
    // if your hook exposes a type, replace this `unknown` with it
    const { user, loading: userLoading } = useAuth() as {
        user: Partial<EditableUser> | null;
        loading: boolean;
    };

    const [profile, setProfile] = useState<EditableUser | null>(null);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);
    const [authFailed, setAuthFailed] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const router = useRouter();

    // tiny toast system
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const idRef = useRef(1);
    const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
    const notify = useCallback((kind: ToastKind, message: string, ttl = 4000) => {
        const id = idRef.current++;
        setToasts(prev => [...prev, { id, kind, message }]);
        timersRef.current[id] = setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
            delete timersRef.current[id];
        }, ttl);
    }, []);
    const dismissToast = (id: number) => {
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
        setToasts(prev => prev.filter(t => t.id !== id));
    };
    useEffect(() => () => {
        Object.values(timersRef.current).forEach(clearTimeout);
        timersRef.current = {};
    }, []);

    // map auth user → local editable snapshot
    useEffect(() => {
        if (user) {
            setProfile({
                id: user.id,
                username: user.username ?? "",
                email: user.email ?? "",
                first_name: user.first_name ?? "",
                last_name: user.last_name ?? "",
                bio: user.bio ?? "",
                avatar: user.avatar ?? "",
                phone_number: user.phone_number ?? "",
                date_of_birth: user.date_of_birth ?? null,
                gender: user.gender ?? "",
                city: user.city ?? null,
            });
        }
    }, [user]);

    useEffect(() => {
        const loadData = async (uid: number | undefined) => {
            try {
                const [userChallenges, userLeaderboard, userActions] = await Promise.all([
                    fetchUserChallenges(uid),
                    fetchUserLeaderboard(),
                    fetchUserActions(),
                ]);
                setChallenges(userChallenges);
                setLeaderboard(userLeaderboard);
                setActions(userActions);
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    setAuthFailed(true);
                    notify("error", "Your session has expired. Please log in again.");
                } else {
                    notify("error", "We couldn’t load your profile data. Try again in a bit.");
                    // still show page shell
                }
            } finally {
                setLoading(false);
            }
        };

        if (!userLoading) {
            if (!user) {
                setAuthFailed(true);
                setLoading(false);
            } else {
                loadData(Number(user.id));
            }
        }
    }, [userLoading, user, notify]);

    // Gate: not authenticated
    if (authFailed) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="bg-white p-6 rounded-lg shadow-sm text-gray-800 max-w-sm w-full">
                    <h1 className="text-lg font-semibold">You’re not logged in</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        We couldn’t verify your session. Log in to view your profile.
                    </p>
                    <div className="mt-4 flex gap-2">
                        <Button
                            onClick={() => router.push("/auth?mode=login")}
                            className="w-full rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2"
                        >
                            Go to Login
                        </Button>
                        <Button
                            onClick={() => router.reload()}
                            className="w-full rounded-md border border-gray-300 px-4 py-2"
                        >
                            Retry
                        </Button>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                        Need an account? <Link href="/signup" className="text-emerald-700 hover:underline">Sign up</Link>
                    </div>
                </div>
            </div>
        );
    }

    // Loading shell
    if (userLoading || loading || !profile) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="bg-white p-4 rounded-lg shadow-sm text-gray-700 font-medium">
                    Loading your profile…
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-20">
                <div className="flex items-center justify-between px-6 py-4">
                    <BackButton className="text-white" />
                    <div className="w-12" />
                    <Link href="/home" className="font-semibold tracking-tight text-lg hover:opacity-80 transition">
                        <span className="text-green-600 dark:text-green-400">Carbon</span>Jar
                    </Link>
                </div>
            </header>

            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3" />
            </div>

            <div className="mx-auto max-w-6xl px-6 pb-12 space-y-6">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        {profile.avatar ? (
                            <Image
                                src={profile.avatar}
                                alt="Avatar"
                                width={64}
                                height={64}
                                className="rounded-full object-cover ring-2 ring-green-500"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">
                                {profile.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
                            <p className="text-gray-600">Welcome, {profile.username}</p>
                            <p className="text-sm text-gray-500">{profile.email}</p>
                            {profile.bio ? <p className="text-sm text-gray-500 mt-1">{profile.bio}</p> : null}
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setIsEditOpen(true)}
                                className="gap-3 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                            >
                                Edit profile
                            </Button>
                            <Logout />
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Leaderboard */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Leaderboard</h2>
                        {leaderboard.length === 0 ? (
                            <p className="text-gray-500">No leaderboard entries yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {leaderboard.map((entry) => (
                                    <li
                                        key={entry.id}
                                        className="flex justify-between items-center p-2 rounded-md bg-gray-50 border"
                                    >
                                        <span className="truncate">{entry.challenge?.title ?? "Challenge"}</span>
                                        <span className="font-semibold">{entry.score} pts</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Challenges */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Challenges</h2>
                        {challenges.length === 0 ? (
                            <p className="text-gray-500">You haven’t joined any challenges yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {challenges.map((c) => (
                                    <li key={c.id} className="p-2 rounded-md bg-gray-50 border">
                                        📌 {c.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-5 lg:col-span-1 md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Eco Actions</h2>
                        {actions.length === 0 ? (
                            <p className="text-gray-500">No actions logged yet.</p>
                        ) : (
                            <ul className="space-y-2 max-h-72 overflow-auto pr-1">
                                {actions.map((a) => (
                                    <li key={a.id} className="p-2 rounded-md bg-gray-50 border">
                                        ♻️ <span className="font-medium">{a.action_type}</span>: {a.description}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <ProfileModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                initial={profile}
                onSaved={(u) => setProfile((prev) => ({ ...(prev ?? {}), ...u }))}
                loading={saving}
                setLoading={setSaving}
            />

            <ToastStack toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
}

/* Toast UI (inline, no libs) */
function ToastStack({
    toasts,
    onDismiss,
}: {
    toasts: { id: number; kind: "success" | "error" | "info"; message: string }[];
    onDismiss: (id: number) => void;
}) {
    return (
        <div className="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-2" aria-live="polite" aria-atomic="false">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`
						pointer-events-auto w-80 max-w-[90vw] rounded-xl px-4 py-3 shadow-lg ring-1
						${t.kind === "success" ? "bg-emerald-600/95 ring-emerald-400/30 text-white" : ""}
						${t.kind === "error" ? "bg-rose-600/95 ring-rose-400/30 text-white" : ""}
						${t.kind === "info" ? "bg-slate-800/90 ring-white/10 text-white" : ""}
						backdrop-blur-md
					`}
                    role="status"
                >
                    <div className="flex items-start gap-3">
                        <span className="text-lg leading-none" aria-hidden>
                            {t.kind === "success" ? "✅" : t.kind === "error" ? "⚠️" : "🔔"}
                        </span>
                        <p className="text-sm leading-snug flex-1">{t.message}</p>
                        <button
                            onClick={() => onDismiss(t.id)}
                            className="ml-1 rounded-md px-2 py-1 text-xs bg-white/10 hover:bg-white/20 transition"
                            type="button"
                            aria-label="Dismiss notification"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
