import React, { useEffect, useState } from 'react';
import { userApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function UserProfilePage() {
  const { updateUserState } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    userApi.getProfile()
      .then((res) => {
        setProfile(res.data);
        setFormData({
          fullName: res.data.fullName || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
        });
      })
      .catch((err) => {
        setErrorMsg('Failed to load profile.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await userApi.updateProfile(formData);
      setProfile(res.data);
      updateUserState({ name: res.data.fullName });
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Account</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-1">
          Donor Profile
        </h1>
        <p className="mt-2 text-sm text-neutral-500 font-medium">Manage your personal information and contact details.</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left summary card */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 rounded-full bg-neutral-900 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-sm">
              {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-lg font-bold text-neutral-900">{profile?.fullName}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>{profile?.role}</span>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-5 space-y-3 text-xs font-semibold text-neutral-600">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-neutral-400" />
              <span className="truncate">{profile?.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>Joined {formatDate(profile?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Right edit form */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-6">Personal Information</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-100 text-sm font-medium text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1-555-0100"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                Physical / Delivery Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="Street address, apartment, city, state"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 disabled:opacity-60 transition-all shadow-sm"
              >
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
