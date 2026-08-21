import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Activity, 
  Clock, 
  Database, 
  Map, 
  ShieldCheck, 
  Radio, 
  Compass, 
  Cpu, 
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import History from './components/History';
import ModelAnalytics from './components/ModelAnalytics';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [zuluTime, setZuluTime] = useState('');
  
  const [flightData, setFlightData] = useState({
    distance: 5567,
    weight: 218400,
    engines: 2,
    thrust: 89500,
    speed: 948,
    altitude: 36500,
    isaTemp: -1.2,
    aircraftName: 'Boeing 787-9 Dreamliner'
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setZuluTime(now.toUTCString().split(' ').slice(4, 5)[0] + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 12, scale: 0.99 },
    in: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    out: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const applyPreset = (preset) => {
    if (preset === 'transatlantic') {
      setFlightData({
        distance: 5567,
        weight: 218400,
        engines: 2,
        thrust: 89500,
        speed: 948,
        altitude: 36500,
        isaTemp: -1.2,
        aircraftName: 'Boeing 787-9 Dreamliner'
      });
    } else if (preset === 'longhaul') {
      setFlightData({
        distance: 9850,
        weight: 280000,
        engines: 2,
        thrust: 97000,
        speed: 905,
        altitude: 38000,
        isaTemp: -2.4,
        aircraftName: 'Airbus A350-900 XWB'
      });
    } else if (preset === 'domestic') {
      setFlightData({
        distance: 1450,
        weight: 79000,
        engines: 2,
        thrust: 27100,
        speed: 830,
        altitude: 34000,
        isaTemp: +1.5,
        aircraftName: 'Airbus A320neo'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-slate-100 cyber-grid-bg flex flex-col font-['Inter',sans-serif]">
      {/* Top Cockpit Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0A101D]/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 lg:px-8 py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo & Telemetry Indicator */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  <div className="w-full h-full bg-[#070D1A] rounded-[11px] flex items-center justify-center">
                    <Plane className="w-5 h-5 text-cyan-400 -rotate-45" />
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A101D] animate-ping" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A101D]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-['Outfit',sans-serif] font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                    AeroFuel AI
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                    ENTERPRISE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Radio className="w-3 h-3 animate-pulse" /> TELEMETRY ACTIVE
                  </span>
                  <span>•</span>
                  <span>CATBOOST GBDT</span>
                </div>
              </div>
            </div>

            {/* Mobile Zulu Time */}
            <div className="md:hidden font-mono text-xs text-cyan-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              {zuluTime}
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center bg-[#0C1527]/90 p-1 rounded-xl border border-cyan-500/20 shadow-inner">
            <NavTab 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={<Activity className="w-4 h-4" />} 
              label="Dashboard" 
            />
            <NavTab 
              active={activeTab === 'map'} 
              onClick={() => setActiveTab('map')} 
              icon={<Map className="w-4 h-4" />} 
              label="Routes & Trajectory" 
            />
            <NavTab 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')} 
              icon={<Database className="w-4 h-4" />} 
              label="Model Analytics" 
            />
            <NavTab 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')} 
              icon={<Clock className="w-4 h-4" />} 
              label="Flight Logs" 
            />
          </nav>

          {/* Right Pilot Status & Flight Clock */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right font-mono">
              <div className="text-xs font-semibold text-cyan-300 tracking-wider flex items-center justify-end gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{zuluTime || '00:00:00 UTC'}</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">Global Dispatch Clock</div>
            </div>

            <div className="h-8 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-3 bg-[#0C1527] px-3 py-1.5 rounded-xl border border-cyan-500/20">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
                SC
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-200 leading-none">Capt. Sarah Chen</div>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Active Operator
                </div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Cockpit Display Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="in" exit="out">
              <Dashboard 
                flightData={flightData} 
                setFlightData={setFlightData} 
                showMap={false} 
                applyPreset={applyPreset}
              />
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div key="map" variants={pageVariants} initial="initial" animate="in" exit="out">
              <Dashboard 
                flightData={flightData} 
                setFlightData={setFlightData} 
                showMap={true} 
                applyPreset={applyPreset}
              />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" variants={pageVariants} initial="initial" animate="in" exit="out">
              <ModelAnalytics />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" variants={pageVariants} initial="initial" animate="in" exit="out">
              <History />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cockpit Status Bar Footer */}
      <footer className="bg-[#070D18]/90 border-t border-cyan-500/10 px-6 py-3 text-xs text-slate-400 font-mono flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" /> INFERENCE ENGINE: CATBOOST REGRESSOR
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">ACCURACY: R² 0.968</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-emerald-400">LATENCY: &lt; 10ms</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>AeroFuel AI v2.0 Enterprise</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400">Serverless Architecture</span>
        </div>
      </footer>
    </div>
  );
}

function NavTab({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-all duration-200 relative ${
        active 
          ? 'text-cyan-300 font-semibold bg-cyan-950/80 shadow-[0_0_12px_rgba(6,182,212,0.35)] border border-cyan-500/40' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && (
        <motion.div 
          layoutId="activePill"
          className="absolute inset-0 rounded-lg bg-cyan-400/10 pointer-events-none"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
}

export default App;
