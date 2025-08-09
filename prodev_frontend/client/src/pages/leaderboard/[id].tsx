// src/pages/leaderboard/[id].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchLeaderboard } from "@/utils/leaderboard";
import { Leaderboard } from "@/interfaces/leaderboard";


export default function LeaderboardDetailPage() {
	const { query } = useRouter();
	const [entry, setEntry] = useState<Leaderboard | null>(null);

	useEffect(() => {
		if (query.id) {
			fetchLeaderboard().then((data) => {
				const found = data.find((e) => e.id === Number(query.id));
				setEntry(found || null);
			});
		}
	}, [query.id]);

	if (!entry) return <div className="p-4">Loading...</div>;

	return (
		<div className="p-4 max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold mb-2">{entry.user.username}</h1>
			<p className="text-gray-700">Challenge: {entry.challenge.title}</p>
			<p className="text-sm text-gray-500">Points: {entry.score}</p>
		</div>
	);
}
