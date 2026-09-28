import React, { useState } from 'react';

export const BarChart = ({ data = [], height = 240, xKey = 'label', yKey1 = 'val1', yKey2 = 'val2', label1 = 'Collected', label2 = 'Distributed' }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-neutral-400">
        No trend data available
      </div>
    );
  }

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d[yKey1] || 0, d[yKey2] || 0)),
    10
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-4 text-xs font-medium text-neutral-500 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-neutral-900"></span>
          <span>{label1}</span>
        </div>
        {yKey2 && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-brand-500"></span>
            <span>{label2}</span>
          </div>
        )}
      </div>

      <div className="relative flex items-end gap-3 sm:gap-6 justify-between pt-6 pb-2" style={{ height: `${height}px` }}>
        {/* Subtle grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="w-full border-b border-neutral-300"></div>
          <div className="w-full border-b border-neutral-300"></div>
          <div className="w-full border-b border-neutral-300"></div>
          <div className="w-full border-b border-neutral-300"></div>
        </div>

        {data.map((item, idx) => {
          const val1 = item[yKey1] || 0;
          const val2 = yKey2 ? item[yKey2] || 0 : 0;
          const h1Percent = Math.min(100, Math.round((val1 / maxVal) * 100));
          const h2Percent = Math.min(100, Math.round((val2 / maxVal) * 100));

          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end group relative"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-neutral-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95">
                  <div className="text-neutral-300">{item[xKey]}</div>
                  <div>{label1}: {val1} {yKey2 ? `| ${label2}: ${val2}` : ''}</div>
                </div>
              )}

              <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full z-10">
                <div
                  className="w-full max-w-[20px] bg-neutral-900 hover:bg-neutral-800 rounded-t-md transition-all duration-300 shadow-sm"
                  style={{ height: `${Math.max(4, h1Percent)}%` }}
                ></div>

                {yKey2 && (
                  <div
                    className="w-full max-w-[20px] bg-brand-500 hover:bg-brand-600 rounded-t-md transition-all duration-300 shadow-sm"
                    style={{ height: `${Math.max(4, h2Percent)}%` }}
                  ></div>
                )}
              </div>

              <div className="mt-2 text-[10px] sm:text-xs font-semibold text-neutral-500 truncate max-w-[60px] text-center">
                {item[xKey]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;
