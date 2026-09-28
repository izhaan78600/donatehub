import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import BarChart from '../../components/BarChart';
import DonutChart from '../../components/DonutChart';
import { BarChart3, Package, Share2, Boxes, TrendingUp, Compass, Loader2, AlertCircle } from 'lucide-react';

export default function AdminReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getReports()
      .then(res => setReport(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load report analytics.'))
      .finally(() => setLoading(false));
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

  const categoryChartData = report?.donationsByCategory?.map(c => ({
    label: c.categoryName,
    value: c.totalQuantity,
  })) || [];

  const inventoryDonutData = [
    { label: 'Distributed', value: report?.totalDistributed || 0, color: '#059669' },
    { label: 'Available', value: report?.totalAvailable || 0, color: '#2563eb' }
  ];

  const monthlyTrendData = report?.monthlyTrends?.map(m => ({
    label: m.month,
    collected: m.collectedQuantity,
    distributed: m.distributedQuantity
  })) || [];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Analytics & Intelligence</span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-0.5">
          Donation & Distribution Reports
        </h1>
        <p className="text-xs text-neutral-500 font-medium mt-1">
          Comprehensive database analytics detailing inventory throughput and campaign efficiency
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Donations"
          value={report?.totalDonations ?? 0}
          subtitle="Unique donation records"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Items Collected"
          value={report?.totalItems ?? 0}
          subtitle="Sum of donated units"
          icon={Package}
        />
        <StatCard
          title="Total Distributed"
          value={report?.totalDistributed ?? 0}
          subtitle="Fulfillments delivered"
          icon={Share2}
        />
        <StatCard
          title="Currently Available"
          value={report?.totalAvailable ?? 0}
          subtitle="Storage ready units"
          icon={Boxes}
        />
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-neutral-900">Monthly Fulfillment Velocity</h3>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">Collected items vs distributed items per month</p>
            </div>
            <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
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

        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-neutral-900">Distribution Efficiency</h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">Inventory fulfillment ratio</p>
          </div>

          <div className="py-4">
            <DonutChart data={inventoryDonutData} size={160} strokeWidth={20} />
          </div>

          <div className="border-t border-neutral-100 pt-3 text-center text-xs text-neutral-500 font-medium">
            Calculated across all drives and categories
          </div>
        </div>
      </div>

      {/* Categories Breakdown & Drive Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-base font-extrabold text-neutral-900 mb-1">Categories Share</h3>
          <p className="text-xs text-neutral-500 font-medium mb-6">Units donated across categories</p>
          <DonutChart data={categoryChartData} size={160} strokeWidth={20} />
        </div>

        {/* Drive Performance Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-neutral-100">
            <h3 className="text-base font-extrabold text-neutral-900">Drive Performance Summary</h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">Items collected, distributed, and inventory status per drive</p>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Drive Campaign</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Collected</th>
                  <th className="px-6 py-3.5">Distributed</th>
                  <th className="px-6 py-3.5">Available</th>
                  <th className="px-6 py-3.5">Fulfillment Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {report?.drivePerformance?.map((dp) => {
                  const rate = dp.totalItems > 0 ? Math.round((dp.totalDistributed / dp.totalItems) * 100) : 0;
                  return (
                    <tr key={dp.driveId} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-neutral-900">{dp.driveName}</td>
                      <td className="px-6 py-4"><StatusBadge status={dp.status} /></td>
                      <td className="px-6 py-4 font-black text-neutral-900">{dp.totalItems}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">{dp.totalDistributed}</td>
                      <td className="px-6 py-4 font-bold text-neutral-600">{dp.totalAvailable}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-neutral-100 overflow-hidden">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${rate}%` }}></div>
                          </div>
                          <span className="font-bold text-neutral-700">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
