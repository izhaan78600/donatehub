import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const s = status.toUpperCase();

  let styles = 'bg-neutral-100 text-neutral-700 border-neutral-200';

  if (s === 'ACTIVE') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (s === 'COLLECTED') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (s === 'DISTRIBUTED') {
    styles = 'bg-teal-50 text-teal-800 border-teal-200';
  } else if (s === 'PENDING') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (s === 'CANCELLED') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (s === 'COMPLETED') {
    styles = 'bg-purple-50 text-purple-700 border-purple-200';
  } else if (s === 'NEW') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (s === 'GOOD') {
    styles = 'bg-sky-50 text-sky-700 border-sky-200';
  } else if (s === 'WORN') {
    styles = 'bg-orange-50 text-orange-700 border-orange-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {s}
    </span>
  );
};

export default StatusBadge;
