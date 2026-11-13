import React, { useState, useMemo } from 'react';
import { 
  History, 
  MapPin, 
  Calendar, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Award,
  Sparkles
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { AQIBadge } from '../components/common/AQIBadge';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const HistoricalPage: React.FC = () => {
  const { selectedCity, setSelectedCityById, cities } = useCity();
  const [dateRange, setDateRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [selectedPollutant, setSelectedPollutant] = useState<'aqi' | 'pm25' | 'pm10' | 'no2'>('aqi');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Filter historical data according to dateRange
  const historicalData = useMemo(() => {
    if (dateRange === '7d') {
      return selectedCity.weeklyTrends;
    } else if (dateRange === '14d') {
      return selectedCity.monthlyTrends.slice(-14);
    } else {
      return selectedCity.monthlyTrends;
    }
  }, [selectedCity, dateRange]);

  // Compute pollution statistics
  const stats = useMemo(() => {
    if (!historicalData.length) return { highest: 0, lowest: 0, mean: 0, daysAbove100: 0 };
    const values = historicalData.map((d) => d[selectedPollutant]);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / values.length);
    const breachDays = historicalData.filter((d) => d.aqi > 100).length;

    const highestDay = historicalData.find((d) => d[selectedPollutant] === maxVal);
    const lowestDay = historicalData.find((d) => d[selectedPollutant] === minVal);

    return {
      highest: maxVal,
      highestDate: highestDay ? `${highestDay.date} (${highestDay.dayName})` : '',
      lowest: minVal,
      lowestDate: lowestDay ? `${lowestDay.date} (${lowestDay.dayName})` : '',
      mean: avg,
      breachDays,
    };
  }, [historicalData, selectedPollutant]);

  const pollutantConfigs = {
    aqi: { label: 'Air Quality Index (AQI)', color: '#145C46', unit: 'AQI' },
    pm25: { label: 'Fine PM2.5', color: '#EF4444', unit: 'µg/m³' },
    pm10: { label: 'Coarse PM10', color: '#F59E0B', unit: 'µg/m³' },
    no2: { label: 'Nitrogen Dioxide (NO2)', color: '#0EA5E9', unit: 'µg/m³' },
  };

  const activeConfig = pollutantConfigs[selectedPollutant];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Longitudinal Intelligence
            </span>
            <span className="text-xs bg-forest-50 text-forest-800 font-bold px-2 py-0.5 rounded-full border border-forest-200">
              CAAQMS Archived Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Historical Analysis &amp; Trends
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Analyze historical atmospheric patterns, diurnal pollution buildup, and seasonal variance.
          </p>
        </div>

        {/* City Selector */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-forest-700" />
          <select
            value={selectedCity.id}
            onChange={(e) => setSelectedCityById(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-forest-50 border border-forest-200 font-bold text-xs sm:text-sm text-forest-900 outline-none hover:bg-forest-100"
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-charcoal-200/80 shadow-subtle flex flex-wrap items-center justify-between gap-4">
        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-charcoal-400" />
          <span className="text-xs font-bold text-charcoal-700">Timeline:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F8FAF9] border border-charcoal-200">
            <button
              onClick={() => setDateRange('7d')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                dateRange === '7d' ? 'bg-forest-800 text-white shadow-xs' : 'text-charcoal-600 hover:text-forest-800'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setDateRange('14d')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                dateRange === '14d' ? 'bg-forest-800 text-white shadow-xs' : 'text-charcoal-600 hover:text-forest-800'
              }`}
            >
              Past 14 Days
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                dateRange === '30d' ? 'bg-forest-800 text-white shadow-xs' : 'text-charcoal-600 hover:text-forest-800'
              }`}
            >
              Past 30 Days
            </button>
          </div>
        </div>

        {/* Pollutant Parameter Selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-charcoal-400" />
          <span className="text-xs font-bold text-charcoal-700">Metric:</span>
          <select
            value={selectedPollutant}
            onChange={(e) => setSelectedPollutant(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-bold bg-[#F8FAF9] border border-charcoal-200 rounded-xl text-charcoal-800 outline-none"
          >
            <option value="aqi">Overall AQI</option>
            <option value="pm25">PM2.5 (Fine)</option>
            <option value="pm10">PM10 (Coarse)</option>
            <option value="no2">NO2 (Nitrogen Dioxide)</option>
          </select>
        </div>

        {/* Chart Style Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F8FAF9] border border-charcoal-200">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              chartType === 'area' ? 'bg-white text-forest-800 shadow-xs' : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Smooth Area
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              chartType === 'bar' ? 'bg-white text-forest-800 shadow-xs' : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Discrete Bars
          </button>
        </div>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider">
              Period Peak Day
            </span>
            <TrendingUp className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-red-600">
            {stats.highest} <span className="text-xs text-charcoal-400 font-normal">{activeConfig.unit}</span>
          </div>
          <span className="text-[11px] text-charcoal-500 font-medium mt-1 truncate block">
            {stats.highestDate}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider">
              Period Cleanest Day
            </span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">
            {stats.lowest} <span className="text-xs text-charcoal-400 font-normal">{activeConfig.unit}</span>
          </div>
          <span className="text-[11px] text-charcoal-500 font-medium mt-1 truncate block">
            {stats.lowestDate}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider">
              Timeline Mean
            </span>
            <Award className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-charcoal-900">
            {stats.mean} <span className="text-xs text-charcoal-400 font-normal">{activeConfig.unit}</span>
          </div>
          <span className="text-[11px] text-charcoal-500 font-medium mt-1 block">
            Average baseline concentration
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider">
              Exceedance Days
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600">
            {stats.breachDays} <span className="text-xs text-charcoal-400 font-normal">/ {historicalData.length}</span>
          </div>
          <span className="text-[11px] text-charcoal-500 font-medium mt-1 block">
            Days above Moderate standard
          </span>
        </div>
      </div>

      {/* Main Historical Chart */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-charcoal-200/80 shadow-premium">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-xl font-bold text-charcoal-900">
              {activeConfig.label} Timeline in {selectedCity.name}
            </h3>
            <p className="text-xs text-charcoal-500">
              Recorded measurements over selected {dateRange} observation window
            </p>
          </div>
          <span className="text-xs font-bold text-forest-800 bg-forest-50 px-3 py-1 rounded-xl border border-forest-200 self-start sm:self-auto">
            CPCB NAQI Calibrated
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
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
                  dataKey={selectedPollutant}
                  stroke={activeConfig.color}
                  strokeWidth={2.5}
                  fill="url(#histGrad)"
                  name={activeConfig.label}
                />
              </AreaChart>
            ) : (
              <BarChart data={historicalData}>
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
                <Bar
                  dataKey={selectedPollutant}
                  fill={activeConfig.color}
                  radius={[5, 5, 0, 0]}
                  name={activeConfig.label}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white rounded-3xl border border-charcoal-200/80 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-charcoal-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-charcoal-900">
            Historical Registry Log ({historicalData.length} Data Points)
          </h3>
          <span className="text-xs text-charcoal-400 font-mono">
            Node: IN-CAAQMS-{selectedCity.id.toUpperCase()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-charcoal-500 uppercase tracking-wider font-bold text-[11px] border-b border-charcoal-200">
              <tr>
                <th className="py-3 px-5">Observation Date</th>
                <th className="py-3 px-5">AQI Reading</th>
                <th className="py-3 px-5">CPCB Category</th>
                <th className="py-3 px-5">PM2.5 (µg/m³)</th>
                <th className="py-3 px-5">PM10 (µg/m³)</th>
                <th className="py-3 px-5">NO2 (µg/m³)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {historicalData.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="hover:bg-forest-50/40 transition-colors">
                  <td className="py-3 px-5 font-bold text-charcoal-800">
                    {row.date} ({row.dayName})
                  </td>
                  <td className="py-3 px-5 font-mono font-bold text-charcoal-900">
                    {row.aqi}
                  </td>
                  <td className="py-3 px-5">
                    <AQIBadge category={row.category} size="sm" />
                  </td>
                  <td className="py-3 px-5 font-mono">{row.pm25}</td>
                  <td className="py-3 px-5 font-mono">{row.pm10}</td>
                  <td className="py-3 px-5 font-mono">{row.no2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

