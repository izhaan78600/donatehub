import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { driveApi } from '../services/api';
import { Compass, Calendar, MapPin, Package, Loader2, Search } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function DrivesPage() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    driveApi.getActiveDrives()
      .then(res => setDrives(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = drives.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.location.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      {/* Header */}
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Active Now</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 mt-2">
          Donation Drives
        </h1>
        <p className="mt-4 text-lg text-neutral-500 font-medium max-w-2xl">
          Browse all active donation drives. Choose a drive and donate clothes or books to communities that need them.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search drives by name or location..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-neutral-200">
          <Compass className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
          <p className="text-lg font-bold text-neutral-900">No active drives found</p>
          <p className="text-sm text-neutral-500 mt-2 font-medium">Check back later or try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((drive) => (
            <div key={drive.id} className="group bg-white border border-neutral-200 rounded-2xl p-7 hover:border-brand-300 hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <StatusBadge status={drive.status} />
                <span className="flex items-center gap-1 text-xs font-semibold text-neutral-500">
                  <Package className="w-3.5 h-3.5" />
                  {drive.totalItems} items
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-neutral-900 leading-snug group-hover:text-brand-700 transition-colors mb-3 flex-1">
                {drive.name}
              </h3>

              {drive.description && (
                <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-5 font-medium">
                  {drive.description}
                </p>
              )}

              <div className="space-y-2 text-xs font-semibold text-neutral-500 border-t border-neutral-100 pt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                  <span className="truncate">{drive.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                  <span>{formatDate(drive.startDate)} — {formatDate(drive.endDate)}</span>
                </div>
              </div>

              <Link
                to="/user/donations/new"
                state={{ driveId: drive.id }}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-all active:scale-[0.98]"
              >
                Donate to this Drive
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
