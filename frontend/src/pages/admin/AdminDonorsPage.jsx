import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import Pagination from '../../components/Pagination';
import { HeartHandshake, Search, Mail, Phone, MapPin, Eye, Loader2, X } from 'lucide-react';

export default function AdminDonorsPage() {
  const [donors, setDonors] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedDonor, setSelectedDonor] = useState(null);

  const fetchDonors = () => {
    setLoading(true);
    adminApi.getDonors({ query: search, page, size: pageSize })
      .then(res => {
        setDonors(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDonors();
  }, [page, search]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Contributor Directory</span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-0.5">
          Donors Registry
        </h1>
        <p className="text-xs text-neutral-500 font-medium mt-1">
          Catalog of active donors and their total community donation counts
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search donors by name, email or phone..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center py-20 px-4">
            <HeartHandshake className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No donors found</h3>
            <p className="text-xs text-neutral-500 mt-1 font-medium">Try another keyword search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Donor Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Total Donations</th>
                  <th className="px-6 py-4">Total Items Donated</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {donors.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-neutral-400">#{d.id}</td>
                    <td className="px-6 py-4 font-bold text-neutral-900">{d.name}</td>
                    <td className="px-6 py-4 text-neutral-600 font-medium">{d.email}</td>
                    <td className="px-6 py-4 text-neutral-500">{d.phone || '—'}</td>
                    <td className="px-6 py-4 font-black text-neutral-900">{d.totalDonations}</td>
                    <td className="px-6 py-4 font-black text-brand-600">{d.totalQuantity} units</td>
                    <td className="px-6 py-4 text-neutral-400 whitespace-nowrap">{formatDate(d.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedDonor(d)}
                        title="View Details"
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 pb-2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>

      {/* Details Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-neutral-900">Donor Profile</h3>
              <button onClick={() => setSelectedDonor(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block">Name</span>
                <span className="font-bold text-neutral-900 text-sm">{selectedDonor.name}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block">Email</span>
                <span className="font-medium text-neutral-800">{selectedDonor.email}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block">Phone</span>
                <span className="font-medium text-neutral-800">{selectedDonor.phone || '—'}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block">Address</span>
                <span className="font-medium text-neutral-800">{selectedDonor.address || '—'}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl flex justify-between">
                <div>
                  <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block">Total Donations</span>
                  <span className="font-bold text-neutral-900 text-sm">{selectedDonor.totalDonations}</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block">Total Items Quantity</span>
                  <span className="font-bold text-brand-600 text-sm">{selectedDonor.totalQuantity} units</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedDonor(null)}
                className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
