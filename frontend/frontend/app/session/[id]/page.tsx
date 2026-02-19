'use client';

import React from 'react';

interface SessionPageProps {
  params: {
    id: string;
  };
}

const SessionPage = ({ params }: SessionPageProps) => {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      
      {/* LEFT: Code Editor Section */}
      <div className="w-1/2 border-r border-slate-700 p-4">
        <h2 className="mb-2 text-lg font-semibold">
          Code Editor
        </h2>

        <div className="flex h-[85vh] items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-800">
          <p className="text-slate-400">
            Editor will be integrated here
          </p>
        </div>
      </div>

      {/* RIGHT: Whiteboard + Controls */}
      <div className="w-1/2 p-4">
        <h2 className="mb-2 text-lg font-semibold">
          Whiteboard
        </h2>

        <div className="flex h-[70vh] items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-800">
          <p className="text-slate-400">
            Whiteboard will be integrated here
          </p>
        </div>

        {/* Session Info */}
        <div className="mt-4 rounded-lg bg-slate-800 p-3 text-sm text-slate-300">
          <p>
            <span className="font-semibold">Session ID:</span> {params.id}
          </p>
          <p>
            <span className="font-semibold">Role:</span> Mentor / Student
          </p>
        </div>
      </div>

    </div>
  );
};

export default SessionPage;
