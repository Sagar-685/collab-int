'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <Link
          href="/session/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
        >
          Create Session
        </Link>
      </div>

      {/* Sessions List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Session Card */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <h2 className="mb-2 text-lg font-semibold">
            Mock Interview – DSA
          </h2>

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

        {/* Placeholder */}
        <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-800 p-4 text-slate-400">
          More sessions will appear here
        </div>

      </div>
    </div>
  );
}
