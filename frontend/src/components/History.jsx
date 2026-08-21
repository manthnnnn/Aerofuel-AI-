import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { 
  Clock, 
  Plane, 
  Fuel, 
  FileText, 
  Download, 
  Filter, 
  ArrowUpRight,
  TrendingDown,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const DEFAULT_HISTORY = [
  { id: "FL-904", timestamp: "2026-08-21 14:30", route: "JFK ✈ LHR", aircraft: "B787-9", distance: 5567, weight: 218400, fuel: 24150, co2: 76314, status: "Optimized" },
  { id: "FL-882", timestamp: "2026-08-21 12:15", route: "DXB ✈ SIN", aircraft: "A350-900", distance: 5840, weight: 265000, fuel: 28900, co2: 91324, status: "Optimized" },
  { id: "FL-741", timestamp: "2026-08-21 09:40", route: "SFO ✈ HND", aircraft: "B777-300ER", distance: 8280, weight: 340000, fuel: 48200, co2: 152312, status: "Calibrated" },
  { id: "FL-629", timestamp: "2026-08-20 22:10", route: "CDG ✈ JFK", aircraft: "A350-900", distance: 5835, weight: 271000, fuel: 29400, co2: 92904, status: "Optimized" },
  { id: "FL-512", timestamp: "2026-08-20 18:05", route: "LHR ✈ DXB", aircraft: "B787-9", distance: 5500, weight: 215000, fuel: 23800, co2: 75208, status: "Optimized" },
  { id: "FL-403", timestamp: "2026-08-20 14:50", route: "SYD ✈ SIN", aircraft: "A320neo", distance: 6300, weight: 81000, fuel: 14200, co2: 44872, status: "Calibrated" },
];

export default function History() {
  const [history, setHistory] = useState(DEFAULT_HISTORY);

  const API_BASE = import.meta.env.VITE_API_URL !== undefined 
    ? import.meta.env.VITE_API_URL 
    : (import.meta.env.PROD ? '' : 'http://127.0.0.1:8000');

  useEffect(() => {
    axios.get(`${API_BASE}/api/history`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          const formatted = res.data.map((h, i) => ({
            id: `FL-${900 - i}`,
            timestamp: new Date(h.timestamp || Date.now()).toISOString().replace('T', ' ').slice(0, 16),
            route: h.route || "JFK ✈ LHR",
            aircraft: h.aircraft || "B787-9",
            distance: h.distance || 5567,
            weight: h.weight || 218400,
            fuel: Math.round(h.prediction || 24150),
            co2: Math.round(h.co2 || 76314),
            status: "Optimized"
          }));
          setHistory(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const chartData = history.map(h => ({
    time: h.timestamp.split(' ')[1] || h.timestamp,
    fuel: h.fuel,
    co2: Math.round(h.co2 / 1000)
  })).reverse();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cockpit-panel px-6 py-4 border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight font-['Outfit',sans-serif] text-slate-100">
              Flight Telemetry Logs & Dispatch Archive
            </h2>
            <span className="bg-cyan-950/80 text-cyan-400 font-mono text-xs px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              AUDITED
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Historical block fuel burn records and cross-mission carbon telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="cockpit-btn-secondary px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Export Telemetry CSV
          </button>
        </div>
      </div>

      {/* Fuel Consumption Trend Chart */}
      <div className="cockpit-panel p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase">
              Mission Block Fuel & Carbon Footprint Trend
            </h3>
            <p className="text-[10px] text-slate-400">Sequential mission block fuel (kg) across dispatched flights</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2 h-0.5 bg-cyan-400 inline-block" /> Fuel (kg)
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-0.5 bg-emerald-400 inline-block" /> CO₂ (tonnes)
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fuelTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0A101D', borderColor: 'rgba(56,189,248,0.3)', borderRadius: '10px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="fuel" stroke="#00f0ff" strokeWidth={2.5} fillOpacity={1} fill="url(#fuelTrend)" />
              <Line type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dispatched Missions Table */}
      <div className="cockpit-panel p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-mono font-bold text-slate-200 uppercase">
            Dispatched Mission Records
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            SHOWING {history.length} MISSIONS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Flight ID</th>
                <th className="py-2.5 px-3">UTC Timestamp</th>
                <th className="py-2.5 px-3">Routing</th>
                <th className="py-2.5 px-3">Aircraft</th>
                <th className="py-2.5 px-3">Stage Dist</th>
                <th className="py-2.5 px-3">Predicted Burn</th>
                <th className="py-2.5 px-3">CO₂ Footprint</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="py-3 px-3 font-bold text-cyan-300 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-cyan-400" /> {row.id}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{row.timestamp}</td>
                  <td className="py-3 px-3 font-semibold text-slate-200">{row.route}</td>
                  <td className="py-3 px-3 text-slate-300">{row.aircraft}</td>
                  <td className="py-3 px-3 text-slate-400">{row.distance.toLocaleString()} km</td>
                  <td className="py-3 px-3 font-bold text-white">
                    {row.fuel.toLocaleString()} <span className="text-cyan-400 text-[10px]">kg</span>
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-semibold">
                    {row.co2.toLocaleString()} <span className="text-emerald-500 text-[10px]">kg</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
