// src/pages/index.tsx

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		if (typeof window === "undefined") return;
		const buttons =
			document.querySelectorAll<HTMLButtonElement>(".glow-button");
		buttons.forEach((btn) => {
			btn.addEventListener("mousemove", (e) => {
				const rect = btn.getBoundingClientRect();
				btn.style.setProperty("--x", `${e.clientX - rect.left}px`);
				btn.style.setProperty("--y", `${e.clientY - rect.top}px`);
			});
		});
		return () => buttons.forEach((btn) => btn.replaceWith(btn.cloneNode(true)));
	}, []);

	return (
		<div
			className={`
        relative min-h-screen w-full flex flex-col items-center justify-center text-center
        bg-[url('/assets/images/splash.jpg')] bg-cover bg-center bg-no-repeat
        `}>
			{/* HEADER */}
			<header className="absolute top-4 right-4 z-20">
				<div className="font-semibold tracking-tight text-lg text-black drop-shadow">
					<span className="text-green-400">Carbon</span>Jar
				</div>
			</header>

			{/* Title */}
			<h1 className="absolute top-20 z-10 text-4xl sm:text-5xl md:text-6xl font-extrabold polluted-text">
				Welcome to <span className="text-green-400">CarbonJar</span>
			</h1>

			{/* Buttons */}
			<div className="absolute bottom-8 left-6 z-10">
				<button
					onClick={() => router.push("/auth?mode=login")}
					className="glow-button px-8 py-4 rounded-full text-white font-bold bg-green-500 relative overflow-hidden">
					Login
				</button>
			</div>

			<div className="absolute bottom-8 right-6 z-10">
				<button
					onClick={() => router.push("/auth?mode=signup")}
					className="glow-button px-8 py-4 rounded-full text-green-700 font-bold bg-white relative overflow-hidden">
					Sign Up
				</button>
			</div>

			<style jsx>{`
				.polluted-text {
					background: radial-gradient(circle at 50% 50%, #fff, #005c22);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-size: 200% 200%;
					animation: smokeFill 6s ease-in-out infinite alternate;
					text-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
				}
				@keyframes smokeFill {
					from {
						background-position: 0% 0%;
					}
					to {
						background-position: 100% 100%;
					}
				}
				.glow-button {
					position: relative;
					cursor: pointer;
					border: none;
					font-size: 1.1rem;
					transition: transform 0.2s ease;
				}
				.glow-button::before {
					content: "";
					position: absolute;
					inset: 0;
					background: radial-gradient(
						circle at var(--x, 50%) var(--y, 50%),
						rgba(255, 255, 255, 0.4),
						transparent 60%
					);
					opacity: 0;
					transition: opacity 0.2s;
					pointer-events: none;
				}
				.glow-button:hover::before {
					opacity: 1;
				}
				.glow-button:hover {
					transform: scale(1.05);
				}
			`}</style>
		</div>
	);
}
