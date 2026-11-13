import React from 'react';
import { 
  Wind, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Award, 
  HeartHandshake, 
  CheckCircle2, 
  Info,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Brand Header & Hero Card */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-charcoal-200/80 shadow-premium relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-premium">
              <Wind className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-forest-800">
                AirQuant
              </h1>
              <p className="text-xs font-bold text-charcoal-400 uppercase tracking-widest">
                Understand Air. Predict Tomorrow.
              </p>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight mb-4">
            Next-Generation Atmospheric Intelligence for India
          </h2>

          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-normal mb-6">
            AirQuant is an intelligent platform specifically engineered to monitor real-time air quality, explore longitudinal pollution trends, and predict future AQI trajectories across Indian metropolitan centers using modern machine learning regressors.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold bg-forest-50 text-forest-800 border border-forest-200 px-3 py-1.5 rounded-full">
              CPCB NAQI 2014 Framework
            </span>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full">
              XGBoost / Gradient Boost ML
            </span>
            <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full">
              Demo Edition for Evaluation
            </span>
          </div>
        </div>
      </div>

      {/* Brand Personality & Core Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-charcoal-900 mb-2">
            Trustworthy &amp; Scientific
          </h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Strictly anchored in the official Central Pollution Control Board (CPCB) sub-index calculation guidelines and verified criteria pollutants (PM2.5, PM10, NO2, SO2, CO, O3).
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-charcoal-900 mb-2">
            Intelligent &amp; Predictive
          </h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Transitioning environmental protection from passive monitoring to active multi-horizon foresight using machine learning models trained on seasonal inversion cycles.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-charcoal-900 mb-2">
            Environmentally Responsible
          </h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Empowering citizens, medical practitioners, schools, and city planners to make every breath an informed decision with contextual health guidance.
          </p>
        </div>
      </div>

      {/* Architectural Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-200/80 shadow-subtle space-y-6">
        <div>
          <h3 className="text-xl font-bold text-charcoal-900 mb-1">
            Technology Stack &amp; Design Architecture
          </h3>
          <p className="text-xs text-charcoal-500">
            A high-performance modern web application built for seamless data presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 space-y-2">
            <h4 className="font-bold text-sm text-charcoal-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Frontend Engineering
            </h4>
            <p className="text-charcoal-600 leading-relaxed">
              Built on React 18, TypeScript, and Vite for lightning-fast hot module replacement, strict type safety, and production bundler optimization.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 space-y-2">
            <h4 className="font-bold text-sm text-charcoal-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Tailwind CSS &amp; UI System
            </h4>
            <p className="text-charcoal-600 leading-relaxed">
              Custom design tokens featuring off-white (#F8FAF9), deep forest green (#145C46), emerald accents (#10B981), and Plus Jakarta Sans typography.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 space-y-2">
            <h4 className="font-bold text-sm text-charcoal-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Interactive Geospatial Mapping
            </h4>
            <p className="text-charcoal-600 leading-relaxed">
              Leaflet &amp; React-Leaflet integration with custom SVG AQI numeric marker pins and interactive popups across 15 Indian metropolitan stations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 space-y-2">
            <h4 className="font-bold text-sm text-charcoal-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Data Visualization &amp; Telemetry
            </h4>
            <p className="text-charcoal-600 leading-relaxed">
              Recharts library powering responsive multi-layer area charts, bar graphs, sparklines, and confidence ribbon intervals.
            </p>
          </div>
        </div>
      </div>

      {/* Demonstration Notice Card */}
      <div className="p-6 rounded-3xl bg-forest-900 text-white border border-forest-800 shadow-elevated">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">
              Demonstration &amp; Evaluation Notice
            </h4>
            <p className="text-xs text-forest-100 leading-relaxed mb-4">
              This deployment is a high-fidelity interactive product demo intended for academic faculty, project evaluators, and technology judges. All sensor feeds, machine learning model performance numbers, and predictions are realistically simulated Indian demonstration values. The website operates completely standalone with zero backend or external API key dependencies.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-400">
              <Link to="/dashboard" className="hover:underline flex items-center gap-1">
                Explore Default Node: Ghaziabad (AQI 178) &rarr;
              </Link>
              <Link to="/predictions" className="hover:underline flex items-center gap-1">
                Inspect Machine Learning Models &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

