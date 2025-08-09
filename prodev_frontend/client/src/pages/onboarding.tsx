// src/pages/onboarding.tsx

export default function OnboardingPage() {
    return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
	    	<div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow">
				<h2 className="text-2xl font-semibold mb-4 text-center">Account Setup</h2>
				<form className="grid gap-4">
				    <input placeholder="Location" className="input" />
				    <input type="email" placeholder="Verify Email" className="input" />
				    <input type="tel" placeholder="Verify Phone Number" className="input" />
				    <textarea placeholder="Profile Bio" className="input" />
				    <button className="btn w-full">Complete Setup</button>
				</form>
	    	</div>
		</div>
    );
}
