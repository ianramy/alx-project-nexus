// src/pages/settings.tsx

export default function SettingsPage() {
    return (
		<div className="p-4">
		    <div className="bg-white p-6 rounded-xl shadow">
				<h1 className="text-xl font-bold mb-4">Settings</h1>
				<label className="block mb-2">
			  		<span className="text-gray-700">Dark Mode</span>
			  		<input type="checkbox" className="ml-2" />
				</label>
			{/* Add more preferences */}
		  	</div>
		</div>
    );
}
