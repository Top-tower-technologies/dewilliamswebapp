// components/dashboard/.jsx
export function OccupancyChart() {
    return (
      <svg className="w-full h-full" viewBox="0 0 400 240">
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>
        <path 
          d="M0 200 L20 180 L40 190 L60 150 L80 140 L100 80 L120 90 L140 60 L160 70 L180 50 L200 60 L220 40 L240 35 L260 50 L280 30 L300 25 L320 20 L340 35 L360 25 L380 20 L400 10 L400 200 L0 200 Z" 
          fill="url(#chart-gradient)" 
          strokeWidth="2"
          stroke="#3b82f6"
        />
        <path 
          d="M0 200 L20 180 L40 190 L60 150 L80 140 L100 80 L120 90 L140 60 L160 70 L180 50 L200 60 L220 40 L240 35 L260 50 L280 30 L300 25 L320 20 L340 35 L360 25 L380 20 L400 10" 
          fill="none" 
          strokeWidth="2"
          stroke="#3b82f6"
        />
      </svg>
    );
  }
  
  