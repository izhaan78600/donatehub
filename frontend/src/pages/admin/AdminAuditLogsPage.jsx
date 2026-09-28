import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import Pagination from '../../components/Pagination';
import { FileClock, Search, Filter, ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    adminApi.getAuditLogs({
      query: search,
      entityType: entityFilter || null,
      page,
      size: pageSize
    })
      .then(res => {
        setLogs(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [page, search, entityFilter]);

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) : '—';

  const getActionBadge = (action) => {
    let color = 'bg-neutral-100 text-neutral-800 border-neutral-200';
    if (action === 'CREATE' || action === 'REGISTER') color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    else if (action === 'DISTRIBUTE') color = 'bg-teal-50 text-teal-700 border-teal-200';
    else if (action === 'UPDATE' || action === 'UPDATE_STATUS' || action === 'UPDATE_PROFILE') color = 'bg-blue-50 text-blue-700 border-blue-200';
    else if (action === 'DELETE') color = 'bg-rose-50 text-rose-700 border-rose-200';
    else if (action === 'LOGIN') color = 'bg-purple-50 text-purple-700 border-purple-200';

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${color}`}>
        {action}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Compliance & Security</span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-0.5">
          System Audit Logs
        </h1>
        <p className="text-xs text-neutral-500 font-medium mt-1">
          Immutable audit trail capturing administrative activities, donations, distributions and user authentications
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by action, description or entity..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => { setEntityFilter(e.target.value); setPage(0); }}
          className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm w-full sm:w-auto"
        >
          <option value="">All Entities</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="DRIVE">DRIVE</option>
          <option value="DONATION">DONATION</option>
          <option value="DISTRIBUTION">DISTRIBUTION</option>
          <option value="RECIPIENT">RECIPIENT</option>
          <option value="CATEGORY">CATEGORY</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 px-4">
            <FileClock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No audit logs found</h3>
            <p className="text-xs text-neutral-500 mt-1 font-medium">Activity logs will populate automatically upon system actions.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Target Entity</th>
                  <th className="px-6 py-4">Entity ID</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-6 py-3.5 text-neutral-400">#{log.id}</td>
                    <td className="px-6 py-3.5 font-sans">{getActionBadge(log.action)}</td>
                    <td className="px-6 py-3.5 font-sans font-bold text-neutral-800">{log.entityType}</td>
                    <td className="px-6 py-3.5 text-neutral-500">#{log.entityId || '—'}</td>
                    <td className="px-6 py-3.5 text-neutral-500">{log.userId ? `User #${log.userId}` : 'System'}</td>
                    <td className="px-6 py-3.5 font-sans text-neutral-700 max-w-sm font-medium">{log.description}</td>
                    <td className="px-6 py-3.5 font-sans text-neutral-400 whitespace-nowrap">{formatDate(log.createdAt)}</td>
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
    </div>
  );
}
