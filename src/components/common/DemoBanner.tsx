import React, { useState } from 'react';
import { AlertCircle, X, Sparkles } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-forest-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-forest-800 relative z-30">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] border border-emerald-500/40">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Interactive Demo Mode
          </span>
          <p className="text-forest-100 hidden sm:inline">
            Demonstrating AirQuant platform capabilities. Readings are simulated local Indian test values for product presentation.
          </p>
          <p className="text-forest-100 sm:hidden">
            Simulated Indian AQI test demo data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-forest-300 font-mono hidden md:inline">
            CPCB NAQI Standard (National Air Quality Index)
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-forest-300 hover:text-white p-0.5 rounded transition-colors"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

