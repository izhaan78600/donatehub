import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '', address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      await register(form);
      navigate('/user/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder, required }) => (
    <div>
      <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border ${errors[name] ? 'border-rose-300 bg-rose-50' : 'border-neutral-200 bg-neutral-50'} text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all`}
      />
      {errors[name] && <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16 bg-[#fafafa]">
      <div className="w-full max-w-lg">
        <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-neutral-900 px-8 py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <HeartHandshake className="w-6 h-6 text-brand-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Create your account</h1>
            <p className="text-sm text-neutral-400 mt-2 font-medium">Start donating to drives near you</p>
          </div>

          <div className="px-8 py-8">
            {apiError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-700 font-medium">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field name="fullName" label="Full Name" placeholder="Sarah Jenkins" required />
              <Field name="email" label="Email Address" type="email" placeholder="you@example.com" required />
              <Field name="phone" label="Phone Number" placeholder="+1-555-0101" />

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={`w-full px-4 py-3 pr-12 rounded-xl border ${errors.password ? 'border-rose-300 bg-rose-50' : 'border-neutral-200 bg-neutral-50'} text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-rose-300 bg-rose-50' : 'border-neutral-200 bg-neutral-50'} text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all`}
                />
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, City, State"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating account...</span></>
                ) : (
                  <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-neutral-900 hover:text-brand-600 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
