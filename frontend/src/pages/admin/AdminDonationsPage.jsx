import React, { useEffect, useState } from 'react';
import { adminApi, categoryApi } from '../../services/api';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';
import { Package, Search, Trash2, Eye, Edit, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Status modal
  const [statusTarget, setStatusTarget] = useState(null);
  const [newStatus, setNewStatus] = useState('COLLECTED');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // View modal
  const [viewTarget, setViewTarget] = useState(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    categoryApi.getAllCategories()
      .then(res => setCategories(res.data))
      .catch(() => {});
  }, []);

  const fetchDonations = () => {
    setLoading(true);
    adminApi.getDonations({
      query: search,
      status: statusFilter || null,
      categoryId: categoryFilter || null,
      page,
      size: pageSize
    })
      .then(res => {
        setDonations(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDonations();
  }, [page, search, statusFilter, categoryFilter]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusTarget) return;
    setUpdatingStatus(true);
    try {
      await adminApi.updateDonationStatus(statusTarget.id, { status: newStatus });
      setStatusTarget(null);
      fetchDonations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteDonation(deleteTarget.id);
      setDeleteTarget(null);
      fetchDonations();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete item with active distributions.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Inventory Catalog</span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-0.5">
          Donated Items Management
        </h1>
        <p className="text-xs text-neutral-500 font-medium mt-1">
          Verify items, update collection statuses, and check available inventory counts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search items, donors, or drives..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm w-full sm:w-auto"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="COLLECTED">COLLECTED</option>
          <option value="DISTRIBUTED">DISTRIBUTED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
          className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No donated items found</h3>
            <p className="text-xs text-neutral-500 mt-1 font-medium">Try changing your filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Item & Category</th>
                  <th className="px-6 py-4">Donor</th>
                  <th className="px-6 py-4">Drive</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-neutral-400">#{d.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-neutral-900 block">{d.itemName}</span>
                      <span className="text-neutral-400 text-[10px]">{d.categoryName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-neutral-800 block">{d.donorName}</span>
                      <span className="text-[10px] text-neutral-400">{d.donorEmail}</span>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 max-w-[150px] truncate">{d.driveName}</td>
                    <td className="px-6 py-4">
                      <span className="font-black text-neutral-900 block">{d.quantity} total</span>
                      <span className="text-[10px] text-neutral-400">
                        {d.distributedQuantity || 0} dist. / <strong className="text-emerald-700">{d.availableQuantity || 0} avail.</strong>
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={d.condition} /></td>
                    <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewTarget(d)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setStatusTarget(d); setNewStatus(d.status); }}
                          title="Change Status"
                          className="p-1.5 rounded-lg text-brand-600 hover:text-brand-800 hover:bg-brand-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(d)}
                          title="Delete Donation"
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* View Item Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-neutral-900">Donated Item Breakdown</h3>
              <button onClick={() => setViewTarget(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl flex justify-between items-center">
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Item Name</span>
                <span className="font-bold text-neutral-900 text-sm">{viewTarget.itemName}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl flex justify-between items-center">
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Drive</span>
                <span className="font-semibold text-neutral-800">{viewTarget.driveName}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl flex justify-between items-center">
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Donor</span>
                <span className="font-semibold text-neutral-800">{viewTarget.donorName} ({viewTarget.donorEmail})</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl flex justify-between items-center">
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Category</span>
                <span className="font-semibold text-neutral-800">{viewTarget.categoryName}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl flex justify-between items-center">
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Inventory</span>
                <span className="font-bold text-neutral-900">
                  {viewTarget.quantity} total | {viewTarget.distributedQuantity} distributed | {viewTarget.availableQuantity} available
                </span>
              </div>
              {viewTarget.description && (
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">Description</span>
                  <span className="text-neutral-700">{viewTarget.description}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setViewTarget(null)}
                className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {statusTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-neutral-900">Update Item Status</h3>
              <button onClick={() => setStatusTarget(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 font-medium">
              Updating status for item <strong className="text-neutral-900">"{statusTarget.itemName}"</strong>
            </p>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
                  Select Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="COLLECTED">COLLECTED</option>
                  <option value="DISTRIBUTED">DISTRIBUTED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                <p className="mt-1 text-[10px] text-neutral-400">
                  Note: Marking as COLLECTED automatically stamps the collection date.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusTarget(null)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  {updatingStatus ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Donation Record"
        message={`Are you sure you want to delete item "${deleteTarget?.itemName}"? This item cannot be deleted if distribution records already reference it.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Item'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDanger={true}
      />
    </div>
  );
}
