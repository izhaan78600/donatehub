import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, Menu, X, ArrowRight, User as UserIcon, Shield, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-brand-400 shadow-sm group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-neutral-900 uppercase">
              DONATE<span className="text-brand-600">HUB</span>
            </span>
            <span className="hidden sm:block text-[9px] uppercase tracking-widest font-bold text-neutral-400">
              Give More. Waste Less.
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-600">
          <Link
            to="/"
            className={`transition-colors hover:text-neutral-900 ${isActive('/') ? 'text-neutral-900 font-bold' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/drives"
            className={`transition-colors hover:text-neutral-900 ${isActive('/drives') ? 'text-neutral-900 font-bold' : ''}`}
          >
            Donation Drives
          </Link>
          <Link
            to="/about"
            className={`transition-colors hover:text-neutral-900 ${isActive('/about') ? 'text-neutral-900 font-bold' : ''}`}
          >
            About
          </Link>

          {isUser && (
            <Link
              to="/user/dashboard"
              className={`transition-colors hover:text-neutral-900 ${isActive('/user/dashboard') ? 'text-neutral-900 font-bold' : ''}`}
            >
              Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-brand-400" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isUser && (
                <Link
                  to="/user/donations/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow transition-all active:scale-95"
                >
                  <span>Donate Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link
                to={isAdmin ? '/admin/dashboard' : '/user/profile'}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors border border-neutral-200"
              >
                <UserIcon className="w-3.5 h-3.5 text-neutral-500" />
                <span className="truncate max-w-[120px]">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/admin/login"
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 px-3 py-2 transition-colors"
              >
                Admin
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold text-neutral-700 hover:text-neutral-900 px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm hover:shadow transition-all active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu modal */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Home
          </Link>
          <Link
            to="/drives"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Donation Drives
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            About
          </Link>

          {isUser && (
            <>
              <Link
                to="/user/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                User Dashboard
              </Link>
              <Link
                to="/user/donations/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-bold text-brand-600 hover:bg-brand-50"
              >
                Donate Now
              </Link>
              <Link
                to="/user/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                My Profile
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-bold text-neutral-900 bg-neutral-100"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-rose-600 hover:bg-rose-50"
              >
                Logout ({user.name})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2.5 rounded-xl font-semibold border border-neutral-200 text-neutral-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2.5 rounded-xl font-bold bg-neutral-900 text-white"
                >
                  Create Account
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-xs text-neutral-500 py-1"
                >
                  Admin Portal Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
