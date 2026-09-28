import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, ExternalLink, ShieldCheck, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminHeader = ({ onMenuClick, title }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-xl hover:bg-neutral-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            {title || 'Overview'}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Connected to MySQL donatehub_db
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
        </Link>

        <div className="flex items-center gap-2.5 pl-3 border-l border-neutral-200">
          <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs">
            AD
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-neutral-900 leading-none">{user?.name || 'Admin'}</p>
            <p className="text-[10px] font-semibold text-brand-600 mt-1 uppercase">ROLE_ADMIN</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
