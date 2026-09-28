import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { driveApi } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Compass, Calendar, MapPin, Package, ArrowRight, Loader2, Search } from 'lucide-react';

export default function UserDrivesPage() {
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Explore</span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-1">
            Donation Drives
          </h1>
          <p className="mt-2 text-sm text-neutral-500 font-medium">Select an active drive and start donating items directly.</p>
        </div>

        <Link
          to="/user/donations/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm transition-all"
        >
          <span>Donate Items</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="relative max-w-md">
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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 p-8">
          <Compass className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-800">No active drives match your search</h3>
          <p className="text-sm text-neutral-500 mt-1 font-medium">Please check back soon or try another search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((drive) => (
            <div key={drive.id} className="bg-white rounded-3xl border border-neutral-200 p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <StatusBadge status={drive.status} />
                  <span className="flex items-center gap-1 text-xs font-bold text-neutral-500">
                    <Package className="w-3.5 h-3.5" />
                    {drive.totalItems} items donated
                  </span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-2 leading-tight">
                  {drive.name}
                </h3>

                <p className="text-sm text-neutral-500 font-medium line-clamp-3 mb-6 leading-relaxed">
                  {drive.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <div className="space-y-2 text-xs font-semibold text-neutral-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                    <span className="truncate">{drive.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                    <span>{formatDate(drive.startDate)} — {formatDate(drive.endDate)}</span>
                  </div>
                </div>

                <Link
                  to="/user/donations/new"
                  state={{ driveId: drive.id }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 transition-all shadow-sm"
                >
                  <span>Donate to this Drive</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
