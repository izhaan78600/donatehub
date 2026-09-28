import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import DrivesPage from './pages/DrivesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminLoginPage from './pages/AdminLoginPage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserProfilePage from './pages/user/UserProfilePage';
import UserDrivesPage from './pages/user/UserDrivesPage';
import UserDonationsPage from './pages/user/UserDonationsPage';
import NewDonationPage from './pages/user/NewDonationPage';
import DonationDetailsPage from './pages/user/DonationDetailsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminDrivesPage from './pages/admin/AdminDrivesPage';
import AdminDonationsPage from './pages/admin/AdminDonationsPage';
import AdminDonorsPage from './pages/admin/AdminDonorsPage';
import AdminRecipientsPage from './pages/admin/AdminRecipientsPage';
import AdminDistributionsPage from './pages/admin/AdminDistributionsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/drives" element={<DrivesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Admin Login (Isolated Fullscreen) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* User Protected Routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute requiredRole="ROLE_USER">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="drives" element={<UserDrivesPage />} />
            <Route path="donations" element={<UserDonationsPage />} />
            <Route path="donations/new" element={<NewDonationPage />} />
            <Route path="donations/:id" element={<DonationDetailsPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="drives" element={<AdminDrivesPage />} />
            <Route path="donations" element={<AdminDonationsPage />} />
            <Route path="donors" element={<AdminDonorsPage />} />
            <Route path="recipients" element={<AdminRecipientsPage />} />
            <Route path="distributions" element={<AdminDistributionsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="audit-logs" element={<AdminAuditLogsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
