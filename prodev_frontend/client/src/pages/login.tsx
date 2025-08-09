// src/pages/login.tsx
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back</h2>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="input" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="input" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="btn w-full">Login</button>
        </form>
      </div>
    </div>
  );
}
