import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { userApi } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { ArrowLeft, Package, Calendar, Compass, Tags, HeartHandshake, CheckCircle2, Clock, Share2, Loader2, AlertCircle } from 'lucide-react';

export default function DonationDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const justCreated = location.state?.created;

  useEffect(() => {
    userApi.getUserDonationById(id)
      .then(res => setDonation(res.data))
      .catch(err => {
        setError(err.response?.data?.message || 'Donation not found or unauthorized.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Pending';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-900">{error || 'Donation not found'}</h2>
        <Link
          to="/user/donations"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to my donations</span>
        </Link>
      </div>
    );
  }

  const steps = [
    { title: 'Donation Pledged', desc: 'Registered in system', done: true, current: donation.status === 'PENDING' },
    { title: 'Item Collected', desc: donation.collectionDate ? `Collected on ${formatDate(donation.collectionDate)}` : 'Awaiting drive coordinator collection', done: donation.status === 'COLLECTED' || donation.status === 'DISTRIBUTED', current: donation.status === 'COLLECTED' },
    { title: 'Distributed to Recipient', desc: donation.distributedQuantity > 0 ? `${donation.distributedQuantity} units handed over to partner organization` : 'In queue for distribution', done: donation.status === 'DISTRIBUTED' || donation.distributedQuantity > 0, current: donation.status === 'DISTRIBUTED' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <Link
          to="/user/donations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to donations</span>
        </Link>

        {justCreated && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Thank you! Your donation has been recorded successfully.</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Tracking ID: #{donation.id}</span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-1">
              {donation.itemName}
            </h1>
            <p className="mt-1 text-sm text-neutral-500 font-medium">Recorded on {formatDate(donation.createdAt)}</p>
          </div>
          <StatusBadge status={donation.status} />
        </div>
      </div>

      {/* Tracking Stepper / Status Flow */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wider text-xs">Donation Lifecycle</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((st, idx) => (
            <div key={st.title} className="flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  st.done ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-400'
                }`}>
                  {st.done ? '✓' : idx + 1}
                </div>
                <h4 className={`text-sm font-bold ${st.done ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {st.title}
                </h4>
              </div>
              <p className="text-xs text-neutral-500 pl-11 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Item Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item specifics */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-neutral-900">Donated Item Information</h3>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500 font-medium">Category</span>
              <span className="font-bold text-neutral-900">{donation.categoryName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500 font-medium">Total Quantity</span>
              <span className="font-bold text-neutral-900">{donation.quantity} units</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500 font-medium">Condition</span>
              <StatusBadge status={donation.condition} />
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500 font-medium">Collected Date</span>
              <span className="font-bold text-neutral-900">{formatDate(donation.collectionDate)}</span>
            </div>
          </div>

          {donation.description && (
            <div className="pt-2">
              <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Donor Notes</span>
              <p className="text-sm text-neutral-700 bg-neutral-50 p-4 rounded-xl border border-neutral-100 font-medium">
                {donation.description}
              </p>
            </div>
          )}
        </div>

        {/* Distribution Impact Breakdown */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Drive & Distribution Status</h3>

            <div className="mt-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">Associated Drive</span>
              <h4 className="text-base font-bold text-neutral-900">{donation.driveName}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="block text-3xl font-black text-emerald-700">{donation.distributedQuantity || 0}</span>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-1 block">Distributed</span>
              </div>
              <div className="p-5 rounded-2xl bg-neutral-100 border border-neutral-200 text-center">
                <span className="block text-3xl font-black text-neutral-800">{donation.availableQuantity}</span>
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider mt-1 block">In Storage</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-neutral-400 font-medium pt-4 border-t border-neutral-100 text-center">
            Managed via DonateHub Verified Verification & Distribution Chain
          </div>
        </div>
      </div>
    </div>
  );
}
