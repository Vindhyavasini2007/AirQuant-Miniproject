import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Wind, 
  Thermometer, 
  Droplets, 
  Compass, 
  Eye, 
  Gauge, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Activity,
  Sparkles, 
  ChevronRight, 
  Info,
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { CircularGauge } from '../components/common/CircularGauge';
import { AQIBadge } from '../components/common/AQIBadge';
import { PollutantCard } from '../components/common/PollutantCard';
import { CPCB_CATEGORIES, getCategoryForAQI } from '../data/mockData';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Link } from 'react-router-dom';
import { fetchCurrentAir, getBrowserLocation, CurrentAirReading } from '../services/currentAirQuality';

export const DashboardPage: React.FC = () => {
  const { selectedCity, setSelectedCityById, cities, lastSyncTime } = useCity();
  const [locationReading, setLocationReading] = useState<CurrentAirReading | null>(null);
  const [locationCoordinates, setLocationCoordinates] = useState<[number, number] | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [activeChartTab, setActiveChartTab] = useState<'24h' | 'weekly' | 'pm25'>('24h');
  const useMyLocation = async () => {
    setLocationLoading(true);
    setLocationMessage('');
    try {
      const position = await getBrowserLocation();
      const reading = await fetchCurrentAir(position.coords.latitude, position.coords.longitude);
      setLocationReading(reading);
      setLocationCoordinates([position.coords.latitude, position.coords.longitude]);
      setLocationMessage('');
    } catch (error) {
      setLocationMessage(error instanceof Error ? error.message : 'Could not load air quality for this location.');
    } finally {
      setLocationLoading(false);
    }
  };

  const displayCity = locationReading ? {
    ...selectedCity,
    id: 'current-location',
    name: 'Your current location',
    state: 'Browser location',
    coordinates: locationCoordinates || selectedCity.coordinates,
    aqi: locationReading.aqi,
    category: locationReading.category,
    dominantPollutant: locationReading.dominantPollutant as typeof selectedCity.dominantPollutant,
    pollutants: locationReading.pollutants,
    lastUpdated: `Model time ${new Date(locationReading.time).toLocaleString()}`,
    monitoringStation: 'CAMS global model · approx. 45 km grid',
    hourlyTrends: locationReading.hourly.slice(-24).map((point) => ({
      time: new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      aqi: point.aqi, pm25: point.pm25, pm10: point.pm10,
    })),
  } : selectedCity;

  // Greeting based on current hour
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  const categoryInfo = getCategoryForAQI(displayCity.aqi);

  // Pollutant statuses and colors
  const getPollutantStatus = (name: string, val: number) => {
    switch (name) {
      case 'PM2.5':
        return val <= 30 ? { status: 'Safe' as const, color: '#10B981' } : val <= 60 ? { status: 'Moderate' as const, color: '#F59E0B' } : val <= 90 ? { status: 'High' as const, color: '#F97316' } : { status: 'Hazardous' as const, color: '#EF4444' };
      case 'PM10':
        return val <= 50 ? { status: 'Safe' as const, color: '#10B981' } : val <= 100 ? { status: 'Moderate' as const, color: '#F59E0B' } : val <= 250 ? { status: 'High' as const, color: '#F97316' } : { status: 'Hazardous' as const, color: '#EF4444' };
      case 'NO2':
        return val <= 40 ? { status: 'Safe' as const, color: '#10B981' } : val <= 80 ? { status: 'Moderate' as const, color: '#F59E0B' } : { status: 'High' as const, color: '#F97316' };
      case 'SO2':
        return val <= 40 ? { status: 'Safe' as const, color: '#10B981' } : val <= 80 ? { status: 'Moderate' as const, color: '#F59E0B' } : { status: 'High' as const, color: '#F97316' };
      case 'CO':
        return val <= 1.0 ? { status: 'Safe' as const, color: '#10B981' } : val <= 2.0 ? { status: 'Moderate' as const, color: '#F59E0B' } : { status: 'High' as const, color: '#F97316' };
      case 'O3':
        return val <= 50 ? { status: 'Safe' as const, color: '#10B981' } : val <= 100 ? { status: 'Moderate' as const, color: '#F59E0B' } : { status: 'High' as const, color: '#F97316' };
      default:
        return { status: 'Safe' as const, color: '#10B981' };
    }
  };

  const pm25Stat = getPollutantStatus('PM2.5', displayCity.pollutants.pm25);
  const pm10Stat = getPollutantStatus('PM10', displayCity.pollutants.pm10);
  const no2Stat = getPollutantStatus('NO2', displayCity.pollutants.no2);
  const so2Stat = getPollutantStatus('SO2', displayCity.pollutants.so2);
  const coStat = getPollutantStatus('CO', displayCity.pollutants.co);
  const o3Stat = getPollutantStatus('O3', displayCity.pollutants.o3);

  // Sparkline data generators
  const sparkPM25 = displayCity.hourlyTrends.map((h) => h.pm25);
  const sparkPM10 = displayCity.hourlyTrends.map((h) => h.pm10);
  const sparkNO2 = [28, 30, 32, 35, 36, 38, 36, 34, 32, 35, 36, 36];
  const sparkSO2 = [10, 11, 12, 13, 12, 12, 11, 12, 13, 12, 12, 12];
  const sparkCO = [0.6, 0.7, 0.7, 0.8, 0.9, 0.8, 0.7, 0.7, 0.8, 0.8, 0.9, 0.8];
  const sparkO3 = [35, 38, 42, 45, 52, 54, 50, 48, 45, 42, 44, 48];

  const recentCities = cities.filter((c) => c.id !== selectedCity.id).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Header & City Switcher Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-forest-700 tracking-wide uppercase">
              {greeting}, Environmental Officer
            </span>
            <span className="text-charcoal-300">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {locationReading ? 'Modelled location estimate' : 'Demo Data Mode'}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-6 h-6 text-forest-700 shrink-0" />
              {displayCity.name}, {displayCity.state}
            </h1>
            <span className="text-xs text-charcoal-500 font-medium hidden sm:inline">
              Station: {displayCity.monitoringStation}
            </span>
          </div>
        </div>

        {/* City Selector and Telemetry Timestamp */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={locationReading ? () => { setLocationReading(null); setLocationCoordinates(null); setLocationMessage(''); } : useMyLocation}
            disabled={locationLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-forest-200 text-forest-800 font-bold text-xs shadow-sm hover:bg-forest-50 disabled:opacity-60"
            title="Use browser location to load a modelled local air-quality estimate"
          >
            <Compass className="w-3.5 h-3.5" />
            {locationLoading ? 'Loading�' : locationReading ? 'Use demo city' : 'Use my location'}
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAF9] border border-charcoal-200 text-xs text-charcoal-600 font-medium">
            <Clock className="w-3.5 h-3.5 text-charcoal-400" />
            <span>{displayCity.lastUpdated}</span>
          </div>

          <select
            value={locationReading ? 'current-location' : selectedCity.id}
            onChange={(e) => {
              setLocationMessage('');
              if (e.target.value === 'current-location') return;
              setLocationReading(null);
              setLocationCoordinates(null);
              setSelectedCityById(e.target.value);
            }}
            className="px-3.5 py-2 rounded-xl bg-forest-50 border border-forest-200 font-bold text-xs sm:text-sm text-forest-900 outline-none hover:bg-forest-100 focus:ring-2 focus:ring-forest-300 transition-all cursor-pointer"
          >
            {locationReading && <option value="current-location">Your current location (model estimate)</option>}
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name} ({city.state}) — {city.aqi} AQI
              </option>
            ))}
          </select>
        </div>
      </div>

      {locationMessage && (
        <div role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          {locationMessage}
        </div>
      )}

      {locationReading && (
        <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs leading-relaxed text-sky-950">
          <b>Modelled estimate, not a nearby monitor reading.</b> Pollutant concentrations come from Open-Meteo�s CAMS global forecast grid (about 45 km). The displayed CPCB-scale estimate applies Indian AQI concentration breakpoints to the latest hourly model values; official CPCB AQI uses longer averaging periods and data-coverage rules. Model timestamp: {new Date(locationReading.time).toLocaleString()}. Location coordinates are sent to Open-Meteo to retrieve the estimate. <a className="underline" href="https://open-meteo.com/en/docs/air-quality-api" target="_blank" rel="noreferrer">Data and attribution</a> � <a className="underline" href="https://www.cpcb.nic.in/ccr_docs/About_AQI.pdf" target="_blank" rel="noreferrer">CPCB method</a>.
        </div>
      )}

      {/* Main AQI Section & Gauge Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AQI Circular Gauge & Primary Index Overview */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-charcoal-200/80 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                  National Air Quality Index (NAQI)
                </span>
                <h2 className="text-lg font-bold text-charcoal-900">
                  Current Atmospheric Status
                </h2>
              </div>
              <AQIBadge category={displayCity.category} size="lg" />
            </div>

            {/* Circular Gauge */}
            <div className="flex justify-center my-4 py-2">
              <CircularGauge value={displayCity.aqi} max={500} size={220} />
            </div>

            {/* CPCB Scale Bar */}
            <div className="mt-4 pt-4 border-t border-charcoal-100">
              <div className="flex justify-between items-center text-[11px] font-semibold text-charcoal-500 mb-1.5">
                <span>CPCB Severity Gradient</span>
                <span className="text-charcoal-800 font-bold">{displayCity.category} Zone</span>
              </div>
              {/* Visual Multi-Segment Color Bar */}
              <div className="h-2.5 w-full rounded-full flex overflow-hidden gap-0.5">
                <div className="h-full w-1/6 bg-emerald-500" title="0-50 Good" />
                <div className="h-full w-1/6 bg-lime-500" title="51-100 Satisfactory" />
                <div className="h-full w-1/6 bg-amber-500" title="101-200 Moderate" />
                <div className="h-full w-1/6 bg-orange-500" title="201-300 Poor" />
                <div className="h-full w-1/6 bg-red-500" title="301-400 Very Poor" />
                <div className="h-full w-1/6 bg-rose-900" title="401-500 Severe" />
              </div>
            </div>
          </div>

          {/* Dominant Pollutant & Health Advisory callout */}
          <div className="mt-5 p-4 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/70">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-charcoal-900">
                    Primary Pollutant: {displayCity.dominantPollutant}
                  </span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">
                    Sub-Index Driver
                  </span>
                </div>
                <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                  {categoryInfo.healthImpact}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Weather Matrix & Next 24h AI Prediction Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Weather Conditions Card */}
          <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-forest-700" />
                <h3 className="font-bold text-base text-charcoal-900">
                  Meteorological Environment
                </h3>
              </div>
              <span className="text-xs font-semibold text-charcoal-500 bg-charcoal-50 px-2.5 py-1 rounded-lg border border-charcoal-200">
                {displayCity.weather.condition}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/60">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-500 mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  <span>Temperature</span>
                </div>
                <div className="text-xl font-extrabold text-charcoal-900">
                  {displayCity.weather.temperature}°C
                </div>
                <span className="text-[10px] text-charcoal-400 font-medium">Ambient surface</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/60">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-500 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>Humidity</span>
                </div>
                <div className="text-xl font-extrabold text-charcoal-900">
                  {displayCity.weather.humidity}%
                </div>
                <span className="text-[10px] text-charcoal-400 font-medium">Relative humidity</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/60">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-500 mb-1">
                  <Wind className="w-3.5 h-3.5 text-teal-600" />
                  <span>Wind Velocity</span>
                </div>
                <div className="text-xl font-extrabold text-charcoal-900">
                  {displayCity.weather.windSpeed} <span className="text-xs text-charcoal-500 font-normal">km/h</span>
                </div>
                <span className="text-[10px] text-charcoal-400 font-medium truncate block">
                  Dir: {displayCity.weather.windDirection}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/60">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-500 mb-1">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Visibility</span>
                </div>
                <div className="text-xl font-extrabold text-charcoal-900">
                  {displayCity.weather.visibility} <span className="text-xs text-charcoal-500 font-normal">km</span>
                </div>
                <span className="text-[10px] text-charcoal-400 font-medium">Surface visual</span>
              </div>
            </div>
          </div>

          {/* AI Forecast Preview Card */}
          <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-forest-700" />
                <div>
                  <h3 className="font-bold text-base text-charcoal-900">
                    Next 24-Hour AI Prediction
                  </h3>
                  <p className="text-xs text-charcoal-400">
                    Trained XGBoost / Gradient Boost Multi-Lag Ensemble
                  </p>
                </div>
              </div>
              <Link
                to="/predictions"
                className="text-xs font-bold text-forest-800 hover:text-forest-900 flex items-center gap-1"
              >
                Full Forecast &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {displayCity.predictions24h.slice(0, 4).map((p, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/70 text-center">
                  <span className="text-[11px] font-bold text-charcoal-400 block mb-1">
                    {p.label}
                  </span>
                  <div className="text-2xl font-black text-charcoal-900 font-mono">
                    {p.predictedAqi}
                  </div>
                  <div className="mt-1">
                    <AQIBadge category={p.category} size="sm" showDot={false} />
                  </div>
                  <span className="text-[9px] text-charcoal-400 font-mono mt-1 block">
                    [{p.confidenceLower} - {p.confidenceUpper}]
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-500">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Diurnal peak expected around 04:00 Dawn due to temperature inversion.
              </span>
              <span className="font-mono text-[10px] text-charcoal-400">Conf: 94.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Pollutant Detail Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-charcoal-900">
              Criteria Pollutants Breakdown
            </h3>
            <p className="text-xs text-charcoal-500">
              Real-time concentrations calibrated with India Central Pollution Control Board standards
            </p>
          </div>
          <span className="text-xs font-medium text-charcoal-400 hidden sm:inline">
            Units: µg/m³ (micrograms) & mg/m³ (milligrams)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <PollutantCard
            name="PM2.5"
            fullName="Fine Particulate Matter (< 2.5 µm)"
            value={displayCity.pollutants.pm25}
            unit="µg/m³"
            safeLimit="CPCB Limit: 60"
            status={pm25Stat.status}
            statusColor={pm25Stat.color}
            sparklineData={sparkPM25}
            icon={<Wind className="w-5 h-5 text-forest-700" />}
          />

          <PollutantCard
            name="PM10"
            fullName="Coarse Particulate Matter (< 10 µm)"
            value={displayCity.pollutants.pm10}
            unit="µg/m³"
            safeLimit="CPCB Limit: 100"
            status={pm10Stat.status}
            statusColor={pm10Stat.color}
            sparklineData={sparkPM10}
            icon={<Gauge className="w-5 h-5 text-forest-700" />}
          />

          <PollutantCard
            name="NO2"
            fullName="Nitrogen Dioxide"
            value={displayCity.pollutants.no2}
            unit="µg/m³"
            safeLimit="CPCB Limit: 80"
            status={no2Stat.status}
            statusColor={no2Stat.color}
            sparklineData={sparkNO2}
            icon={<Activity className="w-5 h-5 text-forest-700" />}
          />

          <PollutantCard
            name="SO2"
            fullName="Sulphur Dioxide"
            value={displayCity.pollutants.so2}
            unit="µg/m³"
            safeLimit="CPCB Limit: 80"
            status={so2Stat.status}
            statusColor={so2Stat.color}
            sparklineData={sparkSO2}
            icon={<Wind className="w-5 h-5 text-forest-700" />}
          />

          <PollutantCard
            name="CO"
            fullName="Carbon Monoxide"
            value={displayCity.pollutants.co}
            unit="mg/m³"
            safeLimit="CPCB Limit: 2.0"
            status={coStat.status}
            statusColor={coStat.color}
            sparklineData={sparkCO}
            icon={<AlertTriangle className="w-5 h-5 text-forest-700" />}
          />

          <PollutantCard
            name="O3"
            fullName="Surface Ozone"
            value={displayCity.pollutants.o3}
            unit="µg/m³"
            safeLimit="CPCB Limit: 100"
            status={o3Stat.status}
            statusColor={o3Stat.color}
            sparklineData={sparkO3}
            icon={<Sparkles className="w-5 h-5 text-forest-700" />}
          />
        </div>
      </div>

      {/* Interactive Charts Section: 24h, PM2.5, Weekly Trends */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-charcoal-200/80 shadow-premium">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-charcoal-900">
              Pollution Trajectory & Analysis
            </h3>
            <p className="text-xs text-charcoal-500">
              Interactive historical telemetry for {displayCity.name}
            </p>
          </div>

          {/* Chart View Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F8FAF9] border border-charcoal-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveChartTab('24h')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeChartTab === '24h'
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-forest-800'
              }`}
            >
              24-Hour AQI Trend
            </button>
            <button
              onClick={() => setActiveChartTab('pm25')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeChartTab === 'pm25'
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-forest-800'
              }`}
            >
              PM2.5 vs PM10
            </button>
            <button
              onClick={() => setActiveChartTab('weekly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeChartTab === 'weekly'
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-forest-800'
              }`}
            >
              7-Day Daily Average
            </button>
          </div>
        </div>

        {/* Chart Rendering */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === '24h' ? (
              <AreaChart data={displayCity.hourlyTrends}>
                <defs>
                  <linearGradient id="aqiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#145C46" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#145C46" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 'auto']} />
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
                  dataKey="aqi"
                  stroke="#145C46"
                  strokeWidth={2.5}
                  fill="url(#aqiAreaGrad)"
                  name="AQI Index"
                />
              </AreaChart>
            ) : activeChartTab === 'pm25' ? (
              <AreaChart data={displayCity.hourlyTrends}>
                <defs>
                  <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="pm10Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.75rem',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pm25"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fill="url(#pm25Grad)"
                  name="PM2.5 (µg/m³)"
                />
                <Area
                  type="monotone"
                  dataKey="pm10"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#pm10Grad)"
                  name="PM10 (µg/m³)"
                />
              </AreaChart>
            ) : (
              <BarChart data={displayCity.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.75rem',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="aqi" fill="#145C46" radius={[6, 6, 0, 0]} name="Daily Avg AQI" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Health Precautions & Recently Monitored Indian Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Health Advisory Guidelines */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-forest-700" />
            <div>
              <h3 className="font-bold text-base text-charcoal-900">
                Health & Activity Precautions
              </h3>
              <p className="text-xs text-charcoal-400">
                Actionable advice tailored to {displayCity.category} AQI ({displayCity.aqi})
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-100 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-forest-700 shrink-0 mt-1.5" />
              <div>
                <span className="text-xs font-bold text-forest-900 block">General Public</span>
                <p className="text-xs text-forest-800 leading-relaxed mt-0.5">
                  {categoryInfo.adviceGeneral}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0 mt-1.5" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">Sensitive Groups</span>
                <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                  {categoryInfo.adviceSensitive}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-charcoal-200 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-charcoal-600 shrink-0 mt-1.5" />
              <div>
                <span className="text-xs font-bold text-charcoal-900 block">Outdoor Athletics & Ventilation</span>
                <p className="text-xs text-charcoal-600 leading-relaxed mt-0.5">
                  {categoryInfo.outdoorGuidance}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Monitored Cities Quick Switcher */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-charcoal-900">
                Nearby & Monitored Cities
              </h3>
              <Link
                to="/compare"
                className="text-xs font-bold text-forest-800 hover:text-forest-900"
              >
                Compare Cities &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentCities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => setSelectedCityById(city.id)}
                  className="p-3 rounded-2xl bg-[#F8FAF9] hover:bg-forest-50/70 border border-charcoal-200/70 hover:border-forest-200 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-forest-700" />
                    <div>
                      <div className="text-xs font-bold text-charcoal-900 group-hover:text-forest-800">
                        {city.name}
                      </div>
                      <div className="text-[10px] text-charcoal-400">{city.state}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-charcoal-900">
                      {city.aqi} AQI
                    </span>
                    <AQIBadge category={city.category} size="sm" />
                    <ChevronRight className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-forest-800 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-400">
            <span>15 National stations active</span>
            <Link to="/map" className="font-semibold text-forest-700 hover:underline">
              Inspect on Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

