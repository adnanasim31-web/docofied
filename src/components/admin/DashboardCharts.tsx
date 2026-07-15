"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export function TrafficChart({ data }: { data: { date: string; views: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#E2ECE7" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#4d5c59" }} axisLine={{ stroke: "#E2ECE7" }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#4d5c59" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #E2ECE7", fontSize: 13 }}
          labelStyle={{ color: "#1E2A28", fontWeight: 600 }}
        />
        <Line type="monotone" dataKey="views" stroke="#3DBE6B" strokeWidth={2.5} dot={false} name="Page views" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SpecialtyChart({ data }: { data: { specialty: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid stroke="#E2ECE7" strokeDasharray="4 4" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: "#4d5c59" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="specialty"
          width={150}
          tick={{ fontSize: 12, fill: "#1E2A28" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #E2ECE7", fontSize: 13 }}
          cursor={{ fill: "#E8F5EC" }}
        />
        <Bar dataKey="count" fill="#3DBE6B" radius={[0, 6, 6, 0]} name="Providers" />
      </BarChart>
    </ResponsiveContainer>
  );
}
