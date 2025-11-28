import { 
  Cpu, 
  ArrowRight, 
  Terminal,
  Activity,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-mono text-slate-300 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Navbar / Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-sm flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-wider text-white">
                OS_SIMULATOR<span className="animate-pulse text-cyan-500">_</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">
                System Version 2.4.0
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">System Online</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 relative">
        
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center mb-20 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-slate-900 border border-slate-800 text-[10px] uppercase tracking-widest text-cyan-400 mb-6">
            <Terminal className="w-3 h-3" />
            <span>Root Access Granted</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
            CPU_SCHEDULING<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
              VISUALIZATION_PROTOCOL
            </span>
          </h1>
          
          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto border-l-2 border-slate-800 pl-4 text-left md:text-center md:border-l-0 md:pl-0">
            Interactive system module for analyzing scheduling algorithms. 
            Visualize process execution, latency, and CPU utilization in real-time.
          </p>
        </div>

        {/* Tools Grid - Centered FCFS Card */}
        <div className="flex justify-center relative z-10">
          
          {/* FCFS Card */}
          <a href="/fcfs" className="w-full max-w-md group relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-sm p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden">
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 bg-slate-950 border border-slate-800 group-hover:border-cyan-500/30 rounded-sm flex items-center justify-center transition-colors">
                  <Activity className="w-6 h-6 text-cyan-500" />
               </div>
               <div className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-sm text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors">
                  Algorithm 01
               </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
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