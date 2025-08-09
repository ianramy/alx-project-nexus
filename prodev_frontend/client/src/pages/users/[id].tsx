// src/pages/users/[id].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/utils/users";
import { User } from "@/interfaces/user";


export default function UserDetailPage() {
	const { query } = useRouter();
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		if (query.id) {
			fetchUsers().then((data) => {
				const found = data.find((u) => u.id === Number(query.id));
				setUser(found || null);
			});
		}
	}, [query.id]);

	if (!user) return <div className="p-4">Loading...</div>;

	return (
		<div className="p-4 max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold mb-2">{user.username}</h1>
			<p className="text-gray-700 mb-2">Email: {user.email}</p>
			<p className="text-gray-700 mb-2">Bio: {user.bio}</p>
			<p className="text-green-600">City: {user.city?.name}</p>
		</div>
	);
}
