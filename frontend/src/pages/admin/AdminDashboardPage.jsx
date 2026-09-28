import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import BarChart from '../../components/BarChart';
import DonutChart from '../../components/DonutChart';
import {
  Users,
  Compass,
  Package,
  Share2,
  Boxes,
  Building2,
  Plus,
  ArrowRight,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = () => {
    setLoading(true);
    adminApi.getDashboard()
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const categoryChartData = data?.donationsByCategory?.map(c => ({
    label: c.categoryName,
    value: c.totalQuantity,
  })) || [];

  const inventoryDonutData = [
    { label: 'Distributed', value: data?.totalItemsDistributed || 0, color: '#059669' },
    { label: 'Available', value: data?.availableItems || 0, color: '#2563eb' }
  ];

  const driveStatusData = [
    { label: 'Active', value: data?.activeDrives || 0, color: '#10b981' },
    { label: 'Completed', value: data?.completedDrives || 0, color: '#64748b' }
  ];

  const monthlyTrendData = data?.donationsByMonth?.map(m => ({
    label: m.month,
    collected: m.collectedQuantity,
    distributed: m.distributedQuantity
  })) || [];

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="space-y-8">
      {/* Quick Actions Bar */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900">Admin Operations Hub</h2>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">Real-time donation metrics from MySQL database</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/drives"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Drive</span>
          </Link>
          <Link
            to="/admin/recipients"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Recipient</span>
          </Link>
          <Link
            to="/admin/distributions"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Record Distribution</span>
          </Link>
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Users"
          value={data?.totalUsers ?? 0}
          subtitle="Registered donors"
          icon={Users}
        />
        <StatCard
          title="Drives"
          value={data?.totalDonationDrives ?? 0}
          subtitle={`${data?.activeDrives || 0} active`}
          icon={Compass}
        />
        <StatCard
          title="Collected"
          value={data?.totalItemsCollected ?? 0}
          subtitle="Total donated items"
          icon={Package}
        />
        <StatCard
          title="Distributed"
          value={data?.totalItemsDistributed ?? 0}
          subtitle="Delivered to causes"
          icon={Share2}
        />
        <StatCard
          title="Available"
          value={data?.availableItems ?? 0}
          subtitle="Ready in inventory"
          icon={Boxes}
        />
        <StatCard
          title="Recipients"
          value={data?.totalRecipients ?? 0}
          subtitle="Partner NGOs/Shelters"
          icon={Building2}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly trends */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-neutral-900">Donations & Distributions by Month</h3>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">Quantity trends comparison</p>
            </div>
            <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
              Live Database
            </span>
          </div>

          <BarChart
            data={monthlyTrendData}
            height={220}
            xKey="label"
            yKey1="collected"
            yKey2="distributed"
            label1="Collected"
            label2="Distributed"
          />
        </div>

        {/* Distributed vs Available Donut */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-neutral-900">Inventory Distribution Ratio</h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">Distributed vs Available units</p>
          </div>

          <div className="py-4">
            <DonutChart data={inventoryDonutData} size={160} strokeWidth={20} />
          </div>

          <div className="border-t border-neutral-100 pt-4 flex justify-between text-xs font-semibold text-neutral-600">
            <span>Drives Ratio:</span>
            <span className="font-bold text-neutral-900">{data?.activeDrives || 0} Active / {data?.completedDrives || 0} Completed</span>
          </div>
        </div>
      </div>

      {/* Category breakdown bar & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category breakdown */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-base font-extrabold text-neutral-900 mb-1">Items by Category</h3>
          <p className="text-xs text-neutral-500 font-medium mb-6">Units cataloged per category</p>

          <DonutChart data={categoryChartData} size={160} strokeWidth={20} />
        </div>

        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-neutral-900">Recent Donation Activity</h3>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">Latest items entered in system</p>
            </div>
            <Link
              to="/admin/donations"
              className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-brand-600 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3">Donor</th>
                  <th className="px-6 py-3">Drive</th>
                  <th className="px-6 py-3">Qty</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {data?.recentActivity?.slice(0, 6).map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-neutral-900">
                      {item.itemName}
                      <span className="block text-[10px] text-neutral-400 font-normal">{item.categoryName}</span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-neutral-700">{item.donorName}</td>
                    <td className="px-6 py-3.5 text-neutral-500 max-w-[140px] truncate">{item.driveName}</td>
                    <td className="px-6 py-3.5 font-black text-neutral-900">{item.quantity}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-3.5 text-neutral-400 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
