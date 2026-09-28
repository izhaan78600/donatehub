import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Shield, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-100">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center text-brand-400">
                <HeartHandshake className="w-5 h-5 text-brand-400" />
              </div>
              <span className="text-xl font-black tracking-tight text-neutral-900 uppercase">
                DONATE<span className="text-brand-600">HUB</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-neutral-800">
              "Give More. Waste Less."
            </p>
            <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
              A transparent, full-stack donation drive platform designed to collect, catalog, and distribute gently used clothes and educational books to charities, orphanages, and community shelters.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-50 border border-neutral-200 text-neutral-600">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>College Project Leap Java + DBMS Capstone</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-neutral-500 font-medium">
              <li><Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link></li>
              <li><Link to="/drives" className="hover:text-neutral-900 transition-colors">Active Drives</Link></li>
              <li><Link to="/about" className="hover:text-neutral-900 transition-colors">About Project</Link></li>
              <li><Link to="/signup" className="hover:text-neutral-900 transition-colors">Donor Signup</Link></li>
              <li><Link to="/login" className="hover:text-neutral-900 transition-colors">Donor Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">Administration</h4>
            <ul className="space-y-2.5 text-sm text-neutral-500 font-medium">
              <li><Link to="/admin/login" className="hover:text-neutral-900 transition-colors flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Admin Access</Link></li>
              <li><a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="hover:text-neutral-900 transition-colors">Swagger OpenAPI</a></li>
              <li><a href="http://localhost:8080/v3/api-docs" target="_blank" rel="noreferrer" className="hover:text-neutral-900 transition-colors">REST API Spec</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} DONATEHUB — All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Spring Boot 3 + MySQL + React</span>
            <span>•</span>
            <span>Secure Role-Based Access Control</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
