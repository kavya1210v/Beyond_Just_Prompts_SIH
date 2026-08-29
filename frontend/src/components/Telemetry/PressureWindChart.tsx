import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrackPoint } from '../../types/cyclone';

interface PressureWindChartProps {
  track: TrackPoint[];
}

export const PressureWindChart: React.FC<PressureWindChartProps> = ({ track }) => {
  const data = track.map((pt) => ({
    time: pt.relative_time,
    wind: pt.wind_kts,
    windKmh: Math.round(pt.wind_kts * 1.852),
    pressure: pt.central_pressure_hpa,
    stage: pt.imd_name,
  }));

  return (
    <div className="w-full h-56 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="time"
            stroke="#64748b"
            tick={{ fontSize: 11, fontFamily: 'monospace' }}
          />
          {/* Left Y Axis: Wind Speed (kts) */}
          <YAxis
            yAxisId="left"
            stroke="#334155"
            tick={{ fontSize: 11, fontFamily: 'monospace' }}
            domain={[20, 110]}
            unit=" kt"
          />
          {/* Right Y Axis: Central Pressure (hPa) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#94a3b8"
            tick={{ fontSize: 11, fontFamily: 'monospace' }}
            domain={[950, 1010]}
            unit=" hPa"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderColor: '#cbd5e1',
              borderRadius: '0px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#0f172a',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', color: '#334155' }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="wind"
            name="Max Wind (kts)"
            stroke="#0f172a"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#0f172a' }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="pressure"
            name="Central Pressure (hPa)"
            stroke="#64748b"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#64748b' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
