import React from 'react';
import { 
  GitCompare, 
  MapPin, 
  Award, 
  AlertTriangle, 
  Check, 
  Plus, 
  X,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { AQIBadge } from '../components/common/AQIBadge';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const ComparisonPage: React.FC = () => {
  const { cities, comparisonCityIds, toggleComparisonCity, setSelectedCityById } = useCity();

  // Get active comparison city objects
  const activeCities = cities.filter((c) => comparisonCityIds.includes(c.id));

  // Sort cities by AQI (cleanest to most polluted)
  const rankedCities = [...activeCities].sort((a, b) => a.aqi - b.aqi);

  // Bar chart data comparing AQI, PM2.5, and PM10
  const barChartData = activeCities.map((city) => ({
    name: city.name,
    AQI: city.aqi,
    'PM2.5': city.pollutants.pm25,
    'PM10': city.pollutants.pm10,
    Predicted_24h: city.predictions24h[city.predictions24h.length - 1]?.predictedAqi || city.aqi,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Cross-Metropolitan Benchmarking
            </span>
            <span className="text-xs bg-forest-50 text-forest-800 font-bold px-2 py-0.5 rounded-full border border-forest-200">
              {activeCities.length} Cities Selected (Max 6)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Inter-City Air Quality Comparison
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Compare pollution severity, criteria particulates, and predicted trajectories across Indian cities.
          </p>
        </div>
      </div>

      {/* City Selection Pills Drawer */}
      <div className="bg-white p-5 rounded-3xl border border-charcoal-200/80 shadow-subtle">
        <span className="text-xs font-bold text-charcoal-900 block mb-3">
          Select Cities to Compare (Minimum 2, Maximum 6):
        </span>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => {
            const isSelected = comparisonCityIds.includes(city.id);
            return (
              <button
                key={city.id}
                onClick={() => toggleComparisonCity(city.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'bg-[#F8FAF9] text-charcoal-700 border border-charcoal-200 hover:bg-forest-50'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5 text-charcoal-400" />}
                <span>{city.name}</span>
                <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-forest-900 text-forest-200' : 'bg-charcoal-200 text-charcoal-600'}`}>
                  {city.aqi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Bar Chart */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-charcoal-200/80 shadow-premium">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-xl font-bold text-charcoal-900">
              Pollutant Index & Particulate Comparison
            </h3>
            <p className="text-xs text-charcoal-500">
              Comparing Observed AQI, PM2.5, PM10, and Next-24h Predicted Values
            </p>
          </div>
          <span className="text-xs font-bold text-forest-800 bg-forest-50 px-3 py-1 rounded-xl border border-forest-200 self-start sm:self-auto">
            CPCB Comparative Breakdown
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
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
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="AQI" fill="#145C46" radius={[4, 4, 0, 0]} name="Current AQI" />
              <Bar dataKey="Predicted_24h" fill="#10B981" radius={[4, 4, 0, 0]} name="AI Predicted 24h" />
              <Bar dataKey="PM2.5" fill="#EF4444" radius={[4, 4, 0, 0]} name="PM2.5 (µg/m³)" />
              <Bar dataKey="PM10" fill="#F59E0B" radius={[4, 4, 0, 0]} name="PM10 (µg/m³)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cleanest to Most Polluted Ranking Leaderboard */}
      <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
        <h3 className="font-bold text-lg text-charcoal-900 mb-1">
          City Atmospheric Severity Ranking
        </h3>
        <p className="text-xs text-charcoal-500 mb-5">
          Sorted from cleanest air (lowest AQI) to most hazardous (highest AQI).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rankedCities.map((city, idx) => (
            <div
              key={city.id}
              onClick={() => setSelectedCityById(city.id)}
              className="p-4 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 hover:border-forest-300 hover:bg-white hover:shadow-subtle transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    idx === 0
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : idx === rankedCities.length - 1
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-charcoal-200 text-charcoal-700'
                  }`}
                >
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-charcoal-900">{city.name}</h4>
                  <p className="text-[11px] text-charcoal-400">{city.state}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-extrabold font-mono text-charcoal-900">
                  {city.aqi} AQI
                </span>
                <div className="mt-0.5">
                  <AQIBadge category={city.category} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Metric Comparison Table */}
      <div className="bg-white rounded-3xl border border-charcoal-200/80 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-charcoal-100">
          <h3 className="font-bold text-base text-charcoal-900">
            Multi-Parameter Comparative Table
          </h3>
          <p className="text-xs text-charcoal-500">
            Direct side-by-side criteria pollutants and predictive metrics
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-charcoal-500 uppercase tracking-wider font-bold text-[11px] border-b border-charcoal-200">
              <tr>
                <th className="py-3 px-5">City &amp; State</th>
                <th className="py-3 px-5">Observed AQI</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">PM2.5 (µg/m³)</th>
                <th className="py-3 px-5">PM10 (µg/m³)</th>
                <th className="py-3 px-5">NO2 (µg/m³)</th>
                <th className="py-3 px-5">SO2 (µg/m³)</th>
                <th className="py-3 px-5">AI 24h Forecast</th>
                <th className="py-3 px-5">Dominant Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {activeCities.map((city) => (
                <tr key={city.id} className="hover:bg-forest-50/40 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-extrabold text-charcoal-900 text-sm">
                      {city.name}
                    </div>
                    <div className="text-[11px] text-charcoal-400">{city.state}</div>
                  </td>
                  <td className="py-3.5 px-5 font-mono font-extrabold text-base text-charcoal-900">
                    {city.aqi}
                  </td>
                  <td className="py-3.5 px-5">
                    <AQIBadge category={city.category} size="sm" />
                  </td>
                  <td className="py-3.5 px-5 font-mono font-bold text-charcoal-800">
                    {city.pollutants.pm25}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-charcoal-800">
                    {city.pollutants.pm10}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-charcoal-800">
                    {city.pollutants.no2}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-charcoal-800">
                    {city.pollutants.so2}
                  </td>
                  <td className="py-3.5 px-5 font-mono font-bold text-forest-800">
                    {city.predictions24h[city.predictions24h.length - 1]?.predictedAqi || city.aqi} AQI
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-charcoal-700 bg-charcoal-100 px-2 py-0.5 rounded text-[11px]">
                      {city.dominantPollutant}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

