// src/pages/notifications/[id].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchNotifications } from "@/utils/notifications";
import { Notification } from "@/interfaces/notification";


export default function NotificationDetailPage() {
	const { query } = useRouter();
	const [notification, setNotification] = useState<Notification | null>(null);

	useEffect(() => {
		if (query.id) {
			fetchNotifications().then((data) => {
				const found = data.find((n) => n.id === Number(query.id));
				setNotification(found || null);
			});
		}
	}, [query.id]);

	if (!notification) return <div className="p-4">Loading...</div>;

	return (
		<div className="p-4 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-2">{notification.title}</h1>
			<p className="text-gray-700 mb-4">{notification.body}</p>
			<p className="text-sm text-gray-500">Date: {new Date(notification.created_at).toLocaleDateString()}</p>
		</div>
	);
}
