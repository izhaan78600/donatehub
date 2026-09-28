import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'User Management',
  '/admin/drives': 'Donation Drives',
  '/admin/donations': 'Donations',
  '/admin/donors': 'Donors',
  '/admin/recipients': 'Recipients',
  '/admin/distributions': 'Distributions',
  '/admin/categories': 'Item Categories',
  '/admin/reports': 'Reports & Analytics',
  '/admin/audit-logs': 'Audit Logs',
};

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Admin Panel';

  return (
    <div className="min-h-screen bg-neutral-50/80 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-64">
        <AdminHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
