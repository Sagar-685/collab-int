'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <Link
          href="/session/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
        >
          Create Session
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total Sessions</p>
          <h2 className="mt-2 text-2xl font-bold">12</h2>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Upcoming</p>
          <h2 className="mt-2 text-2xl font-bold">3</h2>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Completed</p>
          <h2 className="mt-2 text-2xl font-bold">7</h2>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Active Users</p>
          <h2 className="mt-2 text-2xl font-bold">24</h2>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Sessions */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Sessions</h2>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <h3 className="mb-2 text-lg font-semibold">
                Mock Interview – DSA
              </h3>

              <p className="mb-4 text-sm text-slate-400">
                Role: Student
              </p>

              <Link
                href="/session/123"
                className="text-sm font-medium text-blue-400 hover:underline"
              >
                Join Session →
              </Link>
            </div>

            <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-800 p-4 text-slate-400">
              More sessions will appear here
            </div>

          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>

            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/session/new"
                className="rounded-lg bg-blue-600 px-3 py-2 text-center hover:bg-blue-700"
              >
                Start Interview
              </Link>

              <Link
                href="/analytics"
                className="rounded-lg bg-slate-700 px-3 py-2 text-center hover:bg-slate-600"
              >
                View Analytics
              </Link>

              <Link
                href="/profile"
                className="rounded-lg bg-slate-700 px-3 py-2 text-center hover:bg-slate-600"
              >
                Profile Settings
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <h2 className="mb-3 text-lg font-semibold">Recent Activity</h2>

            <ul className="space-y-2 text-sm text-slate-400">
              <li>Completed DSA Interview</li>
              <li>Created System Design Session</li>
              <li>Joined Mock Coding Round</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}