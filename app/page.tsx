import { 
  Cpu, 
  ArrowRight, 
  Timer
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-800">
      
      {/* Navbar / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              OS <span className="text-indigo-600">Simulators</span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            CPU Scheduling <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Visualized & Simplified
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Interactive tool to understand the Round Robin scheduling algorithm with real-time Gantt charts and analytics.
          </p>
        </div>

        {/* Tools Grid - Centered for single item */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {/* Round Robin Card (Active) */}
            <a href="/rr" className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Timer className="w-24 h-24 text-indigo-600 -rotate-12 transform translate-x-4 -translate-y-4" />
              </div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                  <Timer className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  Round Robin
                </h3>
                <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                  Preemptive scheduling algorithm where each process is assigned a fixed time slice (quantum) in cyclic order.
                </p>
                
                <div className="flex items-center text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                  Launch Simulator <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}