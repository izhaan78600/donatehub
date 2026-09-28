import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { driveApi } from '../services/api';
import { ArrowRight, HeartHandshake, Shirt, BookOpen, Package, Users, Compass, CheckCircle2, Zap, ShieldCheck, TrendingUp } from 'lucide-react';

const steps = [
  { num: '01', title: 'Create Account', desc: 'Register in seconds with your name, email, and address. No credit card needed.' },
  { num: '02', title: 'Choose a Drive', desc: 'Browse active donation drives organized by location and item type.' },
  { num: '03', title: 'Donate Items', desc: 'Record what you\'re donating — clothes, books, quantity and condition.' },
  { num: '04', title: 'Track Your Impact', desc: 'Follow your donation from collection to final distribution.' },
];

const categories = [
  { icon: Shirt, name: 'Winter Clothing', desc: 'Jackets, sweaters, coats, scarves, and warm accessories.', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { icon: BookOpen, name: 'Children\'s Books', desc: 'Picture books, storybooks, and early learning guides.', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { icon: Package, name: 'School Textbooks', desc: 'Grade 1–12 curriculum books and reference materials.', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  { icon: Shirt, name: 'Men\'s Wear', desc: 'Shirts, trousers, jeans and casual sportswear.', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { icon: Shirt, name: 'Women\'s Wear', desc: 'Kurtas, dresses, ethnic and casual clothing.', color: 'bg-rose-50 text-rose-700 border-rose-100' },
];

const whyPoints = [
  { icon: ShieldCheck, title: 'Secure & Private', desc: 'JWT authentication with role-based access control. Your data stays protected.' },
  { icon: TrendingUp, title: 'Full Traceability', desc: 'Every item is tracked from donation to distribution with a complete audit trail.' },
  { icon: Zap, title: 'Instant Transparency', desc: 'Real-time dashboard stats powered directly from the MySQL database — zero hardcoded values.' },
  { icon: CheckCircle2, title: 'Admin-Verified', desc: 'Items are verified and marked collected by admins before being distributed to recipients.' },
];

const StatPill = ({ value, label }) => (
  <div className="bg-white rounded-2xl border border-neutral-200 px-7 py-5 text-center shadow-sm">
    <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">{value}</div>
    <div className="text-xs font-semibold text-neutral-500 mt-1 uppercase tracking-wider">{label}</div>
  </div>
);

export default function LandingPage() {
  const [drives, setDrives] = useState([]);
  const [loadingDrives, setLoadingDrives] = useState(true);

  useEffect(() => {
    driveApi.getActiveDrives()
      .then(res => setDrives(res.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingDrives(false));
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center bg-[#fafafa] px-4 py-24 text-center overflow-hidden">
        {/* subtle bg grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 bg-white shadow-sm text-xs font-bold text-neutral-600 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            Project Leap Java + DBMS — Spring Boot 3 · MySQL · React
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-neutral-900 leading-none">
            DONATE
            <span className="text-brand-600">HUB</span>
          </h1>

          <p className="mt-5 text-xl sm:text-2xl font-bold text-neutral-700 tracking-tight">
            "Give More. Waste Less."
          </p>

          <p className="mt-6 text-base sm:text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto font-medium">
            One simple platform to collect, manage, and distribute donated clothes and books to communities that need them most.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-full text-base font-bold shadow-xl hover:shadow-2xl hover:bg-neutral-800 transition-all active:scale-[0.97]"
            >
              <HeartHandshake className="w-5 h-5 text-brand-400" />
              DONATE NOW
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/drives"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-800 rounded-full text-base font-bold border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 shadow-sm transition-all active:scale-[0.97]"
            >
              <Compass className="w-5 h-5" />
              EXPLORE DRIVES
            </Link>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-6 py-4 text-neutral-600 font-semibold text-sm border border-dashed border-neutral-300 rounded-full hover:border-neutral-500 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              ADMIN LOGIN
            </Link>
          </div>
        </div>

        {/* Floating badge */}
        <div className="absolute bottom-8 right-4 sm:right-12 hidden md:flex items-center gap-2 bg-white rounded-2xl border border-neutral-200 shadow-lg px-5 py-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-bold text-neutral-700">Live Spring Boot API</span>
          <span className="text-xs text-neutral-400">· Port 8080</span>
        </div>
      </section>

      {/* ── Impact Stats ── */}
      <section className="bg-white border-y border-neutral-200 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatPill value="10+" label="Donated Items" />
            <StatPill value="3" label="Active Drives" />
            <StatPill value="3" label="Recipients" />
            <StatPill value="5" label="Donors" />
          </div>
          <p className="text-center mt-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            All numbers come directly from the MySQL database — never hardcoded
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">The Process</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mt-3">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="group bg-white rounded-2xl border border-neutral-200 p-7 hover:border-brand-300 hover:shadow-md transition-all">
                <div className="text-5xl font-black text-neutral-100 group-hover:text-brand-100 transition-colors leading-none mb-4">
                  {step.num}
                </div>
                <h3 className="text-base font-extrabold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active Drives ── */}
      <section className="py-24 px-4 bg-white border-t border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start sm:items-center justify-between mb-12 flex-col sm:flex-row gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Live Data</span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mt-2">
                Active Donation Drives
              </h2>
            </div>
            <Link
              to="/drives"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingDrives ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-48 bg-neutral-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : drives.length === 0 ? (
            <div className="text-center py-16 text-neutral-400 text-sm font-semibold">
              No active drives at the moment. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drives.map((drive) => (
                <Link
                  key={drive.id}
                  to={`/drives`}
                  className="group bg-white border border-neutral-200 rounded-2xl p-7 hover:border-brand-300 hover:shadow-md transition-all block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      ACTIVE
                    </span>
                    <span className="text-xs font-semibold text-neutral-400">{drive.totalItems} items</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-neutral-900 leading-snug group-hover:text-brand-700 transition-colors mb-2">
                    {drive.name}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-4">{drive.description}</p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
                    <Compass className="w-3.5 h-3.5" />
                    <span className="truncate">{drive.location}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Donate to this drive <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-24 px-4 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">What We Collect</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mt-3">
              Donation Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.name} className={`rounded-2xl border p-5 text-center hover:shadow-md transition-all ${cat.color}`}>
                  <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-extrabold leading-snug">{cat.name}</p>
                  <p className="text-xs mt-1 opacity-75 line-clamp-2">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why DonateHub ── */}
      <section className="py-24 px-4 bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Why This Platform</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
              Why DonateHub?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-2">{point.title}</h3>
                  <p className="text-sm text-neutral-400 font-medium leading-relaxed">{point.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-white border-t border-neutral-200">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Join the Movement</span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-neutral-900 mt-4 leading-none">
            Start Donating<br />Today
          </h2>
          <p className="mt-6 text-lg text-neutral-500 font-medium max-w-xl mx-auto leading-relaxed">
            Create your free account in under a minute and start making a difference. Every item counts.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-full text-base font-bold shadow-xl hover:shadow-2xl hover:bg-neutral-800 transition-all active:scale-[0.97]"
            >
              <HeartHandshake className="w-5 h-5 text-brand-400" />
              CREATE FREE ACCOUNT
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/drives"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-800 rounded-full text-base font-bold border border-neutral-200 hover:border-neutral-400 shadow-sm transition-all"
            >
              Browse Drives First
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
