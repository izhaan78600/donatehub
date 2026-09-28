import React from 'react';

export const DonutChart = ({ data = [], size = 180, strokeWidth = 24 }) => {
  if (!data || data.length === 0) {
    return <div className="text-xs text-neutral-400 py-6 text-center">No breakdown data</div>;
  }

  const total = data.reduce((acc, curr) => acc + (curr.value || 0), 0);
  if (total === 0) {
    return <div className="text-xs text-neutral-400 py-6 text-center">Zero total items</div>;
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  const colors = [
    '#059669', // emerald
    '#2563eb', // blue
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {data.map((item, idx) => {
            const val = item.value || 0;
            const strokeDasharray = `${(val / total) * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedOffset;
            accumulatedOffset += (val / total) * circumference;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color || colors[idx % colors.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500 hover:opacity-80"
              />
            );
          })}
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-extrabold text-neutral-900 tracking-tight">{total}</span>
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 min-w-[140px]">
        {data.map((item, idx) => {
          const color = item.color || colors[idx % colors.length];
          const pct = Math.round(((item.value || 0) / total) * 100);
          return (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                <span className="text-neutral-700 font-medium truncate max-w-[100px]">{item.label}</span>
              </div>
              <span className="font-semibold text-neutral-900">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonutChart;
