'use client';

import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

interface SessionPageProps {
  params: {
    id: string;
  };
}

type Role = 'Mentor' | 'Student';
type DrawingTool = 'pen' | 'eraser';

// Judge0 language IDs
const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
  cpp: 54,
  go: 60,
  rust: 73,
};

const DEFAULT_CODE: Record<string, string> = {
  javascript: '// JavaScript\nconsole.log("Hello, World!");',
  typescript: '// TypeScript\nconst msg: string = "Hello, World!";\nconsole.log(msg);',
  python: '# Python\nprint("Hello, World!")',
  java: '// Java\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
  cpp: '// C++\n#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}',
  go: '// Go\npackage main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello, World!")\n}',
  rust: '// Rust\nfn main() {\n  println!("Hello, World!");\n}',
};

// ─── Judge0 runner ────────────────────────────────────────────────────────────
// Sign up free at https://rapidapi.com/judge0-official/api/judge0-ce
// Add NEXT_PUBLIC_JUDGE0_KEY=<your_key> to your .env.local
const JUDGE0_HOST = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.NEXT_PUBLIC_JUDGE0_KEY ?? 'YOUR_RAPIDAPI_KEY';

async function runCode(
  sourceCode: string,
  languageId: number
): Promise<{ stdout: string; stderr: string; compile_output: string; status: string }> {
  const submitRes = await fetch(
    `${JUDGE0_HOST}/submissions?base64_encoded=false&wait=false`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({ source_code: sourceCode, language_id: languageId }),
    }
  );

  const { token } = await submitRes.json();
  if (!token) throw new Error('Submission failed. Check your NEXT_PUBLIC_JUDGE0_KEY in .env.local.');

  // Poll until execution completes (status id > 2 means done)
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const res = await fetch(
      `${JUDGE0_HOST}/submissions/${token}?base64_encoded=false`,
      {
        headers: {
          'X-RapidAPI-Key': JUDGE0_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );
    const data = await res.json();
    if (data.status?.id > 2) {
      return {
        stdout: data.stdout ?? '',
        stderr: data.stderr ?? '',
        compile_output: data.compile_output ?? '',
        status: data.status?.description ?? 'Unknown',
      };
    }
  }
  throw new Error('Execution timed out (15s).');
}
// ─────────────────────────────────────────────────────────────────────────────

const SessionPage = ({ params }: SessionPageProps) => {
  const [role, setRole] = useState<Role>('Student');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE['javascript']);

  // Run state
  const [output, setOutput] = useState<string | null>(null);
  const [outputType, setOutputType] = useState<'success' | 'error' | 'compile'>('success');
  const [running, setRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  // Whiteboard
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [penColor, setPenColor] = useState('#60a5fa');
  const [penSize, setPenSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput(null);
    setShowOutput(false);
  };

  const handleRun = async () => {
    setRunning(true);
    setShowOutput(true);
    setOutput('⏳ Running your code...');
    setOutputType('success');
    try {
      const result = await runCode(code, LANGUAGE_IDS[language]);
      if (result.compile_output) {
        setOutputType('compile');
        setOutput(result.compile_output.trim());
      } else if (result.stderr) {
        setOutputType('error');
        setOutput(result.stderr.trim());
      } else {
        setOutputType('success');
        setOutput(result.stdout.trim() || '(no output)');
      }
    } catch (err: unknown) {
      setOutputType('error');
      setOutput(err instanceof Error ? err.message : 'Unknown error occurred.');
    } finally {
      setRunning(false);
    }
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPos.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#0f172a' : penColor;
    ctx.lineWidth = tool === 'eraser' ? 24 : penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current!.getContext('2d')!;
    const canvas = canvasRef.current!;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const COLORS = ['#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb923c', '#ffffff'];
  const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust'];

  const outputBorderColor =
    outputType === 'success' ? 'border-emerald-500/50' :
    outputType === 'compile' ? 'border-yellow-500/50' :
    'border-red-500/50';

  const outputTextColor =
    outputType === 'success' ? 'text-emerald-300' :
    outputType === 'compile' ? 'text-yellow-300' :
    'text-red-300';

  const outputLabel =
    outputType === 'success' ? '✅ Output' :
    outputType === 'compile' ? '⚠️ Compile Error' :
    '❌ Runtime Error';

  return (
    <div
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      className="flex h-screen bg-slate-900 text-white overflow-hidden"
    >
      {/* ── LEFT: Code Editor ─────────────────────────────────── */}
      <div className="w-1/2 border-r border-slate-700 flex flex-col min-h-0">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 shrink-0">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Code Editor
          </span>
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-700 text-slate-200 text-xs rounded px-2 py-1 border border-slate-600 focus:outline-none focus:border-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            {/* ▶ Run button */}
            <button
              onClick={handleRun}
              disabled={running}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all duration-150
                ${running
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-md shadow-emerald-900/50'
                }`}
            >
              {running ? (
                <>
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Running…
                </>
              ) : (
                '▶ Run'
              )}
            </button>
          </div>
        </div>

        {/* Monaco Editor — shrinks when output is visible */}
        <div className={`min-h-0 transition-all duration-300 ${showOutput ? 'flex-[2]' : 'flex-1'}`}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(val) => setCode(val ?? '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              tabSize: 2,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
              cursorBlinking: 'expand',
              smoothScrolling: true,
              padding: { top: 16 },
            }}
          />
        </div>

        {/* Output Panel — slides in below editor */}
        {showOutput && (
          <div className={`flex-1 min-h-0 border-t-2 ${outputBorderColor} bg-[#090e1a] flex flex-col`}>
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-800 shrink-0">
              <span className={`text-xs font-semibold ${outputTextColor}`}>{outputLabel}</span>
              <button
                onClick={() => setShowOutput(false)}
                className="text-slate-500 hover:text-slate-200 text-xs transition-colors"
              >
                ✕ Close
              </button>
            </div>
            <pre
              className={`flex-1 overflow-auto px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${outputTextColor}`}
            >
              {output}
            </pre>
          </div>
        )}
      </div>

      {/* ── RIGHT: Whiteboard + Session Info ──────────────────── */}
      <div className="w-1/2 flex flex-col min-h-0">

        {/* Whiteboard Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 shrink-0">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Whiteboard</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setPenColor(c); setTool('pen'); }}
                  className="w-4 h-4 rounded-full border-2 transition-transform hover:scale-125"
                  style={{
                    backgroundColor: c,
                    borderColor: penColor === c && tool === 'pen' ? '#fff' : 'transparent',
                  }}
                />
              ))}
            </div>
            <input
              type="range" min={1} max={12} value={penSize}
              onChange={(e) => setPenSize(Number(e.target.value))}
              className="w-16 accent-blue-400"
            />
            <button
              onClick={() => setTool('pen')}
              className={`text-xs px-2 py-1 rounded ${tool === 'pen' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >✏️ Pen</button>
            <button
              onClick={() => setTool('eraser')}
              className={`text-xs px-2 py-1 rounded ${tool === 'eraser' ? 'bg-pink-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >🧹 Erase</button>
            <button
              onClick={clearCanvas}
              className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-red-700 hover:text-white transition-colors"
            >🗑️ Clear</button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative min-h-0">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair', display: 'block' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
          />
        </div>

        {/* Session Info */}
        <div className="px-4 py-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-4">
            <span>
              <span className="text-slate-500">Session ID:</span>{' '}
              <span className="text-blue-400 font-semibold tracking-wide">{params.id}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              <span className="text-slate-500">Role:</span>{' '}
              <span className={`font-semibold ${role === 'Mentor' ? 'text-emerald-400' : 'text-pink-400'}`}>
                {role}
              </span>
            </span>
          </div>
          <button
            onClick={() => setRole(role === 'Mentor' ? 'Student' : 'Mentor')}
            className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
          >
            Switch to {role === 'Mentor' ? 'Student' : 'Mentor'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
