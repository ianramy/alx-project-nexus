// src/pages/leaderboard/index.tsx
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchLeaderboard } from "@/utils/leaderboard";
import { Leaderboard } from "@/interfaces/leaderboard";
import BackButton from "@/components/common/BackButton";
import { LeaderboardEntry } from "@/components/leaderboard/LeaderboardEntry";

type Dir = "forward" | "backward";

export default function LeaderboardPage() {
    const [entries, setEntries] = useState<Leaderboard[]>([]);
    const [loading, setLoading] = useState(true);

    // sliding window: exactly 4 visible
    const visibleLimit = 4;
    const [startIndex, setStartIndex] = useState(0);
    const [dir, setDir] = useState<Dir>("forward");

    // throttle wheel spam
    const gateRef = useRef<number>(0);
    const touchStartY = useRef<number | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await fetchLeaderboard();
                if (mounted) setEntries(data ?? []);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // max score for relative bar
    const maxScore = useMemo(
        () => Math.max(1, ...entries.map(e => Number((e as any)?.score) || 0)),
        [entries]
    );

    const maxStart = Math.max(0, entries.length - visibleLimit);

    const step = (nextDir: Dir) => {
        const now = Date.now();
        if (now - gateRef.current < 200) return; // throttle
        gateRef.current = now;

        setDir(nextDir);
        setStartIndex(prev => {
            if (nextDir === "forward") return Math.min(maxStart, prev + 1);
            return Math.max(0, prev - 1);
        });
    };

    // mouse wheel (trap page scroll)
    const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
        if (e.deltaY > 6) {
            e.preventDefault();
            if (entries.length > visibleLimit && startIndex < maxStart) step("forward");
        } else if (e.deltaY < -6) {
            e.preventDefault();
            if (entries.length > visibleLimit && startIndex > 0) step("backward");
        }
    };

    // touch swipe
    const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
        touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
        if (touchStartY.current == null) return;
        const dy = touchStartY.current - e.changedTouches[0].clientY;
        if (dy > 24 && startIndex < maxStart) step("forward");
        if (dy < -24 && startIndex > 0) step("backward");
        touchStartY.current = null;
    };

    // keyboard
    const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if ([" ", "ArrowDown", "PageDown"].includes(e.key)) {
            e.preventDefault();
            if (entries.length > visibleLimit && startIndex < maxStart) step("forward");
        }
        if (["ArrowUp", "PageUp"].includes(e.key)) {
            e.preventDefault();
            if (entries.length > visibleLimit && startIndex > 0) step("backward");
        }
    };

    // slice current window (or all if <= 4)
    const windowed = !loading
        ? (entries.length <= visibleLimit
            ? entries
            : entries.slice(startIndex, startIndex + visibleLimit))
        : [];

    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            {/* Background with trophy on the left */}
            <div className="absolute inset-0 -z-20">
                <Image
                    src="/assets/images/leaderboard.jpg"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-black/70 via-black/40 to-transparent" />

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20">
                <div className="flex items-center justify-between px-6 py-4">
                    <BackButton className="text-white" />
                    <div className="w-12" />
                </div>
            </header>

            {/* Trophy left, table right */}
            <main
                className="relative mx-auto h-screen max-w-7xl px-6 md:px-10 grid grid-cols-1 md:grid-cols-[1.05fr_1fr] items-center"
                onWheel={onWheel}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onKeyDown={onKeyDown}
                tabIndex={0}
                aria-label="Leaderboard reveal panel"
            >
                <div className="hidden md:block" aria-hidden />

                <div className={`
					ml-auto w-full max-w-2xl
					bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl
					rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)]
					ring-1 ring-black/5
					p-6 md:p-8
				`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white/95">Top performers</h2>
                        <p className="text-xs text-white/70">Scroll / Swipe / Space</p>
                    </div>

                    <div className="space-y-3 overflow-hidden">
                        {loading && Array.from({ length: 4 }).map((_, i) => (
                            <div key={`s-${i}`} className="h-16 rounded-2xl bg-white/20 animate-pulse ring-1 ring-white/10" />
                        ))}

                        {!loading && windowed.map((entry, i) => {
                            // --- FIX: pick display fields safely ---
                            const userName =
                                (entry as any)?.user?.username ??
                                (entry as any)?.user?.name ??
                                String((entry as any)?.user ?? "User");

                            const challengeTitle =
                                (entry as any)?.challenge?.title ??
                                String((entry as any)?.challenge ?? "Challenge");

                            const rank = (entries.length <= visibleLimit ? 0 : startIndex) + i + 1;
                            const score = Number((entry as any)?.score) || 0;
                            const percent = Math.min(100, Math.round((score / maxScore) * 100));
                            const delay = Math.min(160, i * 40);

                            return (
                                <div
                                    key={(entry as any)?.id ?? `${userName}-${rank}`}
                                    style={{ animationDelay: `${delay}ms` }}
                                    className={dir === "forward" ? "animate-slide-in-left" : "animate-slide-in-right"}
                                >
                                    <LeaderboardEntry
                                        rank={rank}
                                        userName={userName}
                                        challengeTitle={challengeTitle}
                                        score={score}
                                        percent={percent}
                                    />
                                </div>
                            );
                        })}

                        {!loading && entries.length === 0 && (
                            <p className="text-white/85">No entries yet.</p>
                        )}

                        {!loading && entries.length > visibleLimit && (
                            <div className="mt-2 flex items-center justify-between text-xs text-white/70">
                                <span>Showing {startIndex + 1}–{Math.min(startIndex + visibleLimit, entries.length)} of {entries.length}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => startIndex > 0 && step("backward")}
                                        className="rounded-full px-2.5 py-1.5 bg-white/10 hover:bg-white/20 ring-1 ring-white/15"
                                    >↑</button>
                                    <button
                                        type="button"
                                        onClick={() => startIndex < maxStart && step("forward")}
                                        className="rounded-full px-2.5 py-1.5 bg-white/10 hover:bg-white/20 ring-1 ring-white/15"
                                    >↓</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style jsx>{`
				@keyframes slide-in-left {
					0%   { transform: translateX(40px); opacity: 0; }
					100% { transform: translateX(0);     opacity: 1; }
				}
				@keyframes slide-in-right {
					0%   { transform: translateX(-40px); opacity: 0; }
					100% { transform: translateX(0);      opacity: 1; }
				}
				.animate-slide-in-left  { animation: slide-in-left  320ms cubic-bezier(.2,.8,.2,1) both; }
				.animate-slide-in-right { animation: slide-in-right 320ms cubic-bezier(.2,.8,.2,1) both; }
			`}</style>
        </div>
    );
}
