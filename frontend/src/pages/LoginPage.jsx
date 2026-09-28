import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16 bg-[#fafafa]">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-neutral-900 px-8 py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <HeartHandshake className="w-6 h-6 text-brand-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Welcome back</h1>
            <p className="text-sm text-neutral-400 mt-2 font-medium">Sign in to your DonateHub account</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">Email address</label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide">Password</label>
                </div>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-100 space-y-3">
              <p className="text-center text-sm text-neutral-500 font-medium">
                Don't have an account?{' '}
                <Link to="/signup" className="font-bold text-neutral-900 hover:text-brand-600 transition-colors">
                  Sign up for free
                </Link>
              </p>
              <p className="text-center text-xs text-neutral-400">
                Admin?{' '}
                <Link to="/admin/login" className="font-semibold text-neutral-600 hover:text-neutral-900 transition-colors">
                  Use the Admin Portal →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 p-4 rounded-2xl bg-brand-50 border border-brand-100 text-center">
          <p className="text-xs font-semibold text-brand-700">
            Demo user: <span className="font-black">sarah.jenkins@example.com</span> / <span className="font-black">User@123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
