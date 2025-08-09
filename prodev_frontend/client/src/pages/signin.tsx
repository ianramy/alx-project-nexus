// src/pages/signin.tsx

export default function SigninPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-green-100 to-white px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Create your Profile</h2>
        <form className="space-y-3">
          <input placeholder="First Name" className="input" />
          <input placeholder="Last Name" className="input" />
          <input type="file" accept="image/*" className="input" />
          {/* Avatars will go here later */}
          <button className="btn w-full">Continue</button>
        </form>
      </div>
    </div>
  );
}
