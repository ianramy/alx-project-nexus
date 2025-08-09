// src/pages/challenges/index.tsx

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchChallenges } from "@/utils/challenges";
import { Challenge } from "@/interfaces/challenge";
import { ChallengeCard } from "@/components/challenge/ChallengeCard";
import BackButton from "@/components/common/BackButton";
import { useRouter } from "next/router";


type BucketKey = "lt3" | "lt7" | "lt30" | "expired";

const BUCKETS: { key: BucketKey; title: string; predicate: (days: number | null) => boolean; sortAsc?: boolean }[] = [
    { key: "lt3", title: "Ending in < 3 days", predicate: d => d !== null && d >= 0 && d < 3, sortAsc: true },
    { key: "lt7", title: "Ending in < 1 week", predicate: d => d !== null && d >= 3 && d < 7, sortAsc: true },
    { key: "lt30", title: "Ending in < 1 month", predicate: d => d !== null && d >= 7 && d < 30, sortAsc: true },
    { key: "expired", title: "Expired", predicate: d => d !== null && d < 0, sortAsc: false },
];

function daysUntil(dateStr?: string | null): number | null {
    if (!dateStr) return null;
    const end = new Date(dateStr).getTime();
    if (Number.isNaN(end)) return null;
    const diff = end - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter()

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await fetchChallenges();
                if (mounted) setChallenges(data ?? []);
            } catch {
                if (mounted) setChallenges([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Pre-compute days + group into buckets
    const grouped = useMemo(() => {
        const byBucket: Record<BucketKey, (Challenge & { __days: number | null })[]> = {
            lt3: [], lt7: [], lt30: [], expired: []
        };
        for (const ch of challenges) {
            const d = daysUntil(ch?.end_date);
            const enriched = { ...ch, __days: d };
            const bucket = BUCKETS.find(b => b.predicate(d));
            if (bucket) byBucket[bucket.key].push(enriched);
        }
        // sort each bucket (soonest first; expired -> most recently expired first)
        for (const b of BUCKETS) {
            const arr = byBucket[b.key];
            arr.sort((a, z) => {
                const da = a.__days ?? 9e9;
                const dz = z.__days ?? 9e9;
                return (b.sortAsc ? da - dz : dz - da);
            });
        }
        return byBucket;
    }, [challenges]);

    return (
        <div className="relative min-h-screen text-white">
            {/* Background */}
            <div className="absolute inset-0 -z-20">
                <Image
                    src="/assets/images/challenge.jpg"
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
					bg-[radial-gradient(120%_100%_at_50%_0%,rgba(0,0,0,0.35),rgba(0,0,0,0.65))]
					backdrop-blur-[2px]
				`}
                aria-hidden
            />

            {/* Header */}
            <header className="sticky top-0 z-30">
                <div className="flex items-center justify-between px-6 h-14">
                    <BackButton onClick={() => router.push("/home")} />
                    <Link
                        href="/home"
                        className="flex items-center font-semibold tracking-tight text-lg leading-none hover:opacity-80 transition"
                    >
                        <span className="text-green-600 dark:text-green-400">Carbon</span>Jar
                    </Link>
                </div>
            </header>

            <main className="px-6 pt-10 pb-16 space-y-12">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                    Challenges
                </h1>
                {BUCKETS.map(({ key, title }) => (
                    <Row
                        key={key}
                        title={title}
                        items={grouped[key]}
                        loading={loading}
                    />
                ))}

                {!loading && BUCKETS.every(b => grouped[b.key].length === 0) && (
                    <div className="mt-6 rounded-2xl bg-white/10 ring-1 ring-white/10 p-6 max-w-xl">
                        <p className="text-white/90 text-sm">No challenges right now. Check back soon—or create one. 💪</p>
                    </div>
                )}
            </main>

            <style jsx global>{`
				/* Hide scrollbar */
				.scrollbar-hide::-webkit-scrollbar { display: none; }
				.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
			`}</style>
        </div>
    );
}

function Row({
    title,
    items,
    loading
}: {
    title: string;
    items: (Challenge & { __days: number | null })[];
    loading: boolean;
}) {
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const skeletons = useMemo(() => Array.from({ length: 6 }), []);

    const nudge = (dir: "left" | "right") => {
        const el = scrollerRef.current;
        if (!el) return;
        const amount = Math.min(520, el.clientWidth * 0.85);
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">{title}</h2>
                <div className="hidden md:flex gap-2">
                    <button
                        onClick={() => nudge("left")}
                        type="button"
                        className="rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 px-3 py-2 ring-1 ring-white/10 transition"
                        aria-label={`Scroll ${title} left`}
                    >←</button>
                    <button
                        onClick={() => nudge("right")}
                        type="button"
                        className="rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 px-3 py-2 ring-1 ring-white/10 transition"
                        aria-label={`Scroll ${title} right`}
                    >→</button>
                </div>
            </div>

            <div
                ref={scrollerRef}
                role="list"
                aria-label={`${title} challenges`}
                className={`
					mt-2 flex overflow-x-auto gap-6 pb-10 snap-x snap-mandatory
					scrollbar-hide
					[mask-image:linear-gradient(to_right,transparent,black_64px,black_calc(100%-64px),transparent)]
				`}
            >
                {loading && skeletons.map((_, i) => (
                    <div key={`sk-${i}`} role="listitem" aria-hidden className="flex-shrink-0 w-[22rem] snap-center">
                        <div className="h-56 rounded-2xl bg-white/15 animate-pulse ring-1 ring-white/10" />
                    </div>
                ))}

                {!loading && items.length === 0 && (
                    <div className="w-full">
                        <div className="mt-4 rounded-2xl bg-white/10 ring-1 ring-white/10 p-4 max-w-xl">
                            <p className="text-white/90 text-sm">No items here.</p>
                        </div>
                    </div>
                )}

                {!loading && items.map((challenge) => (
                    <div
                        key={challenge?.id ?? challenge.title}
                        role="listitem"
                        className={`
							flex-shrink-0 w-[22rem] snap-center
							transform transition-transform duration-300 hover:scale-[1.03]
						`}
                    >
                        <Link
                            href={`/challenges/${(challenge).id}`}
                            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl"
                        >
                            {/* Uniform height wrapper so long text doesn’t change card size */}
                            <div className="h-56 p-6">
                                <ChallengeCard
                                    title={challenge.title}
                                    end_date={challenge.end_date}
                                />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
