// src/components/layout/Header.tsx
import Link from "next/link";

export const Header = () => (
  <header className="w-full bg-white border-b p-4 flex justify-between items-center">
    <h1 className="text-xl font-bold text-green-700">CarbonJar</h1>
    <nav className="space-x-4">
      <Link href="/">Home</Link>
      <Link href="/actions">Actions</Link>
      <Link href="/challenges">Challenges</Link>
      <Link href="/leaderboard">Leaderboard</Link>
    </nav>
  </header>
);
