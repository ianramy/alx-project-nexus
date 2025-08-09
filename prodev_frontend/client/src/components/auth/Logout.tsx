// src/components/auth/Logout.tsx

import Button from "@/components/common/Button";

export default function Logout() {
	const handleLogout = () => {
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
		window.location.href = "/auth";
	};

	return (
        <Button onClick={handleLogout} className="btn bg-red-300 hover:bg-red-700">
			Log Out
		</Button>
	);
}
