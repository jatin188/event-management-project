import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/UI';
import { Calendar, Info } from 'lucide-react';

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isSignup = searchParams.get('signup') === 'true';
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const DEMO = {
    admin: { email: 'admin@eventhorizon.com', password: 'admin123' },
    alice: { email: 'alice@test.com', password: 'password123' },
    bob: { email: 'bob@test.com', password: 'passw0rd' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await Promise.resolve(login(identifier, password));
      if (res === false) {
        alert('Login failed. Check credentials.');
        setLoading(false);
        return;
      }
      const user = res && typeof res === 'object' && ('role' in res || 'email' in res) ? res : null;
      if (user && (user.role === 'ADMIN' || user.role === 'admin')) { navigate('/admin'); setLoading(false); return; }
      if ((identifier === DEMO.admin.email || identifier === 'admin') && password === DEMO.admin.password) { navigate('/admin'); setLoading(false); return; }
      navigate('/');
    } catch (err: any) {
      console.error('Login error', err);
      alert(err?.response?.data?.message || err?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const autofillAndMaybeLogin = async (creds: { email: string; password: string }, doSubmit = true) => {
    setIdentifier(creds.email);
    setPassword(creds.password);
    if (doSubmit) setTimeout(() => { (document.querySelector('form') as HTMLFormElement)?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }, 150);
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1600&q=80&auto=format&fit=crop')" }}>
      <div className="bg-overlay" />
      <div className="hero-content w-full max-w-md p-8">
        <div className="card-glass p-6 rounded-2xl shadow-xl">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{isSignup ? 'Create an Account' : 'Welcome Back'}</h1>
            <p className="text-gray-500 text-sm mt-1">{isSignup ? 'Join thousands of event enthusiasts' : 'Enter your credentials to access your account'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Admin ID</label>
              <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="you@example.com or admin" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>

            <Button type="submit" className="w-full py-3 text-lg" disabled={loading}>{loading ? 'Signing in...' : (isSignup ? 'Sign Up' : 'Sign In')}</Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm">
            <div className="flex items-start gap-3">
              <Info className="flex-shrink-0 text-blue-600 h-5 w-5" />
              <div className="text-blue-900 w-full">
                <p className="font-semibold mb-2">Quick test accounts (click to autofill and login)</p>

                <div className="mb-3 bg-white p-3 rounded-md border flex items-center justify-between">
                  <div>
                    <div className="font-medium">Admin</div>
                    <div className="text-xs text-gray-600"><strong>Email:</strong> <code>admin@eventhorizon.com</code></div>
                    <div className="text-xs text-gray-600"><strong>Password:</strong> <code>admin123</code></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => autofillAndMaybeLogin(DEMO.admin)} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">Autofill & Login</button>
                    <button onClick={() => autofillAndMaybeLogin(DEMO.admin, false)} className="text-sm px-3 py-1 rounded border border-blue-200">Autofill</button>
                  </div>
                </div>

                <div className="mb-3 bg-white p-3 rounded-md border flex items-center justify-between">
                  <div>
                    <div className="font-medium">User — Alice</div>
                    <div className="text-xs text-gray-600"><strong>Email:</strong> <code>alice@test.com</code></div>
                    <div className="text-xs text-gray-600"><strong>Password:</strong> <code>password123</code></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => autofillAndMaybeLogin(DEMO.alice)} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">Autofill & Login</button>
                    <button onClick={() => autofillAndMaybeLogin(DEMO.alice, false)} className="text-sm px-3 py-1 rounded border border-blue-200">Autofill</button>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-md border flex items-center justify-between">
                  <div>
                    <div className="font-medium">User — Bob</div>
                    <div className="text-xs text-gray-600"><strong>Email:</strong> <code>bob@test.com</code></div>
                    <div className="text-xs text-gray-600"><strong>Password:</strong> <code>passw0rd</code></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => autofillAndMaybeLogin(DEMO.bob)} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">Autofill & Login</button>
                    <button onClick={() => autofillAndMaybeLogin(DEMO.bob, false)} className="text-sm px-3 py-1 rounded border border-blue-200">Autofill</button>
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-600">These test accounts are for demo only. Do not use them in production.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            {isSignup ? (
              <p className="text-gray-500">Already have an account? <a href="/#/login" className="text-blue-600 font-medium hover:underline">Log in</a></p>
            ) : (
              <p className="text-gray-500">Don't have an account? <a href="/#/login?signup=true" className="text-blue-600 font-medium hover:underline">Sign up</a></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
