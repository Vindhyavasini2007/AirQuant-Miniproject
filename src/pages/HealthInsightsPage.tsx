import React, { useState } from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  AlertTriangle, 
  Wind, 
  Activity, 
  Sparkles, 
  Users, 
  Baby, 
  UserCheck, 
  CheckCircle2, 
  Info,
  HelpCircle
} from 'lucide-react';
import { CPCB_CATEGORIES } from '../data/mockData';
import { AQIBadge } from '../components/common/AQIBadge';

export const HealthInsightsPage: React.FC = () => {
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>('Moderate');

  const categories = Object.values(CPCB_CATEGORIES);
  const activeCategory = CPCB_CATEGORIES[activeCategoryKey] || CPCB_CATEGORIES['Moderate'];

  const pollutantsInfo = [
    {
      symbol: 'PM2.5',
      name: 'Fine Inhalable Particles (diameter ≤ 2.5 micrometers)',
      sources: 'Vehicular exhaust, biomass burning, crop stubble, power plants.',
      healthImpact: 'Can penetrate deep into the alveoli of lungs and enter the bloodstream. Causes heart attacks, aggravated asthma, reduced lung capacity, and chronic bronchitis.',
      standard: 'CPCB 24h limit: 60 µg/m³ • WHO guideline: 15 µg/m³',
    },
    {
      symbol: 'PM10',
      name: 'Coarse Inhalable Particles (diameter ≤ 10 micrometers)',
      sources: 'Road dust, construction and demolition sites, fly ash, dust storms.',
      healthImpact: 'Irritates the eyes, nose, and throat. Damages respiratory lining and worsens chronic obstructive pulmonary disease (COPD).',
      standard: 'CPCB 24h limit: 100 µg/m³ • WHO guideline: 45 µg/m³',
    },
    {
      symbol: 'NO2',
      name: 'Nitrogen Dioxide (Pungent acidic gas)',
      sources: 'High-temperature diesel combustion, motor vehicles, thermal power plants.',
      healthImpact: 'Inflames airway linings and increases susceptibility to respiratory infections and allergies, especially in children.',
      standard: 'CPCB 24h limit: 80 µg/m³ • WHO guideline: 25 µg/m³',
    },
    {
      symbol: 'SO2',
      name: 'Sulphur Dioxide',
      sources: 'Coal-fired power generation, industrial boilers, oil refineries.',
      healthImpact: 'Affects respiratory system and lung functions. Major contributor to acid rain and secondary sulphate aerosol formation.',
      standard: 'CPCB 24h limit: 80 µg/m³ • WHO guideline: 40 µg/m³',
    },
    {
      symbol: 'CO',
      name: 'Carbon Monoxide (Colorless, odorless gas)',
      sources: 'Incomplete combustion in automobiles, biomass heating, iron smelting.',
      healthImpact: 'Binds to hemoglobin with 200x greater affinity than oxygen, reducing oxygen delivery to vital organs like heart and brain.',
      standard: 'CPCB 8h limit: 2.0 mg/m³ • CPCB 1h limit: 4.0 mg/m³',
    },
    {
      symbol: 'O3',
      name: 'Surface Ground-Level Ozone (Photochemical smog)',
      sources: 'Secondary pollutant formed when NOx and VOCs react in intense sunlight.',
      healthImpact: 'Powerful oxidant causing chest tightness, coughing, throat irritation, and permanent lung tissue scarring over long exposures.',
      standard: 'CPCB 8h limit: 100 µg/m³',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              National Health &amp; Exposure Framework
            </span>
            <span className="text-xs bg-forest-50 text-forest-800 font-bold px-2 py-0.5 rounded-full border border-forest-200">
              India CPCB NAQI Standards
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Air Quality Health Guidelines &amp; Insights
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-2xl">
            Authoritative clinical impact data, vulnerable demographic protocols, and criteria pollutant science.
          </p>
        </div>
      </div>

      {/* CPCB Six AQI Categories Explorer Grid */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-charcoal-200/80 shadow-subtle">
        <h3 className="font-bold text-lg text-charcoal-900 mb-1">
          India CPCB National Air Quality Index (NAQI) Scale
        </h3>
        <p className="text-xs text-charcoal-500 mb-5">
          Select an AQI tier to inspect specific health advisories and activity protocols:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {categories.map((cat) => {
            const isSelected = activeCategoryKey === cat.category;
            return (
              <button
                key={cat.category}
                onClick={() => setActiveCategoryKey(cat.category)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'ring-2 ring-forest-700 shadow-md font-bold'
                    : 'hover:border-charcoal-300 opacity-90'
                } ${cat.bgColor} ${cat.borderColor}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className={`text-xs font-bold ${cat.textColor}`}>
                    {cat.category}
                  </span>
                </div>
                <div className="text-base font-extrabold font-mono text-charcoal-900">
                  {cat.range[0]} - {cat.range[1]}
                </div>
                <span className="text-[10px] text-charcoal-500 block mt-0.5">
                  CPCB NAQI Range
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Health Breakdown Card */}
        <div className={`p-6 rounded-3xl border ${activeCategory.bgColor} ${activeCategory.borderColor}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-charcoal-200/40">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-500 block">
                Selected Index Tier
              </span>
              <h4 className="text-2xl font-extrabold text-charcoal-900 flex items-center gap-2">
                {activeCategory.category} (AQI {activeCategory.range[0]} - {activeCategory.range[1]})
              </h4>
            </div>
            <AQIBadge category={activeCategory.category} size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-charcoal-200/60 shadow-xs">
              <div className="flex items-center gap-2 text-charcoal-900 font-bold text-sm mb-2">
                <Users className="w-4 h-4 text-forest-700" />
                General Population
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                {activeCategory.adviceGeneral}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-charcoal-200/60 shadow-xs">
              <div className="flex items-center gap-2 text-charcoal-900 font-bold text-sm mb-2">
                <Baby className="w-4 h-4 text-amber-600" />
                Sensitive &amp; Vulnerable Groups
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                {activeCategory.adviceSensitive}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-charcoal-200/60 shadow-xs">
              <div className="flex items-center gap-2 text-charcoal-900 font-bold text-sm mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Outdoor Activities &amp; Athletics
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                {activeCategory.outdoorGuidance}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-charcoal-200/40 flex items-start gap-2.5 text-xs text-charcoal-700">
            <Info className="w-4 h-4 text-charcoal-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Medical Impact Summary: </span>
              {activeCategory.healthImpact}
            </div>
          </div>
        </div>
      </div>

      {/* Sensitive Demographics Deep Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
            <Baby className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-base text-charcoal-900 mb-2">
            Infants &amp; School Children
          </h4>
          <p className="text-xs text-charcoal-600 leading-relaxed mb-3">
            Children inhale more air per kilogram of body weight than adults and their immune and respiratory systems are still developing.
          </p>
          <ul className="text-xs text-charcoal-600 space-y-1.5 border-t border-charcoal-100 pt-3">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Shift physical education classes indoors when AQI &gt; 150</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Equip school buses with particulate filtration</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mb-4">
            <UserCheck className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-base text-charcoal-900 mb-2">
            Elderly &amp; Cardiac Patients
          </h4>
          <p className="text-xs text-charcoal-600 leading-relaxed mb-3">
            Fine PM2.5 induces systemic arterial inflammation, increasing the incidence of myocardial infarction and ischemic stroke on high pollution days.
          </p>
          <ul className="text-xs text-charcoal-600 space-y-1.5 border-t border-charcoal-100 pt-3">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Avoid early morning morning walks during winter inversions</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Maintain daily prescribed cardiovascular medications</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-base text-charcoal-900 mb-2">
            Asthma &amp; Respiratory Sufferers
          </h4>
          <p className="text-xs text-charcoal-600 leading-relaxed mb-3">
            Elevated nitrogen dioxide (NO2) and particulate matter trigger immediate bronchospasm, wheezing, and chest tightness.
          </p>
          <ul className="text-xs text-charcoal-600 space-y-1.5 border-t border-charcoal-100 pt-3">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Keep quick-relief bronchodilator inhalers handy</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Use certified N95 / FFP2 respirators outdoors</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Criteria Pollutants Scientific Deep Dive */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-200/80 shadow-subtle">
        <h3 className="font-bold text-xl text-charcoal-900 mb-1">
          The 6 Criteria Pollutants: Chemistry, Sources &amp; Toxicology
        </h3>
        <p className="text-xs text-charcoal-500 mb-6">
          Detailed breakdown of criteria gases and particulates defined under the Indian Air (Prevention and Control of Pollution) Act.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pollutantsInfo.map((p, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-lg font-black font-mono text-forest-800">
                  {p.symbol}
                </span>
                <span className="text-[10px] font-mono text-charcoal-500 bg-white px-2 py-0.5 rounded border border-charcoal-200">
                  {p.standard}
                </span>
              </div>
              <h4 className="text-xs font-bold text-charcoal-900 mb-1">{p.name}</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed mb-2">
                <span className="font-semibold text-charcoal-700">Origin: </span>
                {p.sources}
              </p>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                <span className="font-semibold text-charcoal-700">Health Impact: </span>
                {p.healthImpact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

