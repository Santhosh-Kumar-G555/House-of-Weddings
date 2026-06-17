/* react-doctor-disable */
'use client';

import React from 'react';
// react-doctor-disable-next-line prefer-dynamic-import, react-doctor/prefer-dynamic-import
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

// Define the shape of the data
interface LineChartData {
  name: string;
  current: number;
  previous: number;
}

export function EngagementLineChart({ data }: { data: LineChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-outline-variant)' }}
          itemStyle={{ color: 'var(--color-on-surface)' }}
        />
        <Line type="monotone" dataKey="current" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="previous" stroke="var(--color-outline-variant)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MiniBarChart({ data, color = 'var(--color-primary)' }: { data: { value: number }[], color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={64}>
      <BarChart data={data}>
        <Tooltip cursor={{ fill: 'transparent' }} content={() => null} />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          {data.map((entry, index) => (
            // eslint-disable-next-line react-doctor/no-array-index-as-key
            <Cell key={`cell-${index}`} fill={color} fillOpacity={0.3 + (index * 0.1)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
