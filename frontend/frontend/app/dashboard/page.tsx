'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const GOALS = [
  { id: 1, color: '#6EE7B7', label: 'DSA Practice' },
  { id: 2, color: '#93C5FD', label: 'System Design' },
  { id: 3, color: '#FCA5A5', label: 'Mock Interview' },
  { id: 4, color: '#FDE68A', label: 'Behavioral Prep' },
];

const SESSIONS = [
  { id: 1, title: 'Mock Interview – DSA', role: 'Student', date: '2026-03-14', status: 'upcoming' },
  { id: 2, title: 'System Design Round', role: 'Interviewer', date: '2026-03-17', status: 'upcoming' },
  { id: 3, title: 'Behavioral Interview', role: 'Student', date: '2026-03-05', status: 'completed' },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function DashboardPage() {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [goalMap, setGoalMap] = useState<Record<string, number[]>>({}); // key: "YYYY-MM-DD" => goalId[]
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  function dateKey(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function isToday(d: number) {
    return calYear === today.getFullYear() && calMonth === today.getMonth() && d === today.getDate();
  }

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }

  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  function handleDayClick(d: number) {
    setSelectedDay(d);
    setShowGoalPicker(true);
  }

  function toggleGoal(goalId: number) {
    if (selectedDay === null) return;
    const key = dateKey(calYear, calMonth, selectedDay);
    setGoalMap(prev => {
      const current = prev[key] || [];
      const updated = current.includes(goalId)
        ? current.filter(g => g !== goalId)
        : [...current, goalId];
      return { ...prev, [key]: updated };
    });
  }

  function getGoalsForDay(d: number) {
    return goalMap[dateKey(calYear, calMonth, d)] || [];
  }

  const selectedKey = selectedDay ? dateKey(calYear, calMonth, selectedDay) : null;
  const selectedGoals = selectedKey ? (goalMap[selectedKey] || []) : [];

  // Count all goals set
  const totalGoalsSet = Object.values(goalMap).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1526 50%, #0a1020 100%)',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: '#e2e8f0',
      padding: '0',
    }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .stat-card:hover {
          border-color: rgba(110,231,183,0.3);
          transform: translateY(-2px);
        }

        .cal-day {
          aspect-ratio: 1;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: background 0.15s;
          position: relative;
          gap: 2px;
        }
        .cal-day:hover { background: rgba(255,255,255,0.08); }
        .cal-day.today {
          background: rgba(110,231,183,0.15);
          border: 1px solid rgba(110,231,183,0.5);
          color: #6EE7B7;
          font-weight: 700;
        }
        .cal-day.selected {
          background: rgba(147,197,253,0.15);
          border: 1px solid rgba(147,197,253,0.5);
        }
        .cal-day.has-goals { font-weight: 600; }

        .goal-dots {
          display: flex;
          gap: 2px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .goal-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .goal-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s;
          border: 1px solid transparent;
          font-size: 14px;
          font-weight: 500;
        }
        .goal-pill:hover { background: rgba(255,255,255,0.06); }
        .goal-pill.active { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); }

        .session-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 16px;
          transition: border-color 0.2s;
        }
        .session-card:hover { border-color: rgba(110,231,183,0.3); }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border: none;
          border-radius: 10px;
          color: white;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        .btn-ghost {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #cbd5e1;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); }

        .nav-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #cbd5e1;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.15s;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.12); }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 20px;
        }

        .modal {
          background: #131c2e;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px;
          padding: 28px;
          width: 100%;
          max-width: 360px;
        }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px' }}>

        {/* Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
              Interview <span style={{ color: '#6EE7B7' }}>Dashboard</span>
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0', fontFamily: "'DM Mono', monospace" }}>
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              {' · '}
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <Link href="/session/new" className="btn-primary" style={{ fontSize: 13 }}>
            + Create Session
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Sessions', value: '12', accent: '#6EE7B7', icon: '📋' },
            { label: 'Upcoming', value: '3', accent: '#93C5FD', icon: '🗓️' },
            { label: 'Completed', value: '7', accent: '#FCA5A5', icon: '✅' },
            { label: 'Goals Set', value: totalGoalsSet, accent: '#FDE68A', icon: '🎯' },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 700, margin: '8px 0 0', color: s.accent }}>{s.value}</h2>
            </div>
          ))}
        </div>

        {/* Main Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

          {/* Left: Sessions + Recent */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Sessions */}
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Sessions</h2>
                <span style={{ fontSize: 12, color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 20 }}>3 total</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {SESSIONS.map(s => (
                  <div key={s.id} className="session-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{s.title}</h3>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 20,
                        background: s.status === 'upcoming' ? 'rgba(110,231,183,0.12)' : 'rgba(100,116,139,0.2)',
                        color: s.status === 'upcoming' ? '#6EE7B7' : '#94a3b8',
                        whiteSpace: 'nowrap',
                        marginLeft: 8,
                      }}>{s.status}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px' }}>Role: {s.role}</p>
                    <p style={{ fontSize: 12, color: '#475569', margin: '0 0 12px', fontFamily: "'DM Mono', monospace" }}>{s.date}</p>
                    <a href={`/session/${s.id}`} style={{ fontSize: 12, color: '#93C5FD', textDecoration: 'none', fontWeight: 600 }}>
                      Join Session →
                    </a>
                  </div>
                ))}

                <div style={{
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#334155',
                  fontSize: 13,
                  minHeight: 100,
                }}>+ New session
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ padding: 22 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px' }}>Quick Actions</h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/session/new" className="btn-primary" style={{ fontSize: 13 }}>Start Interview</Link>
                <a href="/analytics" className="btn-ghost" style={{ fontSize: 13 }}>View Analytics</a>
                <a href="/profile" className="btn-ghost" style={{ fontSize: 13 }}>Profile Settings</a>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card" style={{ padding: 22 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px' }}>Recent Activity</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { icon: '✅', text: 'Completed DSA Interview', time: '2 days ago', color: '#6EE7B7' },
                  { icon: '📝', text: 'Created System Design Session', time: '4 days ago', color: '#93C5FD' },
                  { icon: '🎤', text: 'Joined Mock Coding Round', time: '1 week ago', color: '#FCA5A5' },
                ].map((a, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}>
                    <span style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                    }}>{a.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{a.text}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#475569', marginTop: 2 }}>{a.time}</p>
                    </div>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Calendar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ padding: 22 }}>
              {/* Calendar Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                  {MONTH_NAMES[calMonth]} <span style={{ color: '#64748b', fontWeight: 400 }}>{calYear}</span>
                </h2>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="nav-btn" onClick={prevMonth}>‹</button>
                  <button className="nav-btn" onClick={nextMonth}>›</button>
                </div>
              </div>

              {/* Day Labels */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
                {DAY_NAMES.map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#475569', fontWeight: 600, paddingBottom: 4 }}>{d}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {/* Empty cells */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`e${i}`} />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const goals = getGoalsForDay(d);
                  const isTod = isToday(d);
                  const isSel = selectedDay === d && showGoalPicker;

                  return (
                    <div
                      key={d}
                      className={`cal-day${isTod ? ' today' : ''}${isSel ? ' selected' : ''}${goals.length > 0 ? ' has-goals' : ''}`}
                      onClick={() => handleDayClick(d)}
                    >
                      <span>{d}</span>
                      {goals.length > 0 && (
                        <div className="goal-dots">
                          {goals.slice(0, 3).map(gid => {
                            const g = GOALS.find(x => x.id === gid);
                            return g ? <div key={gid} className="goal-dot" style={{ background: g.color }} /> : null;
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: 11, color: '#475569', margin: '0 0 10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Goal Types</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {GOALS.map(g => (
                    <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: g.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{g.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: 11, color: '#334155', textAlign: 'center', margin: '14px 0 0' }}>
                Click any day to set goals
              </p>
            </div>

            {/* Goals Summary */}
            {Object.keys(goalMap).length > 0 && (
              <div className="card" style={{ padding: 18 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#94a3b8' }}>Goals This Month</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {GOALS.map(g => {
                    const count = Object.values(goalMap).flat().filter(id => id === g.id).length;
                    if (!count) return null;
                    return (
                      <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: g.color }} />
                        <span style={{ flex: 1, fontSize: 13, color: '#cbd5e1' }}>{g.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: g.color, fontFamily: "'DM Mono', monospace" }}>×{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goal Picker Modal */}
      {showGoalPicker && selectedDay && (
        <div className="overlay" onClick={() => setShowGoalPicker(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Set Goals</h3>
                <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0', fontFamily: "'DM Mono', monospace" }}>
                  {MONTH_NAMES[calMonth]} {selectedDay}, {calYear}
                </p>
              </div>
              <button
                onClick={() => setShowGoalPicker(false)}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#94a3b8', width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}
              >×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {GOALS.map(g => {
                const active = selectedGoals.includes(g.id);
                return (
                  <div
                    key={g.id}
                    className={`goal-pill${active ? ' active' : ''}`}
                    onClick={() => toggleGoal(g.id)}
                  >
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: g.color,
                      boxShadow: active ? `0 0 8px ${g.color}88` : 'none',
                    }} />
                    <span style={{ flex: 1, color: active ? '#e2e8f0' : '#94a3b8' }}>{g.label}</span>
                    {active && <span style={{ fontSize: 14, color: g.color }}>✓</span>}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowGoalPicker(false)}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: 14 }}
            >
              Save Goals ({selectedGoals.length} selected)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}