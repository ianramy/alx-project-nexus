// src/components/action/ActionCard.tsx

import { ReactNode } from "react";

const iconForType = (t: string): ReactNode => {
    const key = (t || "").toLowerCase();
    if (key.includes("recycle") || key.includes("plastic")) return "♻️";
    if (key.includes("plant") || key.includes("vegetarian")) return "🌱";
    if (key.includes("energy")) return "⚡";
    if (key.includes("water")) return "💧";
    if (key.includes("transport")) return "🚲";
    return "🌍";
};

export const ActionCard = ({
    action_type,
    description
}: {
    action_type: string;
    description: string;
}) => (
    <article
        className="
			group relative overflow-hidden rounded-2xl
			bg-white/85 dark:bg-slate-900/80
			backdrop-blur-md shadow-lg ring-1 ring-black/5
			transition-all duration-300
			hover:shadow-green-500/30 hover:-translate-y-1 hover:ring-green-400/30
			focus-within:ring-2 focus-within:ring-green-500
		"
        role="button"
        tabIndex={0}
        aria-label={action_type}
    >
        {/* top gradient accent */}
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-green-400/30 to-transparent blur-2xl" />

        <div className="p-6">
            <header className="flex items-start gap-3">
                <div
                    className="
						shrink-0 grid place-items-center text-xl
						h-10 w-10 rounded-xl
						bg-gradient-to-br from-green-500 to-emerald-600 text-white
						shadow-md ring-1 ring-white/20
						transition-transform duration-300 group-hover:scale-105
					"
                    aria-hidden
                >
                    {iconForType(action_type)}
                </div>
                <div className="min-w-0">
                    <h2
                        className="
							text-base font-semibold tracking-tight
							text-slate-800 dark:text-slate-100
						"
                        title={action_type}
                    >
                        {action_type}
                    </h2>
                    <p
                        className="
							mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300
							line-clamp-3 clamp-3
						"
                        title={description}
                    >
                        {description}
                    </p>
                </div>
            </header>

            <footer className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 dark:bg-emerald-900/30 dark:text-emerald-200 px-2 py-1 text-[11px] font-medium ring-1 ring-green-500/20">
                    Eco Action
                </span>
                <span className="inline-flex items-center text-xs text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 transition-colors">
                    Learn more
                    <svg className="ml-1 h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path d="M7.293 14.707a1 1 0 0 1 0-1.414L10.586 10 7.293 6.707A1 1 0 1 1 8.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0Z" />
                    </svg>
                </span>
            </footer>
        </div>

        {/* soft noise for texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay [background-image:radial-gradient(1px_1px_at_10px_10px,#000_1px,transparent_0)] [background-size:12px_12px]" />
    </article>
);
