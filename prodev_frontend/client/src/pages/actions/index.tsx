// src/pages/actions/index.tsx

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchActionTemplates } from "@/utils/actions";
import { Action } from "@/interfaces/action";
import { ActionCard } from "@/components/action/ActionCard";
import BackButton from "@/components/common/BackButton";
import { useRouter } from "next/router";

// Nice helper to present titles consistently (e.g. "plant-based" => "Plant-Based")
const titleCase = (s: string) =>
    s
        .toLowerCase()
        .split(/\s+/g)
        .map(word => word.replace(/^\p{L}/u, ch => ch.toUpperCase()))
        .join(" ");

// Use a canonical key so "Transport" and "transport" map to the same row
const canonicalKey = (s: string) => s.trim().toLowerCase();

export default function ActionsPage() {
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await fetchActionTemplates(); // ⬅️ public catalog
                if (mounted) setActions(data ?? []);
            } catch {
                if (mounted) setActions([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Build a stable list of discovered action types from the data
    const { typeOrder, grouped } = useMemo(() => {
        // Group actions by their actual action_type (canonicalized)
        const tmp: Record<string, { title: string; items: Action[] }> = Object.create(null);

        for (const a of actions) {
            const raw = (a.action_type ?? "").toString().trim();
            const hasType = raw.length > 0;
            const key = hasType ? canonicalKey(raw) : "__other__";
            const title = hasType ? titleCase(raw) : "Other";

            if (!tmp[key]) tmp[key] = { title, items: [] };
            tmp[key].items.push(a);
        }

        // Derive a deterministic order:
        // 1) Alphabetical by title
        // 2) "Other" always last
        const order = Object
            .entries(tmp)
            .sort(([, a], [, b]) => {
                if (a.title === "Other") return 1;
                if (b.title === "Other") return -1;
                return a.title.localeCompare(b.title);
            })
            .map(([k]) => k);

        return {
            typeOrder: order,
            grouped: tmp
        };
    }, [actions]);

    return (
        <div className="relative min-h-screen text-white">
            {/* Background as real image */}
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
                    <BackButton onClick={() => router.push("/home")} />
                    <div className="w-12" />
                    <Link href="/home" className="font-semibold tracking-tight text-lg hover:opacity-80 transition">
                        <span className="text-green-600 dark:text-green-400">Carbon</span>Jar
                    </Link>
                </div>
            </header>

            <main className="px-6 pt-8 pb-16 space-y-12">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                    Eco Actions
                </h1>

                {/* Dynamically render rows for each discovered action_type */}
                {(loading ? [0, 1, 2] : typeOrder).map((key, i) => {
                    const rowTitle = loading ? "Loading…" : grouped[key].title;
                    const items = loading ? [] : grouped[key].items;

                    return (
                        <CategoryRow
                            key={loading ? `sk-${i}` : key}
                            title={rowTitle}
                            items={items}
                            loading={loading}
                        />
                    );
                })}

                {/* If nothing at all */}
                {!loading && typeOrder.length === 0 && (
                    <div className="mt-6 rounded-2xl bg-white/10 ring-1 ring-white/10 p-6 max-w-xl">
                        <p className="text-white/90 text-sm">No actions yet. Add some and let’s make the planet blush. 🌍</p>
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

/* ---------- Row component (Netflix-style) ---------- */
function CategoryRow({
    title,
    items,
    loading
}: {
    title: string;
    items: Action[];
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
                aria-label={`${title} actions`}
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
                            <p className="text-white/90 text-sm">No actions in {title} yet.</p>
                        </div>
                    </div>
                )}

                {!loading && items.map((action) => (
                    <div
                        key={action.id}
                        role="listitem"
                        className={`
							flex-shrink-0 w-[22rem] snap-center
							transform transition-transform duration-300 hover:scale-[1.03]
						`}
                    >
                        <Link href={`/actions/${action.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl">
                            {/* Uniform height wrapper so long text doesn't change card size */}
                            <div className="h-56">
                                <ActionCard
                                    action_type={action.action_type}
                                    description={action.description}
                                />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
