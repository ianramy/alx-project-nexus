// src/components/challenge/ChallengeCard.tsx

import { useMemo } from "react";

export const ChallengeCard = ({ title, end_date }: {
    title: string;
    end_date: string;
}) => {
    // days left badge (professional touch + urgency)
    const daysLeft = useMemo(() => {
        const d = new Date(end_date).getTime();
        if (Number.isNaN(d)) return null;
        const ms = d - Date.now();
        return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    }, [end_date]);

    const statusLabel = daysLeft === null
        ? "No deadline"
        : daysLeft === 0
            ? "Ends today"
            : `Ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;

    return (
        <article
            className={`
				group relative overflow-hidden rounded-2xl
				bg-white/80 dark:bg-slate-900/80 backdrop-blur-md
				shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)]
				ring-1 ring-black/5
				transition-all duration-300
				hover:-translate-y-1 hover:shadow-[0_18px_38px_-12px_rgba(16,185,129,0.45)]
			`}
            tabIndex={0}
            aria-label={title}
        >
            {/* Warm wood accent at top to rhyme with table */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />

            {/* Soft green glow, matching plants/wind-turbine vibe */}
            <div className="pointer-events-none absolute -top-20 right-0 h-48 w-48 rounded-full blur-3xl bg-emerald-400/30" />
            <div className="pointer-events-none absolute -bottom-16 left-0 h-40 w-40 rounded-full blur-3xl bg-lime-300/25" />

            {/* Subtle noise for texture so glass feels tactile */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:radial-gradient(1px_1px_at_12px_12px,#000_1px,transparent_0)] [background-size:14px_14px]" />

            <div className="p-5">
                <header className="flex items-start gap-3">
                    {/* Icon chip */}
                    <div
                        className={`
							shrink-0 grid place-items-center h-10 w-10
							rounded-xl text-xl text-white
							bg-gradient-to-br from-emerald-500 to-green-600
							shadow-md ring-1 ring-white/20
							transition-transform duration-300 group-hover:scale-105
						`}
                        aria-hidden
                        title="Sustainability"
                    >
                        {/* Wind-turbine mark */}
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.6}>
                            <path d="M12 13v9" strokeLinecap="round" />
                            <circle cx="12" cy="10" r="2.2" />
                            <path d="M12 10L5 7M12 10l7-3M12 10l-2 8" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="min-w-0">
                        <h3
                            className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100 line-clamp-2 clamp-2"
                            title={title}
                        >
                            {title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                            {statusLabel}
                        </p>
                    </div>
                </header>

                {/* Divider with “wood” hint */}
                <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

                <footer className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium
						bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20
						dark:bg-emerald-900/30 dark:text-emerald-200">
                        Active
                    </span>

                    {/* Faux CTA — gives the “wow” micro-interaction */}
                    <span className="inline-flex items-center text-xs text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 transition-colors">
                        View details
                        <svg className="ml-1 h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path d="M7.293 14.707a1 1 0 0 1 0-1.414L10.586 10 7.293 6.707A1 1 0 1 1 8.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0Z" />
                        </svg>
                    </span>
                </footer>
            </div>

            {/* Gentle hover tilt */}
            <div className="absolute inset-0 pointer-events-none transition-transform duration-300 group-hover:[transform:perspective(1200px)_rotateX(1.2deg)]" />
        </article>
    );
};
