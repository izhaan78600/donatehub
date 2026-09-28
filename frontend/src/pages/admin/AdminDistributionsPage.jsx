import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Share2, Plus, Search, Trash2, Calendar, Building2, Package, Loader2, X, AlertCircle } from 'lucide-react';

export default function AdminDistributionsPage() {
  const [distributions, setDistributions] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Record Distribution Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsList, setItemsList] = useState([]);
  const [recipientsList, setRecipientsList] = useState([]);
  const [loadingModalData, setLoadingModalData] = useState(false);

  const [form, setForm] = useState({
    itemId: '',
    recipientId: '',
    quantity: 1,
    distributionDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Selected item available quantity helper
  const selectedItemObj = itemsList.find(i => String(i.id) === String(form.itemId));

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDistributions = () => {
    setLoading(true);
    adminApi.getDistributions({ query: search, page, size: pageSize })
      .then(res => {
        setDistributions(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDistributions();
  }, [page, search]);

  const openRecordModal = async () => {
    setLoadingModalData(true);
    setIsModalOpen(true);
    setFormError('');

    try {
      const [itemsRes, recRes] = await Promise.all([
        adminApi.getDonations({ page: 0, size: 100 }),
        adminApi.getAllRecipientsList()
      ]);

      // Only items that are COLLECTED or DISTRIBUTED with available quantity > 0
      const availableItems = itemsRes.data.content.filter(i =>
        (i.status === 'COLLECTED' || i.status === 'DISTRIBUTED') && i.availableQuantity > 0
      );

      setItemsList(availableItems);
      setRecipientsList(recRes.data);

      setForm({
        itemId: availableItems.length > 0 ? availableItems[0].id : '',
        recipientId: recRes.data.length > 0 ? recRes.data[0].id : '',
        quantity: 1,
        distributionDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch (err) {
      setFormError('Failed to load item or recipient options.');
    } finally {
      setLoadingModalData(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.itemId) {
      setFormError('Please select a collected item.');
      return;
    }
    if (!form.recipientId) {
      setFormError('Please select a recipient organization.');
      return;
    }
    if (form.quantity <= 0) {
      setFormError('Quantity must be greater than zero.');
      return;
    }

    if (selectedItemObj && form.quantity > selectedItemObj.availableQuantity) {
      setFormError(`Distribution quantity exceeds available quantity (${selectedItemObj.availableQuantity} available).`);
      return;
    }

    setSaving(true);
    try {
      await adminApi.recordDistribution({
        itemId: Number(form.itemId),
        recipientId: Number(form.recipientId),
        quantity: Number(form.quantity),
        distributionDate: form.distributionDate,
        notes: form.notes,
      });
      setIsModalOpen(false);
      fetchDistributions();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to record distribution.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteDistribution(deleteTarget.id);
      setDeleteTarget(null);
      fetchDistributions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete distribution record.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Fulfillment Log</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-0.5">
            Distributions Management
          </h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Record and verify handovers of collected clothes and books to recipients
          </p>
        </div>

        <button
          onClick={openRecordModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Record Distribution</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search by item, recipient or distributor..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : distributions.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Share2 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No distributions recorded</h3>
            <p className="text-xs text-neutral-500 mt-1 font-medium">Click "Record Distribution" to distribute collected items.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Item & Category</th>
                  <th className="px-6 py-4">Recipient Organization</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Distributed By</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Notes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {distributions.map((dist) => (
                  <tr key={dist.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-neutral-400">#{dist.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-neutral-900 block">{dist.itemName}</span>
                      <span className="text-neutral-400 text-[10px]">{dist.categoryName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-neutral-800 block">{dist.recipientName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-brand-50 text-brand-700 border border-brand-200">
                        {dist.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 font-medium">{dist.distributedBy}</td>
                    <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">{formatDate(dist.distributionDate)}</td>
                    <td className="px-6 py-4 text-neutral-500 max-w-[200px] truncate">{dist.notes || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(dist)}
                        title="Delete Record"
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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

      {/* Record Distribution Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-neutral-900">Record Item Distribution</h3>
                <p className="text-xs text-neutral-400 font-medium">Fulfill collected items to a registered recipient</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingModalData ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
              </div>
            ) : itemsList.length === 0 ? (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <h4 className="text-sm font-bold text-amber-900">No Collected Items Available</h4>
                <p className="text-xs text-amber-700">
                  Business Rule: An item can only be distributed after it is marked <strong>COLLECTED</strong> and has an available quantity &gt; 0.
                </p>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">
                      Collected Item to Distribute *
                    </label>
                    <select
                      value={form.itemId}
                      onChange={(e) => setForm({ ...form, itemId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-xs"
                    >
                      {itemsList.map(i => (
                        <option key={i.id} value={i.id}>
                          {i.itemName} ({i.availableQuantity} available in {i.categoryName})
                        </option>
                      ))}
                    </select>
                    {selectedItemObj && (
                      <span className="block mt-1 text-[11px] text-emerald-700 font-bold">
                        ✓ Available in storage: {selectedItemObj.availableQuantity} units (Total: {selectedItemObj.quantity})
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">
                      Recipient Organization *
                    </label>
                    <select
                      value={form.recipientId}
                      onChange={(e) => setForm({ ...form, recipientId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-xs"
                    >
                      {recipientsList.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.organizationName} ({r.organizationType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">
                        Quantity to Distribute *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={selectedItemObj?.availableQuantity || 999}
                        required
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value === '' ? '' : parseInt(e.target.value, 10) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-black text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">
                        Distribution Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={form.distributionDate}
                        onChange={(e) => setForm({ ...form, distributionDate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">
                      Handover Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="e.g. Delivered directly to orphanage intake coordinator..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-xs resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      {saving ? 'Recording...' : 'Confirm Distribution'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Distribution Entry"
        message={`Are you sure you want to delete this distribution record? The distributed quantity will be restored back to the available inventory pool.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Distribution'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDanger={true}
      />
    </div>
  );
}
