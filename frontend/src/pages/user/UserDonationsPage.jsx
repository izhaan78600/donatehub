import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Package, Plus, Eye, Loader2, ArrowRight, Search, Filter } from 'lucide-react';

export default function UserDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    userApi.getUserDonations()
      .then(res => setDonations(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = donations.filter(d => {
    const matchesSearch = d.itemName.toLowerCase().includes(search.toLowerCase()) ||
                          d.categoryName.toLowerCase().includes(search.toLowerCase()) ||
                          d.driveName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">My Contributions</span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-1">
            Donation History
          </h1>
          <p className="mt-2 text-sm text-neutral-500 font-medium">Track your donated clothes and books across active drives.</p>
        </div>

        <Link
          to="/user/donations/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Donation</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your donations by item, category or drive..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="COLLECTED">COLLECTED</option>
            <option value="DISTRIBUTED">DISTRIBUTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Table container */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Package className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-800">No donations found</h3>
            <p className="text-sm text-neutral-500 mt-1 font-medium">You haven't recorded any items matching the criteria.</p>
            <Link
              to="/user/donations/new"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-all"
            >
              <span>Make a Donation Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Drive</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/user/donations/${d.id}`} className="font-bold text-neutral-900 hover:text-brand-600 transition-colors block">
                        {d.itemName}
                      </Link>
                      {d.description && (
                        <span className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{d.description}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-neutral-600">{d.categoryName}</td>
                    <td className="px-6 py-4 text-xs font-medium text-neutral-500 max-w-[160px] truncate">{d.driveName}</td>
                    <td className="px-6 py-4">
                      <span className="font-black text-neutral-900">{d.quantity}</span>
                      <span className="block text-[10px] text-neutral-400">
                        {d.distributedQuantity || 0} dist. / {d.availableQuantity || 0} avail.
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={d.condition} /></td>
                    <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                    <td className="px-6 py-4 text-xs text-neutral-400 font-medium whitespace-nowrap">{formatDate(d.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/user/donations/${d.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </Link>
                    </td>
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
