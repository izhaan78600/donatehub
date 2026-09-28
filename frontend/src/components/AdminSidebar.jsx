import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Compass,
  Package,
  HeartHandshake,
  Building2,
  Share2,
  Tags,
  BarChart3,
  FileClock,
  Settings,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Donation Drives', path: '/admin/drives', icon: Compass },
    { name: 'Donations', path: '/admin/donations', icon: Package },
    { name: 'Donors', path: '/admin/donors', icon: HeartHandshake },
    { name: 'Recipients', path: '/admin/recipients', icon: Building2 },
    { name: 'Distributions', path: '/admin/distributions', icon: Share2 },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileClock },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-neutral-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center text-brand-400 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                ADMIN<span className="text-brand-600">HUB</span>
              </span>
              <span className="block text-[9px] uppercase tracking-widest font-bold text-neutral-400">
                DonateHub Management
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User & Logout section */}
        <div className="p-4 border-t border-neutral-100 space-y-2">
          <div className="px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="text-xs font-bold text-neutral-900 truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[11px] text-neutral-500 truncate">{user?.email || 'admin@donatehub.com'}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
