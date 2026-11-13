import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wind,
  ArrowRight,
  Sparkles,
  MapPin,
  Activity,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Search,
  BarChart3,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { AQIBadge } from '../components/common/AQIBadge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const LandingPage: React.FC = () => {
  const { cities, setSelectedCityById } = useCity();
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  const featuredCities = cities.slice(0, 6);

  const forecastPreviewData = [
    { time: '12:00', actual: 178, predicted: 178 },
    { time: '15:00', actual: 165, predicted: 162 },
    { time: '18:00', actual: 192, predicted: 190 },
    { time: '21:00', actual: null, predicted: 215 },
    { time: '00:00', actual: null, predicted: 228 },
    { time: '03:00', actual: null, predicted: 240 },
    { time: '06:00', actual: null, predicted: 232 },
    { time: '09:00', actual: null, predicted: 205 },
    { time: '12:00', actual: null, predicted: 184 },
  ];

  const handleCitySearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) {
      navigate('/dashboard');
      return;
    }
    const match = cities.find((c) =>
      c.name.toLowerCase().includes(heroSearch.toLowerCase())
    );
    if (match) {
      setSelectedCityById(match.id);
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-charcoal-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#F8FAF9]/90 backdrop-blur-md border-b border-charcoal-200/70 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-premium">
              <Wind className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-forest-800 block">
                AirQuant
              </span>
              <span className="text-[10px] text-charcoal-400 font-semibold tracking-wider uppercase block">
                Understand Air. Predict Tomorrow.
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-charcoal-600">
            <Link to="/dashboard" className="hover:text-forest-800 transition-colors">
              Dashboard
            </Link>
            <Link to="/map" className="hover:text-forest-800 transition-colors">
              Live Map
            </Link>
            <Link to="/predictions" className="hover:text-forest-800 transition-colors">
              AI Forecasts
            </Link>
            <Link to="/health" className="hover:text-forest-800 transition-colors">
              Health Insights
            </Link>
            <Link to="/about" className="hover:text-forest-800 transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs sm:text-sm font-bold shadow-premium hover:shadow-elevated transition-all"
            >
              Launch Platform
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-8 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-100/40 via-forest-100/30 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-50 border border-forest-200/80 text-forest-800 text-xs font-bold mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Next-Gen Environmental Intelligence for Indian Cities</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-charcoal-950 mb-6 leading-[1.08]">
            See the Air.{' '}
            <br className="hidden sm:inline" />
            <span className="text-forest-800 bg-clip-text text-transparent bg-gradient-to-r from-forest-800 via-forest-700 to-emerald-600">
              Understand Tomorrow.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-charcoal-600 mb-10 font-normal leading-relaxed">
            Explore real-time air quality insights, understand pollution patterns, and discover
            tomorrow&apos;s air with intelligent machine learning predictions across Indian metros.
          </p>

          {/* City Search Bar in Hero */}
          <form
            onSubmit={handleCitySearchSubmit}
            className="max-w-xl mx-auto mb-10 flex flex-col sm:flex-row items-center gap-2.5 p-2 bg-white rounded-2xl shadow-elevated border border-charcoal-200/90"
          >
            <div className="flex items-center gap-2.5 flex-1 px-3 w-full">
              <Search className="w-5 h-5 text-forest-700 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search your city (e.g., Ghaziabad, Delhi, Pune, Mumbai)..."
                className="w-full text-sm outline-none bg-transparent placeholder:text-charcoal-400 py-1.5"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              Explore City
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-16">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-sm font-bold shadow-premium hover:shadow-elevated transition-all flex items-center gap-2"
            >
              Explore Dashboard
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
            <Link
              to="/predictions"
              className="px-6 py-3 rounded-xl bg-white hover:bg-charcoal-50 text-charcoal-800 border border-charcoal-200 text-sm font-bold shadow-subtle transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-forest-700" />
              Explore AI Predictions
            </Link>
            <Link
              to="/map"
              className="px-6 py-3 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 border border-forest-200 text-sm font-bold transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-forest-700" />
              Interactive India Map
            </Link>
          </div>

          {/* High-Fidelity Hero Preview Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-200/90 shadow-elevated text-left">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-charcoal-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-charcoal-900">Ghaziabad, Uttar Pradesh</h3>
                    <AQIBadge category="Moderate" />
                  </div>
                  <p className="text-xs text-charcoal-500">
                    Vasundhara CAAQMS • Official Demo Standard
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs uppercase text-charcoal-400 font-semibold block">
                    Current AQI
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono">
                    178
                  </span>
                </div>
                <div className="h-10 w-px bg-charcoal-200" />
                <div>
                  <span className="text-xs uppercase text-charcoal-400 font-semibold block">
                    Dominant
                  </span>
                  <span className="text-base font-bold text-charcoal-800">PM2.5 (92 µg/m³)</span>
                </div>
              </div>
            </div>

            {/* Quick Pollutants Grid in Hero Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-charcoal-200/70">
                <span className="text-xs font-semibold text-charcoal-500">PM2.5</span>
                <div className="text-lg font-bold text-charcoal-900">92 <span className="text-xs text-charcoal-400 font-normal">µg/m³</span></div>
                <span className="text-[10px] text-amber-600 font-medium">Moderate</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-charcoal-200/70">
                <span className="text-xs font-semibold text-charcoal-500">PM10</span>
                <div className="text-lg font-bold text-charcoal-900">151 <span className="text-xs text-charcoal-400 font-normal">µg/m³</span></div>
                <span className="text-[10px] text-amber-600 font-medium">Moderate</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-charcoal-200/70">
                <span className="text-xs font-semibold text-charcoal-500">NO2</span>
                <div className="text-lg font-bold text-charcoal-900">36 <span className="text-xs text-charcoal-400 font-normal">µg/m³</span></div>
                <span className="text-[10px] text-emerald-600 font-medium">Safe</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-charcoal-200/70">
                <span className="text-xs font-semibold text-charcoal-500">Next 24h AI Forecast</span>
                <div className="text-lg font-bold text-forest-800">184 <span className="text-xs text-charcoal-400 font-normal">AQI</span></div>
                <span className="text-[10px] text-emerald-600 font-medium">XGBoost High Conf.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 – AIR QUALITY AT A GLANCE */}
      <section className="py-16 bg-white border-y border-charcoal-200/70 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Live Sensor Telemetry
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1">
                Air Quality at a Glance across India
              </h2>
              <p className="text-sm text-charcoal-500 mt-1">
                Representative measurements from Continuous Ambient Air Quality Monitoring Stations (CAAQMS).
              </p>
            </div>
            <Link
              to="/live"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-900 hover:underline"
            >
              View all 15 stations &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredCities.map((city) => (
              <div
                key={city.id}
                onClick={() => {
                  setSelectedCityById(city.id);
                  navigate('/dashboard');
                }}
                className="p-5 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 hover:border-forest-300 hover:shadow-premium transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base text-charcoal-900 group-hover:text-forest-800 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-xs text-charcoal-400">{city.state}</p>
                  </div>
                  <AQIBadge category={city.category} />
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-charcoal-200/60">
                  <div>
                    <span className="text-3xl font-extrabold font-mono text-charcoal-900">
                      {city.aqi}
                    </span>
                    <span className="text-xs text-charcoal-500 ml-1 font-medium">AQI</span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-charcoal-400 block text-[11px]">Dominant:</span>
                    <span className="font-semibold text-charcoal-700">{city.dominantPollutant}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 – WHY AIRQUANT */}
      <section className="py-20 px-4 sm:px-8 bg-[#F8FAF9]">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            Core Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mt-2">
            Why AirQuant?
          </h2>
          <p className="text-charcoal-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
            Built specifically to solve India&apos;s complex multi-season pollution dynamics with three pillars.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-3xl border border-charcoal-200/80 shadow-subtle hover:shadow-premium transition-all">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 mb-5">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-2">1. Monitor</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                Real-time continuous aggregation of 6 critical criteria pollutants: PM2.5, PM10, NO2,
                SO2, CO, and O3 according to CPCB NAQI protocols.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-3xl border border-charcoal-200/80 shadow-subtle hover:shadow-premium transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-2">2. Analyze</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                Diurnal cycle decomposition, winter inversion event tracking, and cross-city
                correlations between meteorological factors and surface particulate build-up.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-3xl border border-charcoal-200/80 shadow-subtle hover:shadow-premium transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-2">3. Predict</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                Machine learning regression pipelines forecasting next 24-hour, 3-day and 7-day AQI
                trajectories with confidence envelopes for proactive action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 – INTELLIGENT PREDICTIONS */}
      <section className="py-20 bg-white border-y border-charcoal-200/70 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Machine Learning Forecasting
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mt-2 leading-tight">
                Predict Tomorrow&apos;s Air Quality Before Stepping Out
              </h2>
              <p className="text-charcoal-600 text-sm sm:text-base mt-4 leading-relaxed">
                AirQuant couples historical pollutant lag times with numerical weather prediction
                features (wind vectors, boundary layer height, temperature inversions) to forecast
                spikes hours in advance.
              </p>

              <div className="space-y-3.5 mt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-sm font-semibold text-charcoal-800">
                    Next 24-Hour hourly forecast trajectory
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-sm font-semibold text-charcoal-800">
                    Ensemble models: XGBoost, Random Forest & Gradient Boost
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-sm font-semibold text-charcoal-800">
                    Automated sensitive group health advisories
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/predictions"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-premium transition-all"
                >
                  Inspect Forecast Models
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>
              </div>
            </div>

            {/* Preview Chart */}
            <div className="bg-[#F8FAF9] rounded-3xl p-6 border border-charcoal-200/80 shadow-premium">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-sm text-charcoal-900">
                    24h Forecast Curve • Ghaziabad
                  </h4>
                  <p className="text-xs text-charcoal-500">Historical actuals vs. ML forecast</p>
                </div>
                <span className="text-[10px] font-bold bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full">
                  XGBoost (R²: 0.942)
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastPreviewData}>
                    <defs>
                      <linearGradient id="actualColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#145C46" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#145C46" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="predColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} domain={[120, 260]} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '0.75rem',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#145C46"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#actualColor)"
                      name="Observed AQI"
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="#10B981"
                      strokeWidth={3}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#predColor)"
                      name="AI Forecast AQI"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 mt-3 text-xs text-charcoal-600 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-forest-800 rounded-full" />
                  <span>Observed Telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-emerald-500 rounded-full border-dashed" />
                  <span>AI Predicted Trend</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 – INDIA COVERAGE */}
      <section className="py-20 px-4 sm:px-8 bg-[#F8FAF9]">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            National Grid
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mt-2">
            Pan-India Environmental Coverage
          </h2>
          <p className="text-charcoal-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
            Monitoring air quality stations across Northern, Western, Southern, and Eastern industrial and urban hubs.
          </p>

          <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-charcoal-200/90 shadow-elevated">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {cities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => {
                    setSelectedCityById(city.id);
                    navigate('/map');
                  }}
                  className="p-3.5 rounded-xl border border-charcoal-200/80 bg-[#F8FAF9] hover:bg-forest-50 hover:border-forest-200 transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-charcoal-900 group-hover:text-forest-800">
                      {city.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-charcoal-600">
                      {city.aqi}
                    </span>
                  </div>
                  <div className="text-[10px] text-charcoal-400 mt-0.5 truncate">
                    {city.state}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-charcoal-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-charcoal-500">
                <MapPin className="w-4 h-4 text-forest-700" />
                <span>15 High-Density Continuous Monitoring Hubs Mapped</span>
              </div>

              <Link
                to="/map"
                className="px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 shadow-sm transition-all flex items-center gap-1.5"
              >
                Open Fullscreen Interactive Map &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 – HOW IT WORKS */}
      <section className="py-20 bg-white border-y border-charcoal-200/70 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            Pipeline Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mt-2">
            How AirQuant Works
          </h2>
          <p className="text-charcoal-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
            A resilient four-stage workflow transforming raw sensor reads into actionable citizen intelligence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14 text-left">
            <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 relative">
              <span className="text-xs font-mono font-extrabold text-forest-700 block mb-2">STEP 01</span>
              <h3 className="font-bold text-base text-charcoal-900 mb-2">Data Collection</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Ingestion of 24h continuous criteria telemetry (PM2.5, PM10, gaseous pollutants) and weather vectors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 relative">
              <span className="text-xs font-mono font-extrabold text-forest-700 block mb-2">STEP 02</span>
              <h3 className="font-bold text-base text-charcoal-900 mb-2">AQI Analysis</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Calculation of sub-indices according to India CPCB 2014 breakpoint guidelines and dominant pollutant tagging.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 relative">
              <span className="text-xs font-mono font-extrabold text-forest-700 block mb-2">STEP 03</span>
              <h3 className="font-bold text-base text-charcoal-900 mb-2">Machine Learning</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Multi-lag regression utilizing XGBoost and Gradient Boosters calibrated on seasonal inversion phenomena.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 relative">
              <span className="text-xs font-mono font-extrabold text-forest-700 block mb-2">STEP 04</span>
              <h3 className="font-bold text-base text-charcoal-900 mb-2">Health Insights</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Dynamic threshold alerts, activity advisories, and protective actions tailored to vulnerable demographics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 – CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#F8FAF9] to-forest-50/50">
        <div className="max-w-4xl mx-auto bg-forest-900 text-white rounded-3xl p-8 sm:p-14 text-center shadow-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4 border border-emerald-500/30">
            Environmental Responsibility
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            &quot;Make every breath an informed decision.&quot;
          </h2>

          <p className="text-forest-100 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
            Whether planning morning jogs, school commutes, or factory ventilation schedules, AirQuant
            gives you foresight into India&apos;s changing air.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-sm shadow-premium transition-all flex items-center gap-2"
            >
              Open Full Interactive Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="px-6 py-3.5 rounded-xl bg-forest-800/80 hover:bg-forest-800 text-white border border-forest-700 font-bold text-sm transition-all"
            >
              Read Architecture & Research
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-charcoal-200/80 py-12 px-4 sm:px-8 text-charcoal-500 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-forest-800 flex items-center justify-center text-white">
                <Wind className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-extrabold text-base text-forest-800">AirQuant</span>
            </div>
            <p className="text-charcoal-400 leading-relaxed mb-3">
              Intelligent environmental monitoring & machine learning prediction platform for Indian cities.
            </p>
            <span className="text-[11px] font-mono text-charcoal-400 block">
              High-Fidelity Demonstration Edition
            </span>
          </div>

          <div>
            <h4 className="font-bold text-charcoal-900 uppercase tracking-wider mb-3 text-[11px]">
              Platform Modules
            </h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="hover:text-forest-800">Main Dashboard</Link></li>
              <li><Link to="/live" className="hover:text-forest-800">Live Station Feeds</Link></li>
              <li><Link to="/map" className="hover:text-forest-800">Pan-India Leaflet Map</Link></li>
              <li><Link to="/predictions" className="hover:text-forest-800">AI Forecasting Models</Link></li>
              <li><Link to="/compare" className="hover:text-forest-800">City Comparison</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-charcoal-900 uppercase tracking-wider mb-3 text-[11px]">
              Standards & Science
            </h4>
            <ul className="space-y-2">
              <li><Link to="/health" className="hover:text-forest-800">CPCB NAQI Index Breakpoints</Link></li>
              <li><Link to="/health" className="hover:text-forest-800">Sensitive Groups Guidelines</Link></li>
              <li><Link to="/historical" className="hover:text-forest-800">Diurnal Cycle Analytics</Link></li>
              <li><Link to="/predictions" className="hover:text-forest-800">XGBoost & Random Forest</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-charcoal-900 uppercase tracking-wider mb-3 text-[11px]">
              Academic & Demo Details
            </h4>
            <p className="text-charcoal-400 leading-relaxed mb-2">
              Designed as a premium demonstration system for faculty evaluation, environmental startup pitch, and machine learning research showcase.
            </p>
            <div className="pt-2 text-[11px] text-emerald-700 font-semibold">
              Default Node: Vasundhara, Ghaziabad (AQI 178)
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-charcoal-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-charcoal-400">
          <div>
            © {new Date().getFullYear()} AirQuant Environmental Technology. All demo rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Simulated Telemetry Stream</span>
            <span>•</span>
            <span>Indian CPCB Standards</span>
            <span>•</span>
            <Link to="/about" className="hover:text-forest-800">About Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

