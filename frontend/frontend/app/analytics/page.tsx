'use client';

import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

// ── Data ────────────────────────────────────────────────────────────────────

const sessionsByMonth = [
  { month: "Nov", sessions: 2 },
  { month: "Dec", sessions: 4 },
  { month: "Jan", sessions: 3 },
  { month: "Feb", sessions: 6 },
  { month: "Mar", sessions: 5 },
  { month: "Apr", sessions: 7 },
];

const performanceOverTime = [
  { week: "W1", score: 52 },
  { week: "W2", score: 61 },
  { week: "W3", score: 58 },
  { week: "W4", score: 70 },
  { week: "W5", score: 74 },
  { week: "W6", score: 80 },
  { week: "W7", score: 78 },
  { week: "W8", score: 87 },
];

const radarData = [
  { skill: "DSA", value: 82 },
  { skill: "System Design", value: 65 },
  { skill: "Behavioral", value: 74 },
  { skill: "Communication", value: 88 },
  { skill: "Problem Solving", value: 71 },
  { skill: "Code Quality", value: 79 },
];

const recentSessions = [
  { title: "Mock Interview – DSA", role: "Student", date: "2026-03-14", result: "Strong Hire", score: 91, tag: "upcoming" },
  { title: "System Design Round", role: "Interviewer", date: "2026-03-17", result: "Hire", score: 76, tag: "upcoming" },
  { title: "Behavioral Interview", role: "Student", date: "2026-03-05", result: "No Hire", score: 48, tag: "completed" },
  { title: "Mock Coding Round", role: "Student", date: "2026-02-28", result: "Hire", score: 83, tag: "completed" },
];

const goalProgress = [
  { label: "DSA Practice", color: "#4ade80", done: 8, total: 10 },
  { label: "System Design", color: "#38bdf8", done: 3, total: 8 },
  { label: "Mock Interview", color: "#facc15", done: 5, total: 6 },
  { label: "Behavioral Prep", color: "#f97316", done: 2, total: 5 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 80) return "#4ade80";
  if (score >= 65) return "#facc15";
  return "#f87171";
}

function resultBadge(result: string) {
  if (result === "Strong Hire") return "bg-emerald-500/20 text-emerald-400";
  if (result === "Hire") return "bg-sky-500/20 text-sky-400";
  return "bg-red-500/20 text-red-400";
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 shadow-lg">
      <p className="mb-1 font-medium text-slate-400">{label}</p>
      <p>{payload[0].value}{payload[0].name === "score" ? "%" : " sessions"}</p>
    </div>
  );
};

// ── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent,
}: { label: string; value: string | number; sub?: string; accent: string }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/80 p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

// ── Range Tab ────────────────────────────────────────────────────────────────

function RangeTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 rounded-lg border border-slate-700 bg-slate-800/60 p-1 text-xs">
      {["1M", "3M", "6M", "All"].map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`rounded-md px-3 py-1 font-medium transition ${
            value === r
              ? "bg-teal-500/20 text-teal-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange] = useState("6M");

  return (
    <div className="min-h-screen bg-[#0f1117] p-6 text-white">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-white">Interview</span>{" "}
            <span className="text-teal-400">Analytics</span>
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Your performance overview across all sessions
          </p>
        </div>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Sessions" value={12} sub="+3 this month" accent="text-teal-400" />
        <StatCard label="Avg. Score" value="78%" sub="↑ 6% vs last month" accent="text-sky-400" />
        <StatCard label="Completion Rate" value="83%" sub="10 of 12 completed" accent="text-emerald-400" />
        <StatCard label="Goals Met" value="3 / 4" sub="75% goal completion" accent="text-yellow-400" />
      </div>

      {/* Charts row */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">

        {/* Sessions per month */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/80 p-5 lg:col-span-2">
          <p className="mb-4 text-sm font-semibold text-slate-300">Sessions per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sessionsByMonth} barCategoryGap="35%">
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} width={24} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="sessions" radius={[6, 6, 0, 0]}>
                {sessionsByMonth.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === sessionsByMonth.length - 1 ? "#2dd4bf" : "#1e3a4a"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill radar */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/80 p-5">
          <p className="mb-4 text-sm font-semibold text-slate-300">Skill breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 10 }} />
              <Radar dataKey="value" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance trend + goal progress */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">

        {/* Performance line chart */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/80 p-5 lg:col-span-2">
          <p className="mb-4 text-sm font-semibold text-slate-300">Performance trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={performanceOverTime}>
              <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2dd4bf"
                strokeWidth={2}
                dot={{ r: 3, fill: "#2dd4bf", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Goal progress */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/80 p-5">
          <p className="mb-4 text-sm font-semibold text-slate-300">Goal progress</p>
          <div className="flex flex-col gap-4">
            {goalProgress.map((g) => (
              <div key={g.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{g.label}</span>
                  <span className="font-medium" style={{ color: g.color }}>
                    {g.done}/{g.total}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.round((g.done / g.total) * 100)}%`, background: g.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent sessions table */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/80 p-5">
        <p className="mb-4 text-sm font-semibold text-slate-300">Recent sessions</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-xs uppercase tracking-widest text-slate-500">
                <th className="pb-3 text-left font-medium">Session</th>
                <th className="pb-3 text-left font-medium">Role</th>
                <th className="pb-3 text-left font-medium">Date</th>
                <th className="pb-3 text-left font-medium">Result</th>
                <th className="pb-3 text-right font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((s) => (
                <tr key={s.title} className="border-b border-slate-700/40 last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-200">{s.title}</td>
                  <td className="py-3 pr-4 text-slate-400">{s.role}</td>
                  <td className="py-3 pr-4 text-slate-500">{s.date}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${resultBadge(s.result)}`}>
                      {s.result}
                    </span>
                  </td>
                  <td className="py-3 text-right font-bold" style={{ color: scoreColor(s.score) }}>
                    {s.score}%
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