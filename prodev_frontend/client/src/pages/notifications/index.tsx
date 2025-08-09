// src/pages/notifications/index.tsx
import { useEffect, useState } from "react";
import { fetchNotifications } from "@/utils/notifications";
import { Notification } from "@/interfaces/notification";
import {NotificationToast} from "@/components/notifications/NotificationToast";

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
		fetchNotifications().then(setNotifications);
	}, []);

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Notifications</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{notifications.map((notification) => (
					<NotificationToast key={notification.id} notification={notification} />
				))}
			</div>
		</div>
	);
}
