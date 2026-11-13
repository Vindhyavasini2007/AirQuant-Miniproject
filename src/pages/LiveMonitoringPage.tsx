import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  Radio, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  Filter, 
  Code2, 
  RefreshCw,
  Wind
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { AQIBadge } from '../components/common/AQIBadge';
import { CPCB_CATEGORIES } from '../data/mockData';

export const LiveMonitoringPage: React.FC = () => {
  const { selectedCity, setSelectedCityById, cities, lastSyncTime, refreshDemoData } = useCity();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshDemoData();
    setTimeout(() => setRefreshing(false), 600);
  };

  const filteredCities = cities.filter((city) => {
    if (filterCategory === 'all') return true;
    return city.category.toLowerCase() === filterCategory.toLowerCase();
  });

  const sensorRows = [
    {
      parameter: 'PM2.5',
      name: 'Fine Particulates (< 2.5 µm)',
      current: `${selectedCity.pollutants.pm25} µg/m³`,
      cpcbLimit: '60 µg/m³ (24h)',
      method: 'Beta Attenuation Monitor (BAM-1020)',
      sensorState: 'Operational',
      calibrated: '02 Nov 2026',
    },
    {
      parameter: 'PM10',
      name: 'Coarse Particulates (< 10 µm)',
      current: `${selectedCity.pollutants.pm10} µg/m³`,
      cpcbLimit: '100 µg/m³ (24h)',
      method: 'Optical Light Scattering Nephelometry',
      sensorState: 'Operational',
      calibrated: '02 Nov 2026',
    },
    {
      parameter: 'NO2',
      name: 'Nitrogen Dioxide',
      current: `${selectedCity.pollutants.no2} µg/m³`,
      cpcbLimit: '80 µg/m³ (24h)',
      method: 'Chemiluminescence Spectrometry',
      sensorState: 'Operational',
      calibrated: '15 Oct 2026',
    },
    {
      parameter: 'SO2',
      name: 'Sulphur Dioxide',
      current: `${selectedCity.pollutants.so2} µg/m³`,
      cpcbLimit: '80 µg/m³ (24h)',
      method: 'UV Pulsed Fluorescence',
      sensorState: 'Operational',
      calibrated: '15 Oct 2026',
    },
    {
      parameter: 'CO',
      name: 'Carbon Monoxide',
      current: `${selectedCity.pollutants.co} mg/m³`,
      cpcbLimit: '2.0 mg/m³ (8h)',
      method: 'Non-Dispersive Infrared (NDIR)',
      sensorState: 'Operational',
      calibrated: '28 Oct 2026',
    },
    {
      parameter: 'O3',
      name: 'Surface Ozone',
      current: `${selectedCity.pollutants.o3} µg/m³`,
      cpcbLimit: '100 µg/m³ (8h)',
      method: 'UV Photometric Absorption',
      sensorState: 'Operational',
      calibrated: '28 Oct 2026',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              CAAQMS Real-Time Telemetry
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Live Station Telemetry Stream
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            High-frequency continuous ambient sensor monitoring for Indian municipal networks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowJsonModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#F8FAF9] hover:bg-charcoal-100 border border-charcoal-200 text-charcoal-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-forest-700" />
            Inspect Telemetry Payload
          </button>
          <button
            onClick={handleRefresh}
            className={`px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all ${
              refreshing ? 'opacity-80' : ''
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${refreshing ? 'animate-spin' : ''}`} />
            Re-Poll Stream
          </button>
        </div>
      </div>

      {/* Network Health & Protocol Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-charcoal-200/80 shadow-subtle">
          <span className="text-xs text-charcoal-500 font-medium block">Station Node</span>
          <div className="text-base font-extrabold text-charcoal-900 mt-1 truncate">
            {selectedCity.name} CAAQMS
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <Radio className="w-3 h-3 animate-pulse" /> Stream Online
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-charcoal-200/80 shadow-subtle">
          <span className="text-xs text-charcoal-500 font-medium block">Transmission Rate</span>
          <div className="text-base font-extrabold text-charcoal-900 mt-1 font-mono">
            Every 15 Minutes
          </div>
          <span className="text-[10px] text-charcoal-400 font-medium block mt-1">
            MQTT / TLS v1.3 Protocol
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-charcoal-200/80 shadow-subtle">
          <span className="text-xs text-charcoal-500 font-medium block">Active Telemetry Sync</span>
          <div className="text-base font-extrabold text-charcoal-900 mt-1 font-mono">
            {lastSyncTime}
          </div>
          <span className="text-[10px] text-charcoal-400 font-medium block mt-1">
            Zero packet drops (Simulated)
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-charcoal-200/80 shadow-subtle">
          <span className="text-xs text-charcoal-500 font-medium block">Data Quality Index</span>
          <div className="text-base font-extrabold text-forest-800 mt-1 font-mono">
            99.8% Valid
          </div>
          <span className="text-[10px] text-forest-700 font-medium block mt-1">
            ISO 17025 Certified Standards
          </span>
        </div>
      </div>

      {/* Sensor Calibration & Diagnostics Table */}
      <div className="bg-white rounded-3xl border border-charcoal-200/80 shadow-subtle overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-charcoal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-lg text-charcoal-900">
              {selectedCity.monitoringStation}
            </h3>
            <p className="text-xs text-charcoal-500">
              Coordinates: {selectedCity.coordinates[0].toFixed(4)}° N, {selectedCity.coordinates[1].toFixed(4)}° E • CPCB Continuous Ambient Network
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-charcoal-600">Switch Station:</span>
            <select
              value={selectedCity.id}
              onChange={(e) => setSelectedCityById(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-forest-50 border border-forest-200 text-forest-900 outline-none"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-charcoal-500 uppercase tracking-wider font-bold text-[11px] border-b border-charcoal-200">
              <tr>
                <th className="py-3 px-5">Pollutant Parameter</th>
                <th className="py-3 px-5">Observed Concentration</th>
                <th className="py-3 px-5">CPCB Safe Standard</th>
                <th className="py-3 px-5">Measurement Instrument</th>
                <th className="py-3 px-5">Sensor Health</th>
                <th className="py-3 px-5">Last Zero-Span Calibration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {sensorRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-forest-50/40 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-extrabold text-charcoal-900 text-sm">
                      {row.parameter}
                    </div>
                    <div className="text-[11px] text-charcoal-400">{row.name}</div>
                  </td>
                  <td className="py-3.5 px-5 font-mono font-extrabold text-sm text-charcoal-900">
                    {row.current}
                  </td>
                  <td className="py-3.5 px-5 font-medium text-charcoal-600">
                    {row.cpcbLimit}
                  </td>
                  <td className="py-3.5 px-5 text-charcoal-600">
                    {row.method}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {row.sensorState}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-charcoal-500 text-[11px]">
                    {row.calibrated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid of all 15 Indian Stations with live AQI status */}
      <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-bold text-lg text-charcoal-900">
              National Station Network Telemetry
            </h3>
            <p className="text-xs text-charcoal-500">
              Filter by CPCB air quality severity category
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-charcoal-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-charcoal-200 bg-[#F8FAF9] outline-none"
            >
              <option value="all">All Categories ({cities.length})</option>
              <option value="good">Good (0-50)</option>
              <option value="satisfactory">Satisfactory (51-100)</option>
              <option value="moderate">Moderate (101-200)</option>
              <option value="poor">Poor (201-300)</option>
              <option value="very poor">Very Poor (301-400)</option>
              <option value="severe">Severe (401-500)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCities.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCityById(c.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedCity.id === c.id
                  ? 'bg-forest-50/80 border-forest-400 shadow-sm ring-1 ring-forest-400'
                  : 'bg-[#F8FAF9] border-charcoal-200/80 hover:border-forest-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Wind className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-charcoal-900">{c.name}</h4>
                  <p className="text-[11px] text-charcoal-400 truncate max-w-[140px]">
                    {c.state}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold font-mono text-charcoal-900">
                  {c.aqi} AQI
                </span>
                <div className="mt-0.5">
                  <AQIBadge category={c.category} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JSON Payload Inspector Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal-900 text-forest-100 rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-charcoal-700 animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-charcoal-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm text-white font-mono">
                  CAAQMS Raw Ingestion Telemetry Stream [DEMO PAYLOAD]
                </h4>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-charcoal-400 hover:text-white text-xs font-bold px-2 py-1 rounded bg-charcoal-800"
              >
                Close (ESC)
              </button>
            </div>

            <div className="p-5 overflow-y-auto font-mono text-xs text-emerald-300 bg-charcoal-950 flex-1">
              <pre>
{JSON.stringify(
  {
    stationId: `IN-CAAQMS-${selectedCity.id.toUpperCase()}-01`,
    timestamp: new Date().toISOString(),
    stationName: selectedCity.monitoringStation,
    geoCoordinates: {
      latitude: selectedCity.coordinates[0],
      longitude: selectedCity.coordinates[1],
      elevationMeters: 218,
    },
    telemetry: {
      aqiCalculated: selectedCity.aqi,
      cpcbCategory: selectedCity.category,
      dominantPollutant: selectedCity.dominantPollutant,
      pollutants: selectedCity.pollutants,
      meteorology: selectedCity.weather,
    },
    telemetryQuality: {
      signalStrengthDbm: -68,
      crcChecksum: '0x8F4A2B',
      status: 'VERIFIED_CALIBRATED_SAMPLE',
    },
    demoNotice: 'SIMULATED DATA FOR AIRQUANT DEMO EVALUATION',
  },
  null,
  2
)}
              </pre>
            </div>

            <div className="p-4 border-t border-charcoal-800 bg-charcoal-900 flex justify-between items-center text-xs text-charcoal-400">
              <span>Standard schema: OpenAQ / CPCB India Protocol</span>
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

