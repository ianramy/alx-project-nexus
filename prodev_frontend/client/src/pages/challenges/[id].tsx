// src/pages/challenges/[id].tsx

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { fetchChallenges } from "@/utils/challenges";
import { Challenge } from "@/interfaces/challenge";
import BackButton from "@/components/common/BackButton";


function daysUntil(dateStr?: string | null): number | null {
    if (!dateStr) return null;
    const t = new Date(dateStr).getTime();
    if (Number.isNaN(t)) return null;
    return Math.ceil((t - Date.now()) / (1000 * 60 * 60 * 24));
}

function formatDeadline(dateStr?: string | null): string {
    if (!dateStr) return "No deadline";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ChallengeDetailPage() {
    const router = useRouter();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(true);

    const idNum = useMemo(() => {
        const raw = router.query.id;
        const v = Array.isArray(raw) ? raw[0] : raw;
        return v ? Number(v) : NaN;
    }, [router.query.id]);

    useEffect(() => {
        if (!router.isReady || Number.isNaN(idNum)) return;
        let mounted = true;
        (async () => {
            try {
                const data = await fetchChallenges();
                const found = data?.find((c) => Number(c.id) === idNum) ?? null;
                if (mounted) setChallenge(found);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [router.isReady, idNum]);

    const dLeft = daysUntil(challenge?.end_date);
    const deadlineText =
        dLeft === null ? "No deadline" :
            dLeft < 0 ? "Expired" :
                dLeft === 0 ? "Ends today" :
                    dLeft === 1 ? "Ends in 1 day" :
                        `Ends in ${dLeft} days`;

    const statusClass =
        dLeft === null ? "bg-slate-200 text-slate-700 ring-slate-400/30 dark:bg-slate-700 dark:text-slate-200" :
            dLeft < 0 ? "bg-rose-100 text-rose-800 ring-rose-500/20 dark:bg-rose-900/30 dark:text-rose-200" :
                dLeft < 3 ? "bg-amber-100 text-amber-800 ring-amber-500/20 dark:bg-amber-900/30 dark:text-amber-200" :
                    dLeft < 7 ? "bg-yellow-100 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-200" :
                        "bg-emerald-100 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-200";

    const handleJoin = () => {
        alert("Join challenge clicked. Wire this to your API.");
    };
    const handleShare = async () => {
        try {
            const url = typeof window !== "undefined" ? window.location.href : "";
            if ((navigator as any).share) {
                await (navigator as any).share({ title: challenge?.title, text: challenge?.description, url });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                alert("Link copied to clipboard");
            }
        } catch { /* no-op */ }
    };

    return (
        <div className="relative min-h-screen text-white">
            <Head>
                <title>{challenge ? `${challenge.title} • Challenge` : "Challenge • Loading"}</title>
            </Head>

            {/* Background */}
            <div className="absolute inset-0 -z-20">
                <Image
                    src="/assets/images/challenge.jpg" /* reuse your team/green photo */
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
            </div>
            <div
                className={`
					absolute inset-0 -z-10
					bg-[radial-gradient(120%_100%_at_50%_0%,rgba(0,0,0,0.35),rgba(0,0,0,0.7))]
					backdrop-blur-[2px]
				`}
            />

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

            <main className="mx-auto max-w-6xl px-6 py-8">
                {/* Loading / Not found */}
                {loading && (
                    <div className="mx-auto h-64 max-w-3xl rounded-3xl bg-white/20 animate-pulse ring-1 ring-white/10" />
                )}
                {!loading && !challenge && (
                    <div className="mx-auto max-w-3xl rounded-2xl bg-white/10 ring-1 ring-white/10 p-6">
                        <p className="text-white/90">We couldn’t find that challenge.</p>
                        <div className="mt-4">
                            <Link href="/challenges" className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/20 transition">
                                Browse challenges
                            </Link>
                        </div>
                    </div>
                )}

                {/* Content */}
                {!loading && challenge && (
                    <section
                        className={`
							relative overflow-hidden rounded-3xl
							bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl
							ring-1 ring-black/5 shadow-[0_25px_60px_-25px_rgba(0,0,0,.6)]
						`}
                    >
                        {/* Ambient accents */}
                        <div className="pointer-events-none absolute -top-24 -right-10 h-52 w-52 rounded-full bg-emerald-400/25 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-20 -left-8 h-44 w-44 rounded-full bg-lime-300/20 blur-3xl" />
                        <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:radial-gradient(1px_1px_at_12px_12px,#000_1px,transparent_0)] [background-size:14px_14px]" />

                        <div className="p-4 sm:p-6 md:p-8">
                            {/* Title + status */}
                            <header className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                                <div
                                    className={`
										shrink-0 grid place-items-center h-10 w-10 sm:h-12 sm:w-12
                                        rounded-2xl text-xl sm:text-2xl text-white
										bg-gradient-to-br from-emerald-500 to-green-600 ring-1 ring-white/25 shadow-md
				                    `}
                                    aria-hidden
                                >
                                    🏁
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white break-words">
                                        {challenge.title}
                                    </h2>
                                    <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                        Deadline: {formatDeadline(challenge.end_date)}
                                    </p>
                                </div>
                                <div className="sm:ml-auto flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                                    <button
                                        onClick={handleShare}
                                        type="button"
                                        className="rounded-lg px-3 py-2 text-sm bg-white/10 hover:bg-white/20 ring-1 ring-white/15 transition w-full sm:w-auto"
                                    >
                                        Share
                                    </button>
                                </div>
                            </header>

                            <hr className="my-6 border-white/20" />

                            {/* Main grid */}
                            <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_320px]">
                                <article>
                                    <h3 className="text-base sm:text-lg font-semibold text-white/95">About this challenge</h3>
                                    <p className="mt-3 text-[15px] sm:text-base text-slate-800/90 dark:text-slate-200 leading-relaxed">
                                        {challenge.description}
                                    </p>
                                </article>

                                <aside className="lg:contents">
                                    <div className="rounded-2xl bg-white/70 dark:bg-slate-800/70 ring-1 ring-black/5 p-4 sm:p-5 lg:sticky lg:top-24">
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Status</p>
                                        <p className="mt-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${statusClass}`}>
                                                {deadlineText}
                                            </span>
                                        </p>

                                        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

                                        <button
                                            type="button"
                                            onClick={handleJoin}
                                            className="mt-5 lg:inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold px-4 py-2.5 transition"
                                        >
                                            Join challenge
                                        </button>
                                    </div>
                                </aside>
                            </div>

                            {/* Participants */}
                            <section className="mt-8 sm:mt-10">
                                <h3 className="text-base sm:text-lg font-semibold text-white/95">Participants</h3>

                                {(!challenge.participants || challenge.participants.length === 0) ? (
                                    <p className="mt-3 text-slate-300 sm:text-slate-400">No participants yet.</p>
                                ) : (
                                        <ul className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                        {challenge.participants.map((user) => {
                                            const initials = (user?.username || "?")
                                                .split(" ")
                                                .map((p) => p.trim()[0])
                                                .filter(Boolean)
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase() || "?";
                                            return (
                                                <li key={user.id} className="flex items-center gap-3 rounded-xl bg-white/70 dark:bg-slate-800/70 ring-1 ring-black/5 px-3 py-2">
                                                    {user.avatar ? (
                                                        /* If you allow remote avatars, consider Next <Image> with domain config */
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.username}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white grid place-items-center font-semibold">
                                                            {initials}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-slate-900 dark:text-white truncate">{user.username}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Participant</p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </section>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
