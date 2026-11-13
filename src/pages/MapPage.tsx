import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Search, 
  Filter, 
  Wind, 
  Gauge, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { AQIBadge } from '../components/common/AQIBadge';
import { getCategoryForAQI, CPCB_CATEGORIES } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

// Component to pan map when a city is selected
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

export const MapPage: React.FC = () => {
  const { cities, selectedCity, setSelectedCity } = useCity();
  const navigate = useNavigate();

  const [mapSearch, setMapSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Extract unique states for filter
  const uniqueStates = useMemo(() => {
    return Array.from(new Set(cities.map((c) => c.state))).sort();
  }, [cities]);

  // Filter cities based on search, state, and category
  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      const matchSearch =
        city.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
        city.state.toLowerCase().includes(mapSearch.toLowerCase());
      const matchState = selectedState === 'all' || city.state === selectedState;
      const matchCat =
        selectedCategory === 'all' ||
        city.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchState && matchCat;
    });
  }, [cities, mapSearch, selectedState, selectedCategory]);

  // Center of India
  const defaultCenter: [number, number] = [21.7679, 78.8718];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(5);

  const handleCitySelect = (city: typeof cities[0]) => {
    setSelectedCity(city);
    setMapCenter(city.coordinates);
    setMapZoom(9);
  };

  // Helper to create a custom HTML pin with AQI number
  const createMarkerIcon = (aqi: number) => {
    const cat = getCategoryForAQI(aqi);
    return L.divIcon({
      className: 'custom-map-marker-pin',
      html: `
        <div style="
          background-color: ${cat.color}; 
          width: 36px; 
          height: 36px; 
          border-radius: 9999px; 
          border: 2.5px solid white; 
          box-shadow: 0 4px 16px rgba(0,0,0,0.35); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: white; 
          font-weight: 800; 
          font-size: 11px; 
          font-family: monospace;
          cursor: pointer;
        ">
          ${aqi}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Geospatial Telemetry
            </span>
            <span className="text-xs bg-forest-50 text-forest-800 font-bold px-2 py-0.5 rounded-full border border-forest-200">
              15 Verified Stations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            India Ambient Air Quality Map
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Interactive OpenStreetMap visualization with live color-coded CPCB index breakpoints.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search station or state..."
              value={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs font-medium bg-[#F8FAF9] border border-charcoal-200 rounded-xl outline-none focus:border-forest-600 focus:bg-white transition-all w-44 sm:w-56"
            />
          </div>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-[#F8FAF9] border border-charcoal-200 rounded-xl text-charcoal-700 outline-none hover:bg-charcoal-50"
          >
            <option value="all">All States ({uniqueStates.length})</option>
            {uniqueStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-[#F8FAF9] border border-charcoal-200 rounded-xl text-charcoal-700 outline-none hover:bg-charcoal-50"
          >
            <option value="all">All AQI Levels</option>
            <option value="good">Good (0-50)</option>
            <option value="satisfactory">Satisfactory (51-100)</option>
            <option value="moderate">Moderate (101-200)</option>
            <option value="poor">Poor (201-300)</option>
            <option value="very poor">Very Poor (301-400)</option>
            <option value="severe">Severe (401-500)</option>
          </select>

          {/* Reset Zoom Button */}
          <button
            onClick={() => {
              setMapCenter(defaultCenter);
              setMapZoom(5);
            }}
            className="px-3 py-1.5 text-xs font-bold text-forest-800 bg-forest-50 hover:bg-forest-100 border border-forest-200 rounded-xl transition-colors"
          >
            Reset India View
          </button>
        </div>
      </div>

      {/* Main Map + Selected City Panel Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Canvas (70% width on desktop) */}
        <div className="lg:col-span-8 bg-white p-3 rounded-3xl border border-charcoal-200/80 shadow-premium relative">
          <div className="h-[550px] w-full rounded-2xl overflow-hidden relative">
            <MapContainer
              center={defaultCenter}
              zoom={5}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <MapUpdater center={mapCenter} zoom={mapZoom} />
              
              {/* Clean OpenStreetMap CartoDB Positron style tile layer for high-end SaaS elegance */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredCities.map((city) => (
                <Marker
                  key={city.id}
                  position={city.coordinates}
                  icon={createMarkerIcon(city.aqi)}
                  eventHandlers={{
                    click: () => {
                      setSelectedCity(city);
                    },
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-1 max-w-[200px] text-charcoal-900 font-sans">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-extrabold text-sm">{city.name}</span>
                        <AQIBadge category={city.category} size="sm" />
                      </div>
                      <div className="text-[10px] text-charcoal-500 mb-2 truncate">
                        {city.state}
                      </div>

                      <div className="bg-[#F8FAF9] p-2 rounded-lg border border-charcoal-200 mb-2 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-charcoal-500">AQI:</span>
                          <span className="font-bold font-mono">{city.aqi}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-charcoal-500">PM2.5:</span>
                          <span className="font-bold">{city.pollutants.pm25} µg/m³</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-charcoal-500">PM10:</span>
                          <span className="font-bold">{city.pollutants.pm10} µg/m³</span>
                        </div>
                      </div>

                      <div className="text-[9px] text-charcoal-400 mb-2">
                        Updated: {city.lastUpdated}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCity(city);
                          navigate('/dashboard');
                        }}
                        className="w-full py-1 text-center bg-forest-800 text-white rounded text-[11px] font-bold hover:bg-forest-900 transition-colors"
                      >
                        Open Dashboard &rarr;
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* In-Map Floating Legend */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-charcoal-200 shadow-elevated text-xs max-w-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1.5">
                CPCB AQI Category Legend
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>0-50 Good</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime-500" />
                  <span>51-100 Satisfactory</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>101-200 Moderate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>201-300 Poor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>301-400 Very Poor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-900" />
                  <span>401-500 Severe</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected City Detailed Side Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-premium">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700">
                  Inspected Station
                </span>
                <h3 className="text-xl font-extrabold text-charcoal-900 flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-forest-700" />
                  {selectedCity.name}
                </h3>
                <span className="text-xs text-charcoal-400">{selectedCity.state}</span>
              </div>
              <AQIBadge category={selectedCity.category} size="lg" />
            </div>

            {/* AQI Overview Box */}
            <div className="my-5 p-4 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs text-charcoal-500 font-medium block">AQI Index</span>
                <span className="text-4xl font-black font-mono text-charcoal-900">
                  {selectedCity.aqi}
                </span>
                <span className="text-[10px] text-charcoal-400 font-medium block mt-0.5">
                  Scale 0–500 CPCB NAQI
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-charcoal-500 font-medium block">Dominant Gas</span>
                <span className="text-base font-bold text-forest-800">
                  {selectedCity.dominantPollutant}
                </span>
                <span className="text-[10px] text-amber-700 block font-semibold">
                  Primary Risk
                </span>
              </div>
            </div>

            {/* Pollutants Breakdown List */}
            <div className="space-y-2 mb-5">
              <span className="text-xs font-bold text-charcoal-900 block mb-1">
                Criteria Pollutant Levels
              </span>
              <div className="flex justify-between items-center text-xs p-2 rounded-xl bg-charcoal-50/70">
                <span className="text-charcoal-600 font-medium">PM2.5 (Fine dust)</span>
                <span className="font-bold font-mono text-charcoal-900">
                  {selectedCity.pollutants.pm25} µg/m³
                </span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 rounded-xl bg-charcoal-50/70">
                <span className="text-charcoal-600 font-medium">PM10 (Coarse dust)</span>
                <span className="font-bold font-mono text-charcoal-900">
                  {selectedCity.pollutants.pm10} µg/m³
                </span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 rounded-xl bg-charcoal-50/70">
                <span className="text-charcoal-600 font-medium">NO2 (Vehicular)</span>
                <span className="font-bold font-mono text-charcoal-900">
                  {selectedCity.pollutants.no2} µg/m³
                </span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 rounded-xl bg-charcoal-50/70">
                <span className="text-charcoal-600 font-medium">SO2 (Industrial)</span>
                <span className="font-bold font-mono text-charcoal-900">
                  {selectedCity.pollutants.so2} µg/m³
                </span>
              </div>
            </div>

            {/* Station Metadata & Link to Dashboard */}
            <div className="text-xs text-charcoal-500 space-y-1.5 pt-4 border-t border-charcoal-100">
              <div className="flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                <span>Station: {selectedCity.monitoringStation}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-charcoal-400 shrink-0" />
                <span>Last Updated: {selectedCity.lastUpdated}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="mt-5 w-full py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              Analyze {selectedCity.name} on Dashboard
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          {/* Quick Click City List */}
          <div className="bg-white p-5 rounded-3xl border border-charcoal-200/80 shadow-subtle max-h-56 overflow-y-auto">
            <span className="text-xs font-bold text-charcoal-900 block mb-2.5">
              Jump to City Pin ({filteredCities.length})
            </span>
            <div className="space-y-1.5">
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    selectedCity.id === city.id
                      ? 'bg-forest-100/70 font-bold text-forest-900'
                      : 'hover:bg-charcoal-50 text-charcoal-700'
                  }`}
                >
                  <span className="truncate">{city.name}</span>
                  <span className="font-mono text-charcoal-500 font-semibold">{city.aqi} AQI</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

