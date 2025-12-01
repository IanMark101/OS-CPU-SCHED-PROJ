import React from 'react';
import { 
  Cpu, 
  ArrowRight, 
  Terminal,
  Activity,
  Menu // Added for potential mobile menu expansion if needed later
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-mono text-slate-300 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      
      {/* Navbar / Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Logo Icon */}
            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 border border-slate-700 rounded-sm flex items-center justify-center relative overflow-hidden group flex-shrink-0">
               <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Cpu className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-bold tracking-wider text-white truncate">
                OS_SIMULATOR<span className="animate-pulse text-cyan-500">_</span>
              </span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-slate-500 hidden sm:block">
                System Version 2.4.0
              </span>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-full border border-slate-800/50 md:bg-transparent md:border-0 md:p-0">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-500 whitespace-nowrap">
              <span className="hidden sm:inline">System </span>Online
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 relative">
        
        {/* Background Grid Decoration - Scaled for mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-10 left-10 w-48 h-48 md:w-64 md:h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 md:w-64 md:h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-slate-900 border border-slate-800 text-[10px] uppercase tracking-widest text-cyan-400 mb-6 shadow-sm shadow-cyan-900/20">
            <Terminal className="w-3 h-3" />
            <span>Root Access Granted</span>
          </div>
          
          {/* Heading - Responsive text sizing */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight break-words">
            CPU_SCHEDULING<br className="hidden xs:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 block mt-1 md:mt-0 md:inline">
              VISUALIZATION_PROTOCOL
            </span>
          </h1>
          
          {/* Description - Interactive Elements Added */}
          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto text-center">
            Interactive system module for <span className="text-slate-400 hover:text-cyan-400 cursor-help transition-colors border-b border-dotted border-slate-700 hover:border-cyan-500">analyzing</span> scheduling algorithms. 
            <span className="text-slate-400 hover:text-cyan-400 cursor-help transition-colors border-b border-dotted border-slate-700 hover:border-cyan-500 ml-1">Visualize</span> process execution, <span className="text-slate-400 hover:text-cyan-400 cursor-help transition-colors border-b border-dotted border-slate-700 hover:border-cyan-500">latency</span>, and <span className="text-slate-400 hover:text-cyan-400 cursor-help transition-colors border-b border-dotted border-slate-700 hover:border-cyan-500">CPU utilization</span> in real-time.
          </p>
        </div>

        {/* Tools Grid - Centered FCFS Card */}
        <div className="flex justify-center relative z-10 w-full">
          
          {/* FCFS Card */}
          <a href="/fcfs" className="w-full max-w-md group relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-sm p-5 md:p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden active:scale-[0.98]">
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
               <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-950 border border-slate-800 group-hover:border-cyan-500/30 rounded-sm flex items-center justify-center transition-colors">
                  <Activity className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
               </div>
               <div className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-sm text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors">
                  Algorithm 01
               </div>
            </div>
            
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              FCFS_SCHEDULER
            </h3>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed">
              First-Come, First-Served. Non-preemptive execution based on arrival timestamp.
            </p>
            
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-cyan-400 transition-all gap-2">
               <span>Initialize_Module</span>
               <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Corner Decor */}
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-slate-700 group-hover:border-cyan-500 transition-colors"></div>
          </a>

        </div>
      </main>
    </div>
  );
}