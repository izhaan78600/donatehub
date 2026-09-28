import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';
import { Compass, Plus, Search, Edit3, Trash2, Calendar, MapPin, Loader2, X, AlertCircle } from 'lucide-react';

export default function AdminDrivesPage() {
  const [drives, setDrives] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'ACTIVE',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDrives = () => {
    setLoading(true);
    adminApi.getDrives({ query: search, status: statusFilter || null, page, size: pageSize })
      .then(res => {
        setDrives(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDrives();
  }, [page, search, statusFilter]);

  const openCreateModal = () => {
    setEditingDrive(null);
    setForm({
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: '',
      status: 'ACTIVE',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (d) => {
    setEditingDrive(d);
    setForm({
      name: d.name,
      description: d.description || '',
      startDate: d.startDate || '',
      endDate: d.endDate || '',
      location: d.location,
      status: d.status,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setFormError('Drive end date cannot be before start date.');
      return;
    }

    setSaving(true);
    try {
      if (editingDrive) {
        await adminApi.updateDrive(editingDrive.id, form);
      } else {
        await adminApi.createDrive(form);
      }
      setIsModalOpen(false);
      fetchDrives();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save drive.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteDrive(deleteTarget.id);
      setDeleteTarget(null);
      fetchDrives();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete drive with active donated items.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Drive Campaigns</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-0.5">
            Donation Drives Management
          </h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Create and track location campaigns for clothes and books
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Drive</span>
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
            placeholder="Search drives by name or location..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm w-full sm:w-auto"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="PLANNED">PLANNED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Drives Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : drives.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Compass className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No donation drives found</h3>
            <p className="text-xs text-neutral-500 mt-1 font-medium">Create a new drive to start collecting donations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Drive Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Items Count</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {drives.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-neutral-400">#{d.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-neutral-900 block">{d.name}</span>
                      {d.description && <span className="text-neutral-400 text-[11px] line-clamp-1">{d.description}</span>}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 font-medium">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-600" /> {d.location}</span>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">
                      {formatDate(d.startDate)} — {formatDate(d.endDate)}
                    </td>
                    <td className="px-6 py-4 font-black text-neutral-900">{d.totalItems}</td>
                    <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(d)}
                          title="Edit Drive"
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(d)}
                          title="Delete Drive"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-neutral-900">
                {editingDrive ? 'Edit Donation Drive' : 'Create Donation Drive'}
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
                <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">Drive Title *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Winter Warmth Drive 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">Location / Venue *</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Community Center, 12th Avenue"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">End Date *</label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">Drive Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-xs"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PLANNED">PLANNED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 uppercase tracking-wide mb-1.5">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detail the target goals, items accepted, collection timings..."
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
                  {saving ? 'Saving...' : editingDrive ? 'Update Drive' : 'Create Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Donation Drive"
        message={`Are you sure you want to delete drive "${deleteTarget?.name}"? Make sure there are no existing donated items linked to this drive.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Drive'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDanger={true}
      />
    </div>
  );
}
