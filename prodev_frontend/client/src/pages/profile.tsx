// src/pages/profile.tsx

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Challenge } from "@/interfaces/challenge";
import { Leaderboard } from "@/interfaces/leaderboard";
import { Action } from "@/interfaces/action";
import {
    fetchUserChallenges,
    fetchUserLeaderboard,
    fetchUserActions,
} from "@/utils/profile";
import Logout from "@/components/auth/Logout";
import BackButton from "@/components/common/BackButton";
import { useRouter } from "next/router";
import Image from "next/image";



export default function ProfilePage() {
    const { user, loading: userLoading } = useAuth();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [userChallenges, userLeaderboard, userActions] = await Promise.all([
                    fetchUserChallenges(),
                    fetchUserLeaderboard(),
                    fetchUserActions(),
                ]);

                setChallenges(userChallenges);
                setLeaderboard(userLeaderboard);
                setActions(userActions);
            } catch (err) {
                console.error("Error fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (!userLoading && user) loadData();
    }, [userLoading, user]);

    if (userLoading || loading) {
        return (
            <div
                className="min-h-screen w-full flex items-center justify-center bg-white bg-cover bg-center"
            >
                <div className="bg-white p-4 rounded-lg shadow-lg text-gray-700 font-medium">
                    Loading your profile…
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative min-h-screen w-full bg-white bg-cover bg-center"
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 z-0" />
            {/* HEADER */}
            <header className="absolute top-4 right-4 z-20">
                <div className="font-semibold tracking-tight text-lg text-white drop-shadow">
                    <span className="text-green-400">Carbon</span>Jar
                </div>
            </header>

            {/* Back Button - visible everywhere */}
            <div className="absolute top-4 left-4 z-20">
                <BackButton onClick={() => router.push("/home")} />
            </div>
            <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-6 pt-16">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        {user?.avatar ? (
                            <Image
                                src={user.avatar}
                                alt="Avatar"
                                className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                            <p className="text-gray-600">Welcome, {user?.username}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                            {user?.bio && <p className="text-sm text-gray-500 mt-1">{user.bio}</p>}
                        </div>
                    </div>
                    <Logout />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Leaderboard */}
                    <div className="bg-white rounded-xl shadow-md p-5">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Leaderboard</h2>
                        {leaderboard.length === 0 ? (
                            <p className="text-gray-500">No leaderboard entries yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {leaderboard.map((entry) => (
                                    <li
                                        key={entry.id}
                                        className="flex justify-between items-center p-2 rounded-md bg-gray-100"
                                    >
                                        <span className="truncate">{entry.challenge?.title ?? "Challenge"}</span>
                                        <span className="font-semibold">{entry.score} pts</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Challenges */}
                    <div className="bg-white rounded-xl shadow-md p-5">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Challenges</h2>
                        {challenges.length === 0 ? (
                            <p className="text-gray-500">You haven’t joined any challenges yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {challenges.map((c) => (
                                    <li
                                        key={c.id}
                                        className="p-2 rounded-md bg-gray-100"
                                    >
                                        📌 {c.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-md p-5 lg:col-span-1 md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Eco Actions</h2>
                        {actions.length === 0 ? (
                            <p className="text-gray-500">No actions logged yet.</p>
                        ) : (
                            <ul className="space-y-2 max-h-72 overflow-auto pr-1">
                                {actions.map((a) => (
                                    <li
                                        key={a.id}
                                        className="p-2 rounded-md bg-gray-100"
                                    >
                                        ♻️ <span className="font-medium">{a.action_type}</span>: {a.description}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
