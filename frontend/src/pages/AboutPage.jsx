import React from 'react';
import { HeartHandshake, BookOpen, Shirt, ShieldCheck, Database, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200">
          College Project Leap Java + DBMS
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-900">
          About DONATE<span className="text-brand-600">HUB</span>
        </h1>
        <p className="text-lg text-neutral-600 font-medium leading-relaxed">
          "Give More. Waste Less." — A verified donation tracking platform bridging donors with community orphanages, shelters, and rural schools.
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900">Our Purpose</h2>
          <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
            Every year, millions of gently used clothes and educational books are discarded or kept in storage while underprivileged shelters and rural schools lack basic educational supplies and warm clothing.
          </p>
          <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
            DonateHub eliminates ambiguity by organizing structured donation drives, cataloging donated items by category and condition, and enforcing strict inventory distribution checks to accredited recipients.
          </p>
        </div>

        <div className="bg-neutral-900 rounded-3xl p-8 sm:p-10 text-white space-y-6 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-400">Technical Foundation</h3>
          <h2 className="text-2xl font-black">Enterprise Architecture</h2>
          <div className="space-y-4 text-sm text-neutral-300">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Relational DBMS (MySQL)</strong>
                Strict schema normalization across 9 tables with foreign keys and unique constraints.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Spring Security & BCrypt</strong>
                Stateless JWT tokens and role-based route guards for ROLE_USER and ROLE_ADMIN.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Business Rule Integrity</strong>
                Distribution validation in service layer guaranteeing available quantity cannot be exceeded.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-neutral-900">Two Core Pillars of Giving</h2>
          <p className="text-sm text-neutral-500 font-medium mt-2">Specialized collection and redistribution pipeline</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Shirt className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-neutral-900">Clothing Redistribution</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Collecting winter jackets, everyday shirts, pants, children's clothes, and ethnic garments. Sorted by condition (NEW, GOOD, WORN) and sanitized prior to handover to community shelters.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-neutral-900">Literacy & Book Drives</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Collecting school curriculum textbooks, early reader picture books, science guides, and literature for rural libraries and children's home study centers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-brand-50 border border-brand-200 rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-3xl font-black text-neutral-900">Ready to contribute?</h2>
        <p className="text-neutral-600 max-w-xl mx-auto text-sm sm:text-base font-medium">
          Join hundreds of conscious donors in decluttering responsibly and supporting individuals in need.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 transition-all shadow-md"
          >
            <span>Create an Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/drives"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-neutral-800 font-bold text-sm border border-neutral-300 hover:bg-neutral-50 transition-all shadow-sm"
          >
            <span>Browse Drives</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
