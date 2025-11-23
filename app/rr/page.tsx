"use client";

import { useState } from "react";
import { 
  Play, 
  Plus, 
  Cpu, 
  Clock, 
  BarChart3, 
  ListOrdered, 
  Timer, 
  ArrowRight,
  Trash2
} from "lucide-react";

interface Process {
  pid: string;
  arrival: number;
  burst: number;
}

interface ProcessRuntime extends Process {
  rem: number;
}

interface TimelineBlock {
  pid: string;
  start: number;
  end: number;
}

interface ReadyQueueEntry {
  time: number;
  queue: string[];
}

interface ResultRow {
  pid: string;
  arrival: number;
  burst: number;
  completion: number;
  turnaround: number;
  waiting: number;
}

const COLORS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", 
  "bg-pink-500", "bg-cyan-500", "bg-yellow-500", "bg-red-500",
  "bg-indigo-500", "bg-teal-500", "bg-lime-500", "bg-fuchsia-500"
];

const getProcessColor = (pid: string) => {
  const num = parseInt(pid.replace(/\D/g, '')) || 0;
  return COLORS[(num - 1) % COLORS.length] || "bg-slate-500";
};

export default function RoundRobin() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [quantum, setQuantum] = useState<string>("");

  const [results, setResults] = useState<ResultRow[] | null>(null);
  const [gantt, setGantt] = useState<TimelineBlock[]>([]);
  const [readyQueue, setReadyQueue] = useState<ReadyQueueEntry[]>([]);

  const addProcess = () => {
    setProcesses((prev) => [
      ...prev,
      {
        pid: `P${prev.length + 1}`,
        arrival: 0,
        burst: 1,
      },
    ]);
  };

  const deleteProcess = (indexToRemove: number) => {
    setProcesses((prev) => prev.filter((_, index) => index !== indexToRemove));
    // Clear results if processes change to avoid inconsistencies
    setResults(null);
    setGantt([]);
    setReadyQueue([]);
  };

  const updateProcess = (index: number, field: keyof Process, value: string) => {
    setProcesses((prev) => {
      const updated = [...prev];
      const nextVal = Number(value);
      updated[index] = {
        ...updated[index],
        [field]: isNaN(nextVal) ? 0 : nextVal,
      } as Process;
      return updated;
    });
  };

  const calculateRR = () => {
    if (processes.length === 0) return;
    const q = Number(quantum);
    if (!q || q <= 0) return;

    const plist: ProcessRuntime[] = processes
      .map((p) => ({ ...p, rem: p.burst }))
      .sort((a, b) => a.arrival - b.arrival);

    const timeline: TimelineBlock[] = [];
    const ready: ReadyQueueEntry[] = [];

    let time = plist[0].arrival;
    const queue: ProcessRuntime[] = [];
    const completed: Record<string, number> = {};

    while (true) {
      // Add newly arrived processes
      plist.forEach((p) => {
        if (p.arrival <= time && p.rem > 0 && !queue.includes(p)) {
          queue.push(p);
        }
      });

      if (queue.length === 0) {
        const pending = plist.find((p) => p.rem > 0);
        if (!pending) break;
        time = pending.arrival;
        continue;
      }

      // Snapshot ready queue **before CPU slice**
      ready.push({
        time,
        queue: queue.map((p) => p.pid),
      });

      const p = queue.shift()!;
      const exec = Math.min(p.rem, q);

      timeline.push({
        pid: p.pid,
        start: time,
        end: time + exec,
      });

      time += exec;
      p.rem -= exec;

      // Add new arrivals **after execution**
      plist.forEach((px) => {
        if (px.arrival <= time && px.rem > 0 && !queue.includes(px) && px !== p) {
          queue.push(px);
        }
      });

      if (p.rem > 0) queue.push(p); // Requeue if not finished
      else completed[p.pid] = time;
    }

    const resultsTable: ResultRow[] = processes.map((p) => {
      const completion = completed[p.pid] ?? time;
      const turnaround = completion - p.arrival;
      const waiting = turnaround - p.burst;

      return {
        pid: p.pid,
        arrival: p.arrival,
        burst: p.burst,
        completion,
        turnaround,
        waiting,
      };
    });

    setResults(resultsTable);
    setGantt(timeline);
    setReadyQueue(ready);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-800 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-md shadow-indigo-200">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Round Robin <span className="text-indigo-600">Scheduler</span>
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        
        {/* Controls & Configuration Card */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-slate-500" />
                Process Configuration
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Define your processes and time quantum below.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Timer className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                 </div>
                 <input
                  type="number"
                  placeholder="Quantum"
                  value={quantum}
                  onChange={(e) => setQuantum(e.target.value)}
                  className="pl-9 pr-4 py-2 w-32 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
               </div>
              
              <button
                onClick={calculateRR}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-lg shadow-sm shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!quantum || processes.length === 0}
              >
                <Play className="w-4 h-4 fill-current" />
                Simulate
              </button>
            </div>
          </div>

          <div className="p-6 bg-slate-50/50">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Process ID</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Arrival Time</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Burst Time</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-sm">
                        No processes added yet. Click "Add Process" to begin.
                      </td>
                    </tr>
                  ) : (
                    processes.map((p, i) => (
                      <tr key={i} className="group hover:bg-indigo-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
                            {p.pid}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={p.arrival}
                            onChange={(e) => updateProcess(i, "arrival", e.target.value)}
                            className="block w-full max-w-[100px] px-3 py-1.5 text-sm rounded border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={p.burst}
                            onChange={(e) => updateProcess(i, "burst", e.target.value)}
                            className="block w-full max-w-[100px] px-3 py-1.5 text-sm rounded border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button 
                            onClick={() => deleteProcess(i)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Process"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <button
              onClick={addProcess}
              className="mt-4 w-full border-2 border-dashed border-slate-300 rounded-lg p-3 text-slate-500 font-medium hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Process
            </button>
          </div>
        </section>

        {/* Results Section */}
        {results && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Gantt Chart Card */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                    Execution Timeline (Gantt Chart)
                  </h2>
                 
                 <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
                    <div className="flex items-start min-w-max h-24 pt-4 px-6">
                      {gantt.map((g, i) => {
                         // Scale Factor: 40px per time unit
                         const width = Math.max((g.end - g.start) * 40, 2); 
                         return (
                          <div key={i} style={{ width: `${width}px` }} className="flex flex-col relative group">
                            {/* The Process Bar */}
                            <div 
                              className={`h-12 ${getProcessColor(g.pid)} border-r border-white/20 text-white font-bold flex items-center justify-center shadow-sm relative first:rounded-l-md last:rounded-r-md hover:brightness-110 transition-all cursor-default`}
                            >
                              <span className="text-sm drop-shadow-md truncate px-1 select-none">
                                {width > 35 ? g.pid : ''}
                              </span>
                              
                              {/* Hover Tooltip */}
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-lg transition-opacity whitespace-nowrap pointer-events-none z-20">
                                {g.pid}: Time {g.start} - {g.end}
                              </div>
                            </div>

                            {/* Timeline Ruler Tick (Start) */}
                            <div className="absolute top-12 left-0 -translate-x-1/2 flex flex-col items-center z-10">
                               <div className="h-2 w-px bg-slate-300"></div>
                               <span className="text-xs text-slate-600 font-medium mt-0.5 select-none">{g.start}</span>
                            </div>

                            {/* Timeline Ruler Tick (End - Only for last item) */}
                            {i === gantt.length - 1 && (
                               <div className="absolute top-12 right-0 translate-x-1/2 flex flex-col items-center z-10">
                                  <div className="h-2 w-px bg-slate-300"></div>
                                  <span className="text-xs text-slate-600 font-medium mt-0.5 select-none">{g.end}</span>
                               </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                 </div>

                 {/* Legend */}
                 <div className="mt-2 flex flex-wrap gap-4 border-t border-slate-100 pt-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Legend:</span>
                    {Array.from(new Set(gantt.map(g => g.pid))).sort().map(pid => (
                       <div key={pid} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getProcessColor(pid)} shadow-sm`}></div>
                          <span className="text-sm text-slate-600 font-medium">{pid}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Ready Queue Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  Ready Queue Log
                </h2>
                <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar space-y-3">
                  {readyQueue.map((rq, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-50/80 transition-colors">
                      <div className="bg-slate-200 text-slate-600 text-xs font-mono py-1 px-2 rounded min-w-[3rem] text-center">
                        t={rq.time}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center flex-1">
                        {rq.queue.length > 0 ? (
                          rq.queue.map((pid, idx) => (
                            <div key={`${pid}-${idx}`} className="flex items-center">
                               <span className={`border ${getProcessColor(pid).replace('bg-', 'border-').replace('500', '200')} ${getProcessColor(pid).replace('bg-', 'text-').replace('500', '700')} bg-white text-xs font-bold px-2 py-1 rounded shadow-sm`}>
                                {pid}
                              </span>
                              {idx < rq.queue.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-slate-300 ml-2" />
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">Queue Empty</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

               {/* Metrics Table Card */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <ListOrdered className="w-5 h-5 text-orange-500" />
                    Performance Metrics
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">PID</th>
                          <th className="px-4 py-3 text-right">Comp.</th>
                          <th className="px-4 py-3 text-right">Turn.</th>
                          <th className="px-4 py-3 rounded-r-lg text-right">Wait</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {results.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getProcessColor(r.pid)}`}></div>
                              {r.pid}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-600">{r.completion}</td>
                            <td className="px-4 py-3 text-right text-slate-600">{r.turnaround}</td>
                            <td className="px-4 py-3 text-right font-medium text-indigo-600">{r.waiting}</td>
                          </tr>
                        ))}
                         {/* Averages Row */}
                         <tr className="bg-indigo-50/50 font-semibold border-t border-indigo-100">
                            <td className="px-4 py-3 text-indigo-900">Average</td>
                            <td className="px-4 py-3"></td>
                            <td className="px-4 py-3 text-right text-indigo-900">
                              {(results.reduce((acc, curr) => acc + curr.turnaround, 0) / results.length).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right text-indigo-900">
                              {(results.reduce((acc, curr) => acc + curr.waiting, 0) / results.length).toFixed(2)}
                            </td>
                         </tr>
                      </tbody>
                    </table>
                  </div>
               </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}