// src/components/leaderboard/LeaderboardEntry.tsx

export function LeaderboardEntry({
    userName,
    challengeTitle,
    score,
    rank,
    percent,
}: {
    userName: string;
    challengeTitle: string;
    score: number;
    rank: number;
    percent: number; // 0..100
}) {
    const initials = userName
        .split(" ")
        .map(p => p.trim()[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";

    const medal =
        rank === 1 ? "from-amber-400 to-yellow-500" :
            rank === 2 ? "from-zinc-300 to-zinc-400" :
                rank === 3 ? "from-orange-300 to-amber-400" :
                    "from-slate-200/70 to-slate-300/70";

    const medalRing = rank <= 3 ? "ring-white/30" : "ring-white/20";

    return (
        <div
            className={`
				group relative overflow-hidden rounded-2xl
				bg-white/80 dark:bg-slate-900/70 backdrop-blur-md
				ring-1 ring-black/5 shadow-md
				transition-all duration-300
				hover:-translate-y-[2px] hover:shadow-lg
				p-4
			`}
        >
            <div className="flex items-center justify-between gap-4">
                {/* Rank */}
                <div
                    className={`
						shrink-0 grid place-items-center h-10 w-10 rounded-full
						bg-gradient-to-br ${medal} text-slate-900 font-bold
						ring-2 ${medalRing}
					`}
                    title={`Rank #${rank}`}
                >
                    {rank}
                </div>

                {/* Avatar + info */}
                <div className="flex items-center gap-3 min-w-0">
                    <div
                        className={`
							grid place-items-center h-10 w-10 rounded-full
							bg-gradient-to-br from-emerald-500 to-green-600 text-white
							font-semibold ring-2 ring-white/30
						`}
                        title={userName}
                    >
                        {initials}
                    </div>

                    <div className="min-w-0">
                        <div className="text-sm md:text-base font-semibold text-slate-900 dark:text-white truncate">
                            {userName}
                        </div>
                        <div className="mt-0.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium
								bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500/20
								dark:bg-emerald-900/30 dark:text-emerald-200">
                                {challengeTitle}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                    <div className="text-lg font-extrabold text-emerald-400">
                        {score.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-white/70">points</div>
                </div>
            </div>

            {/* Progress */}
            <div className="mt-3 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-600 transition-[width] duration-500"
                    style={{ width: `${percent}%` }}
                    aria-label={`Progress ${percent}%`}
                />
            </div>

            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
        </div>
    );
}
