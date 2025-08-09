// src/pages/home.tsx
import Link from "next/link";

export default function HomePage() {

    return (
        <main className="relative min-h-screen text-gray-900 dark:text-white">
            {/* Background images */}
            <div
                className="
					absolute inset-0 -z-10
					bg-[url('/assets/images/day.jpg')] dark:bg-[url('/assets/images/night.jpg')]
					bg-cover bg-center bg-no-repeat
				"
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 -z-10 bg-white/30 dark:bg-black/40" />

            {/* Top bar */}
            <header className="flex items-center justify-between p-5">
                <div className="font-semibold tracking-tight text-lg">
                    <span className="text-green-600 dark:text-green-400">Carbon</span>Jar
                </div>
            </header>

            {/* Hero */}
            <section className="px-6 pt-8 pb-14 md:pt-16 md:pb-20">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-sm">
                        <span className="hidden dark:inline">
                            Welcome to <span 
                            className="text-green-700 dark:text-green-400">Carbon</span>Jar
                        </span>
                    </h1>
                    <h2>
                    <span className="text-white">Track your carbon footprint.</span>
                    </h2>
                </div>
            </section>

            {/* Features */}
            <section className="px-6 pb-14 md:pb-24">
                <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="rounded-xl p-5 bg-white/80 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md">
                        <Link
                            href="/actions"
                            className="text-sm mt-1 text-gray-700 dark:text-gray-300"
                        >
                        <h3 className="font-semibold text-lg">Act</h3>
                                Log daily eco-actions and view your evolving footprint.
                        </Link>
                    </div>
                    <div className="rounded-xl p-5 bg-white/80 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md">
                        <Link
                            href="/challenges"
                            className="text-sm mt-1 text-gray-700 dark:text-gray-300"
                        >
                        <h3 className="font-semibold text-lg">Compete</h3>
                            Join community challenges and climb the ranks.
                        </Link>
                    </div>
                    <div className="rounded-xl p-5 bg-white/80 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md">
                        <Link
                            href="/leaderboard"
                            className="text-sm mt-1 text-gray-700 dark:text-gray-300"
                        >
                        <h3 className="font-semibold text-lg">Improve</h3>
                            Discover tips tailored to your progress and goals.
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
