import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Building2, Plus, Search, Edit3, Trash2, Mail, Phone, MapPin, Loader2, X, AlertCircle } from 'lucide-react';

export default function AdminRecipientsPage() {
  const [recipients, setRecipients] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState(null);
  const [form, setForm] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    organizationType: 'ORPHANAGE',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRecipients = () => {
    setLoading(true);
    adminApi.getRecipients({
      query: search,
      organizationType: typeFilter || null,
      page,
      size: pageSize
    })
      .then(res => {
        setRecipients(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecipients();
  }, [page, search, typeFilter]);

  const openCreateModal = () => {
    setEditingRecipient(null);
    setForm({
      organizationName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      organizationType: 'ORPHANAGE',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (r) => {
    setEditingRecipient(r);
    setForm({
      organizationName: r.organizationName,
      contactPerson: r.contactPerson,
      email: r.email,
      phone: r.phone,
      address: r.address,
      organizationType: r.organizationType,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editingRecipient) {
        await adminApi.updateRecipient(editingRecipient.id, form);
      } else {
        await adminApi.createRecipient(form);
      }
      setIsModalOpen(false);
      fetchRecipients();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save recipient.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteRecipient(deleteTarget.id);
      setDeleteTarget(null);
      fetchRecipients();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete recipient.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Partner Network</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-0.5">
            Recipients Management
          </h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Registered partner orphanages, shelters, schools, and NGOs
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recipient</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by organization name, contact or email..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
          className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm w-full sm:w-auto"
        >
          <option value="">All Organization Types</option>
          <option value="ORPHANAGE">ORPHANAGE</option>
          <option value="SHELTER">SHELTER</option>
          <option value="SCHOOL">SCHOOL</option>
          <option value="NGO">NGO</option>
          <option value="COMMUNITY_CENTER">COMMUNITY_CENTER</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : recipients.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No recipients found</h3>
            <p className="text-xs text-neutral-500 mt-1 font-medium">Add a recipient organization to record distributions.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Contact Person</th>
                  <th className="px-6 py-4">Email & Phone</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recipients.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-neutral-400">#{r.id}</td>
                    <td className="px-6 py-4 font-bold text-neutral-900">{r.organizationName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                        {r.organizationType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-neutral-700">{r.contactPerson}</td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-900 block font-medium">{r.email}</span>
                      <span className="text-[10px] text-neutral-400">{r.phone}</span>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 max-w-[180px] truncate">{r.address}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(r)}
                          title="Edit Recipient"
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
                          title="Delete Recipient"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-neutral-900">
                {editingRecipient ? 'Edit Recipient Organization' : 'Add Recipient Organization'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={form.organizationName}
                  onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                  placeholder="e.g. Hope Horizon Children's Home"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    placeholder="e.g. Claire Matthews"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">Organization Type</label>
                  <select
                    value={form.organizationType}
                    onChange={(e) => setForm({ ...form, organizationType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-xs"
                  >
                    <option value="ORPHANAGE">ORPHANAGE</option>
                    <option value="SHELTER">SHELTER</option>
                    <option value="SCHOOL">SCHOOL</option>
                    <option value="NGO">NGO</option>
                    <option value="COMMUNITY_CENTER">COMMUNITY_CENTER</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contact@org.org"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1-555-0200"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">Address *</label>
                <textarea
                  rows={2}
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Facility street address, city, state"
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
                  {saving ? 'Saving...' : editingRecipient ? 'Update Recipient' : 'Add Recipient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Recipient Organization"
        message={`Are you sure you want to delete recipient "${deleteTarget?.organizationName}"?`}
        confirmText={deleting ? 'Deleting...' : 'Delete Recipient'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDanger={true}
      />
    </div>
  );
}
