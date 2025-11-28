"use client";

import { useState } from "react";
import {
  Play,
  Plus,
  Cpu,
  Trash2,
  RefreshCw,
  Clock,
  Zap,
  LayoutDashboard,
  Terminal,
  Activity,
  Server
} from "lucide-react";

// --- Types ---

interface Process {
  pid: string;
  arrival: number;
  burst: number;
}

interface TimelineBlock {
  type: "process" | "idle";
  pid?: string;
  start: number;
  end: number;
  duration: number;
}

interface ResultRow {
  pid: string;
  arrival: number;
  burst: number;
  completion: number;
  turnaround: number;
  waiting: number;
}

// --- Constants ---

// Neon/Cyber palette
const NEON_COLORS = [
  "border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]",
  "border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.5)]",
  "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]",
  "border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]",
  "border-indigo-500 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]",
  "border-rose-500 bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]",
];

const getNeonStyle = (pid: string) => {
  const num = parseInt(pid.replace(/\D/g, "")) || 0;
  return NEON_COLORS[(num - 1) % NEON_COLORS.length];
};

// --- Main Component ---

export default function FCFS_Scheduler() {
  const [processes, setProcesses] = useState<Process[]>([
    { pid: "P1", arrival: 0, burst: 4 },
    { pid: "P2", arrival: 1, burst: 3 },
    { pid: "P3", arrival: 2, burst: 1 },
  ]);
  const [results, setResults] = useState<ResultRow[] | null>(null);
  const [gantt, setGantt] = useState<TimelineBlock[]>([]);
  const [totalTime, setTotalTime] = useState(0);

  // --- Handlers ---

  const addProcess = () => {
    setProcesses((prev) => {
      const nextNum = prev.length > 0 
        ? Math.max(...prev.map(p => parseInt(p.pid.replace("P", "")) || 0)) + 1 
        : 1;
      return [...prev, { pid: `P${nextNum}`, arrival: 0, burst: 2 }];
    });
    if (results) clearResults(); 
  };

  const deleteProcess = (index: number) => {
    setProcesses((prev) => prev.filter((_, i) => i !== index));
    if (results) clearResults();
  };

  const updateProcess = (index: number, field: keyof Process, value: string) => {
    setProcesses((prev) => {
      const updated = [...prev];
      const nextVal = Math.max(0, parseInt(value) || 0);
      updated[index] = { ...updated[index], [field]: nextVal };
      return updated;
    });
    if (results) clearResults();
  };

  const clearResults = () => {
    setResults(null);
    setGantt([]);
    setTotalTime(0);
  };

  const resetAll = () => {
    setProcesses([]);
    clearResults();
  };

  const calculateFCFS = () => {
    if (processes.length === 0) return;

    const sortedProcesses = [...processes].sort((a, b) => {
      if (a.arrival === b.arrival) {
        return parseInt(a.pid.replace("P", "")) - parseInt(b.pid.replace("P", ""));
      }
      return a.arrival - b.arrival;
    });

    let currentTime = 0;
    const timeline: TimelineBlock[] = [];
    const resultRows: ResultRow[] = [];

    for (const p of sortedProcesses) {
      if (currentTime < p.arrival) {
        timeline.push({
          type: "idle",
          start: currentTime,
          end: p.arrival,
          duration: p.arrival - currentTime,
        });
        currentTime = p.arrival;
      }

      const start = currentTime;
      const end = start + p.burst;
      
      timeline.push({ type: "process", pid: p.pid, start, end, duration: p.burst });

      const completion = end;
      const turnaround = completion - p.arrival;
      const waiting = turnaround - p.burst;

      resultRows.push({
        pid: p.pid,
        arrival: p.arrival,
        burst: p.burst,
        completion,
        turnaround,
        waiting,
      });

      currentTime = end;
    }

    setTotalTime(currentTime);
    setGantt(timeline);
    setResults(resultRows);
  };

  // --- Stats ---
  const avgTurnaround = results 
    ? (results.reduce((acc, curr) => acc + curr.turnaround, 0) / results.length).toFixed(2) 
    : "0.00";

  const avgWaiting = results 
    ? (results.reduce((acc, curr) => acc + curr.waiting, 0) / results.length).toFixed(2) 
    : "0.00";

  const cpuUtilization = results && totalTime > 0
    ? ((results.reduce((acc, curr) => acc + curr.burst, 0) / totalTime) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono p-4 md:p-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Header Bar */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-sm flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Cpu className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">SYSTEM_SCHEDULER<span className="animate-pulse text-cyan-500">_</span></h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Core: FCFS Algorithm
              <span className="text-slate-700">|</span>
              v2.4.0
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
             <button 
                onClick={resetAll}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white border border-slate-800 hover:border-red-500 hover:bg-red-500/10 transition-all rounded-sm flex items-center gap-2"
              >
                <RefreshCw className="w-3 h-3" /> Reset System
              </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- LEFT PANEL: CONFIGURATION --- */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
            <div className="bg-slate-950/50 border-b border-slate-800 p-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" /> 
                Input_Stream
              </h2>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-sm">
                COUNT: {processes.length}
              </span>
            </div>

            <div className="p-4 space-y-4">
               {/* Table Header */}
               <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <div className="col-span-3">PID</div>
                  <div className="col-span-4">Arrival</div>
                  <div className="col-span-4">Burst</div>
                  <div className="col-span-1"></div>
               </div>

               {/* Process List */}
               <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {processes.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-slate-800 rounded-sm">
                      <Server className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                      <p className="text-xs text-slate-600">NO ACTIVE PROCESSES</p>
                    </div>
                  ) : (
                    processes.map((p, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-950 border border-slate-800 p-2 rounded-sm hover:border-slate-600 transition-colors group">
                        <div className="col-span-3">
                           <span className={`text-xs font-bold px-2 py-1 rounded-sm border ${getNeonStyle(p.pid)} bg-opacity-10`}>
                             {p.pid}
                           </span>
                        </div>
                        <div className="col-span-4">
                           <input 
                              type="number" 
                              min="0"
                              value={p.arrival}
                              onChange={(e) => updateProcess(i, "arrival", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs p-1 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 rounded-sm text-center font-mono"
                           />
                        </div>
                        <div className="col-span-4">
                           <input 
                              type="number" 
                              min="1"
                              value={p.burst}
                              onChange={(e) => updateProcess(i, "burst", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs p-1 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 rounded-sm text-center font-mono"
                           />
                        </div>
                        <div className="col-span-1 flex justify-end">
                            <button 
                              onClick={() => deleteProcess(i)}
                              className="text-slate-600 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                      </div>
                    ))
                  )}
               </div>

               {/* Action Buttons */}
               <div className="pt-4 grid grid-cols-2 gap-3">
                  <button 
                    onClick={addProcess}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-widest border border-slate-700 rounded-sm transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                  <button 
                    onClick={calculateFCFS}
                    disabled={processes.length === 0}
                    className="flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-widest border border-cyan-400 rounded-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <Play className="w-4 h-4 fill-current" /> Execute
                  </button>
               </div>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">System_Log // Guide</h3>
             <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                   <span className="text-cyan-500 font-bold">{">"}</span> Process execution order is strictly based on Arrival Time.
                </li>
                <li className="flex items-start gap-2">
                   <span className="text-cyan-500 font-bold">{">"}</span> CPU remains idle if queue is empty (see gaps in Gantt).
                </li>
                <li className="flex items-start gap-2">
                   <span className="text-cyan-500 font-bold">{">"}</span> Non-preemptive: Once started, a process runs to completion.
                </li>
             </ul>
          </div>
        </section>

        {/* --- RIGHT PANEL: VISUALIZATION --- */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* STATS MONITOR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Stat Card 1 */}
             <div className="bg-slate-900 border-l-2 border-slate-800 border-l-cyan-500 p-4 rounded-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Avg Turnaround</span>
                   <Clock className="w-4 h-4 text-cyan-500" />
                </div>
                <div className="text-2xl font-mono text-white">
                   {avgTurnaround}<span className="text-xs text-slate-600 ml-1">ms</span>
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-cyan-500/10 to-transparent"></div>
             </div>

             {/* Stat Card 2 */}
             <div className="bg-slate-900 border-l-2 border-slate-800 border-l-fuchsia-500 p-4 rounded-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Avg Waiting</span>
                   <Activity className="w-4 h-4 text-fuchsia-500" />
                </div>
                <div className="text-2xl font-mono text-white">
                   {avgWaiting}<span className="text-xs text-slate-600 ml-1">ms</span>
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-fuchsia-500/10 to-transparent"></div>
             </div>

             {/* Stat Card 3 */}
             <div className="bg-slate-900 border-l-2 border-slate-800 border-l-emerald-500 p-4 rounded-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">CPU Utilization</span>
                   <Zap className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-mono text-white">
                   {cpuUtilization}<span className="text-xs text-slate-600 ml-1">%</span>
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-emerald-500/10 to-transparent"></div>
             </div>
          </div>

          {/* GANTT VISUALIZER */}
          <div className="bg-slate-900 border border-slate-800 rounded-sm">
             <div className="bg-slate-950/50 border-b border-slate-800 p-4 flex items-center justify-between">
               <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
                 <LayoutDashboard className="w-4 h-4 text-indigo-500" /> 
                 Execution_Timeline
               </h2>
               {results && <span className="flex items-center gap-1 text-[10px] text-emerald-400 animate-pulse"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> LIVE</span>}
             </div>

             <div className="p-6 overflow-hidden">
                {!results ? (
                   <div className="h-24 flex items-center justify-center border border-dashed border-slate-800 bg-slate-950/30">
                      <span className="text-xs text-slate-600 uppercase tracking-widest">Awaiting Command Execution...</span>
                   </div>
                ) : (
                  <div className="relative">
                     {/* Timeline Track */}
                     <div className="flex h-12 w-full bg-slate-950 rounded-sm overflow-hidden border border-slate-800 relative">
                        {gantt.map((block, i) => {
                           const widthPercent = (block.duration / totalTime) * 100;
                           return (
                              <div 
                                 key={i}
                                 style={{ width: `${widthPercent}%` }}
                                 className={`h-full relative group transition-all duration-300 ${
                                    block.type === 'idle' 
                                    ? 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMGUxNzJhIi8+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlPSIjMzM0MTU1IiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+")] opacity-50' 
                                    : `border-r border-slate-900/50 hover:brightness-125 ${getNeonStyle(block.pid!).split(' ')[1]} ${getNeonStyle(block.pid!).split(' ')[0]}` // Extract bg and border classes
                                 }`}
                              >
                                 {block.type === 'process' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                       <span className="text-xs font-bold text-white drop-shadow-md truncate px-1">
                                          {widthPercent > 5 ? block.pid : ''}
                                       </span>
                                    </div>
                                 )}
                                 
                                 {/* Tooltip */}
                                 <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded border border-slate-700 whitespace-nowrap z-10">
                                    Start: {block.start} | End: {block.end}
                                 </div>
                              </div>
                           );
                        })}
                     </div>

                     {/* Time Axis */}
                     <div className="mt-2 w-full h-6 relative font-mono text-[10px] text-slate-500">
                        <span className="absolute left-0 -translate-x-1/2">0</span>
                        {gantt.map((block, i) => (
                           <span 
                              key={i} 
                              className="absolute -translate-x-1/2 transition-all duration-300"
                              style={{ left: `${(block.end / totalTime) * 100}%` }}
                           >
                              {block.end}
                           </span>
                        ))}
                     </div>
                  </div>
                )}
             </div>
          </div>

          {/* DETAILED LOGS */}
          {results && (
             <div className="bg-slate-900 border border-slate-800 rounded-sm">
                <div className="bg-slate-950/50 border-b border-slate-800 p-4">
                  <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest">
                     Metric_Analysis_Table
                  </h2>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-500 uppercase font-bold tracking-wider">
                         <tr>
                            <th className="px-4 py-3 border-b border-slate-800">Process_ID</th>
                            <th className="px-4 py-3 border-b border-slate-800 text-center text-slate-600">Arrival</th>
                            <th className="px-4 py-3 border-b border-slate-800 text-center text-slate-600">Burst</th>
                            <th className="px-4 py-3 border-b border-slate-800 text-right text-indigo-400">Completion</th>
                            <th className="px-4 py-3 border-b border-slate-800 text-right text-cyan-400">Turnaround</th>
                            <th className="px-4 py-3 border-b border-slate-800 text-right text-fuchsia-400">Waiting</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 font-mono">
                         {results.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                               <td className="px-4 py-3 text-white font-bold flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${getNeonStyle(r.pid).split(' ')[1].replace('/20', '')}`}></div>
                                  {r.pid}
                               </td>
                               <td className="px-4 py-3 text-center text-slate-400">{r.arrival}</td>
                               <td className="px-4 py-3 text-center text-slate-400">{r.burst}</td>
                               <td className="px-4 py-3 text-right text-indigo-300">{r.completion}</td>
                               <td className="px-4 py-3 text-right text-cyan-300">{r.turnaround}</td>
                               <td className="px-4 py-3 text-right text-fuchsia-300">{r.waiting}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

        </section>
      </main>
    </div>
  );
}