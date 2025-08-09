// src/pages/actions/[id].tsx
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { fetchActions } from "@/utils/actions";
import { Action } from "@/interfaces/action";
import BackButton from "@/components/common/BackButton";

const iconForType = (t: string) => {
    const key = (t || "").toLowerCase();
    if (key.includes("recycle") || key.includes("plastic")) return "♻️";
    if (key.includes("plant") || key.includes("meatless")) return "🌱";
    if (key.includes("energy")) return "⚡";
    if (key.includes("water")) return "💧";
    if (key.includes("transport")) return "🚲";
    return "✅";
};

export default function ActionDetailPage() {
    const router = useRouter();
    const [action, setAction] = useState<Action | null>(null);
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
                const data = await fetchActions();
                const found = data?.find((a) => Number(a.id) === idNum) ?? null;
                if (mounted) setAction(found);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [router.isReady, idNum]);

    const share = async () => {
        try {
            const url = typeof window !== "undefined" ? window.location.href : "";
            if ((navigator as any).share) {
                await (navigator as any).share({ title: action?.action_type, text: action?.description, url });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
            }
        } catch {
            // no-op
        }
    };

    return (
        <div className="relative min-h-screen text-white">
            <Head>
                <title>{action ? `${action.action_type} • Eco Action` : "Action • Eco"}</title>
            </Head>

            {/* Background */}
            <div className="absolute inset-0 -z-20">
                <Image
                    src="/assets/images/recycle.jpg"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 to-black/80 backdrop-blur-[2px]" />

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

            <main className="mx-auto max-w-5xl px-6 py-8">
                {/* Loading / Not found */}
                {loading && (
                    <div className="mx-auto h-64 max-w-3xl rounded-3xl bg-white/20 animate-pulse ring-1 ring-white/10" />
                )}
                {!loading && !action && (
                    <div className="mx-auto max-w-3xl rounded-2xl bg-white/10 ring-1 ring-white/10 p-6">
                        <p className="text-white/90">We couldn’t find that action.</p>
                        <div className="mt-4">
                            <Link href="/actions" className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/20 transition">
                                Browse actions
                            </Link>
                        </div>
                    </div>
                )}

                {/* Content */}
                {!loading && action && (
                    <section
                        className={`
							relative overflow-hidden rounded-3xl
							bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl
							ring-1 ring-black/5 shadow-[0_25px_60px_-25px_rgba(0,0,0,.6)]
						`}
                    >
                        {/* ambient accents */}
                        <div className="pointer-events-none absolute -top-24 -right-10 h-52 w-52 rounded-full bg-emerald-400/25 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-20 -left-8 h-44 w-44 rounded-full bg-lime-300/20 blur-3xl" />

                        <div className="p-6 md:p-8">
                            <header className="flex items-start gap-4">
                                <div
                                    className={`
										shrink-0 grid place-items-center h-12 w-12 rounded-2xl text-2xl text-white
										bg-gradient-to-br from-emerald-500 to-green-600 ring-1 ring-white/25 shadow-md
									`}
                                    aria-hidden
                                >
                                    {iconForType(action.action_type)}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        {action.action_type}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                        Eco Action • ID #{action.id}
                                    </p>
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <button
                                        onClick={share}
                                        className="rounded-lg px-3 py-2 text-sm bg-white/10 hover:bg-white/20 ring-1 ring-white/15 transition"
                                        type="button"
                                    >
                                        Share
                                    </button>
                                </div>
                            </header>

                            <hr className="my-6 border-white/20" />

                            <article className="grid gap-6 md:grid-cols-[1fr_280px]">
                                <div>
                                    <h3 className="text-lg font-semibold text-white/95">Description</h3>
                                    <p className="mt-2 text-slate-800/90 dark:text-slate-200 leading-relaxed">
                                        {action.description}
                                    </p>
                                </div>

                                <aside className="order-first md:order-none">
                                    <div className="rounded-2xl bg-white/70 dark:bg-slate-800/70 ring-1 ring-black/5 p-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Points</p>
                                        <p className="mt-1 text-3xl font-extrabold text-emerald-500">
                                            {Number(action.points ?? 0).toLocaleString()}
                                        </p>

                                        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

                                        <div className="mt-4 grid gap-2 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600 dark:text-slate-300">Category</span>
                                                <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 px-2 py-0.5 text-xs ring-1 ring-emerald-600/20">
                                                    {action.action_type}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600 dark:text-slate-300">Status</span>
                                                <span className="rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 px-2 py-0.5 text-xs ring-1 ring-emerald-600/20">
                                                    Available
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold px-4 py-2.5 transition"
                                            onClick={() => alert("Marked as done! (wire this to your API)")}
                                        >
                                            Mark as done
                                        </button>
                                    </div>
                                </aside>
                            </article>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
