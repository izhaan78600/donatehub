import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { HeartHandshake, Package, Share2, Compass, ArrowRight, Loader2, Plus } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getDashboard()
      .then(res => setDashboard(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">Your Dashboard</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-1">
            Welcome back, <span className="text-brand-600">{dashboard?.name || user?.name || 'Donor'}</span> 👋
          </h1>
          <p className="mt-2 text-sm text-neutral-500 font-medium">Here's a summary of your contribution so far.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/user/donations/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Make a Donation
          </Link>
          <Link
            to="/drives"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 shadow-sm transition-all"
          >
            <Compass className="w-4 h-4" />
            Explore Drives
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Donations"
          value={dashboard?.totalDonations ?? 0}
          subtitle="Donation records created"
          icon={HeartHandshake}
        />
        <StatCard
          title="Items Donated"
          value={dashboard?.itemsDonated ?? 0}
          subtitle="Total quantity donated"
          icon={Package}
        />
        <StatCard
          title="Items Distributed"
          value={dashboard?.itemsDistributed ?? 0}
          subtitle="Items delivered to recipients"
          icon={Share2}
        />
        <StatCard
          title="Active Drives"
          value={dashboard?.activeDrives ?? 0}
          subtitle="Open drives to donate to"
          icon={Compass}
        />
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Recent Donations</h2>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">Your last 5 donation entries</p>
          </div>
          <Link
            to="/user/donations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-brand-600 transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!dashboard?.recentDonations || dashboard.recentDonations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <HeartHandshake className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
            <p className="text-base font-bold text-neutral-900">No donations yet</p>
            <p className="text-sm text-neutral-500 mt-2 font-medium">Make your first donation to an active drive!</p>
            <Link
              to="/user/donations/new"
              className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 transition-all"
            >
              Donate Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="text-left px-6 py-3.5 text-xs font-bold text-neutral-500 uppercase tracking-wider">Item</th>
                  <th className="text-left px-6 py-3.5 text-xs font-bold text-neutral-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3.5 text-xs font-bold text-neutral-500 uppercase tracking-wider">Qty</th>
                  <th className="text-left px-6 py-3.5 text-xs font-bold text-neutral-500 uppercase tracking-wider">Condition</th>
                  <th className="text-left px-6 py-3.5 text-xs font-bold text-neutral-500 uppercase tracking-wider">Drive</th>
                  <th className="text-left px-6 py-3.5 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3.5 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {dashboard.recentDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        to={`/user/donations/${d.id}`}
                        className="font-bold text-neutral-900 hover:text-brand-600 transition-colors"
                      >
                        {d.itemName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 font-medium">{d.categoryName}</td>
                    <td className="px-6 py-4 font-bold text-neutral-900">{d.quantity}</td>
                    <td className="px-6 py-4"><StatusBadge status={d.condition} /></td>
                    <td className="px-6 py-4 text-neutral-500 font-medium text-xs max-w-[140px] truncate">{d.driveName}</td>
                    <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                    <td className="px-6 py-4 text-neutral-400 font-medium text-xs whitespace-nowrap">{formatDate(d.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
