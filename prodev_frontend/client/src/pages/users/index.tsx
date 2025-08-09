// src/pages/users/index.tsx

import { useEffect, useState } from "react";
import { fetchUsers } from "@/utils/users";
import { User } from "@/interfaces/user";
import {UserAvatar} from "@/components/users/UserAvatar";


export default function UsersPage() {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		fetchUsers().then(setUsers);
	}, []);

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Users</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{users.map((user) => (
					<UserAvatar key={user.id} username={user.username} />
				))}
			</div>
		</div>
	);
}
