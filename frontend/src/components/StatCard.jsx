import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'brand' }) => {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">{title}</span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">{value}</span>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs font-medium text-neutral-500 leading-relaxed">
          {subtitle}
        </p>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default StatCard;
