import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Bell, 
  ChevronDown, 
  Sparkles, 
  RefreshCw, 
  Menu,
  Activity,
  Wind
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { AQIBadge } from '../common/AQIBadge';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { 
    selectedCity, 
    setSelectedCityById, 
    cities, 
    alerts,
    lastSyncTime,
    refreshDemoData 
  } = useCity();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter cities by search term
  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (id: string) => {
    setSelectedCityById(id);
    setSearchOpen(false);
    setSearchTerm('');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshDemoData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-charcoal-200/80 px-4 sm:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Brand / Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-charcoal-600 hover:text-forest-800 hover:bg-forest-50 focus:outline-none transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-white shadow-sm group-hover:bg-forest-900 transition-colors">
              <Wind className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-forest-800">
                  AirQuant
                </span>
                <span className="text-[10px] bg-forest-100 text-forest-800 font-bold px-1.5 py-0.5 rounded">
                  DEMO
                </span>
              </div>
              <p className="text-[10px] text-charcoal-400 font-medium -mt-0.5">
                Understand Air. Predict Tomorrow.
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Global City Search with Instant Typeahead */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Indian city (e.g. Ghaziabad, Delhi, Mumbai)..."
              value={searchTerm}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchOpen(true);
              }}
              className="w-full bg-[#F8FAF9] hover:bg-charcoal-50 focus:bg-white text-xs sm:text-sm pl-10 pr-10 py-2 rounded-xl border border-charcoal-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-100 outline-none transition-all placeholder:text-charcoal-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {searchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-elevated border border-charcoal-200/90 py-2 max-h-80 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold text-charcoal-400 uppercase tracking-wider flex justify-between items-center">
                <span>Indian Continuous Monitoring Stations</span>
                <span className="text-forest-700 font-medium">15 Cities</span>
              </div>
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelectCity(city.id)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-forest-50/70 transition-colors ${
                      selectedCity.id === city.id ? 'bg-forest-50 font-medium' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-forest-700 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-charcoal-900">
                          {city.name}
                        </div>
                        <div className="text-xs text-charcoal-400">{city.state}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-charcoal-800">
                        {city.aqi} AQI
                      </span>
                      <AQIBadge category={city.category} size="sm" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-charcoal-500">
                  No cities found matching &quot;{searchTerm}&quot;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: City Pill, Refresh, Alerts, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Current City Selector Pill */}
          <div className="relative group">
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-50 hover:bg-forest-100 border border-forest-200 rounded-xl text-forest-900 text-xs font-semibold transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-forest-700" />
              <span className="max-w-[100px] sm:max-w-[130px] truncate">
                {selectedCity.name}
              </span>
              <ChevronDown className="w-3 h-3 text-forest-600" />
            </button>
          </div>

          {/* Quick Refresh Stream Button */}
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl text-charcoal-500 hover:text-forest-800 hover:bg-forest-50 border border-charcoal-200 transition-all ${
              isRefreshing ? 'animate-spin text-forest-700' : ''
            }`}
            title={`Last sync: ${lastSyncTime}. Click to re-sync demo telemetry.`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Notifications / Alerts Drawer */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="p-2 rounded-xl text-charcoal-500 hover:text-forest-800 hover:bg-forest-50 border border-charcoal-200 relative transition-colors"
              title="Air Quality Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {alerts.filter((a) => a.isActive).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-elevated border border-charcoal-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 pb-2 border-b border-charcoal-100 flex items-center justify-between">
                  <div className="font-bold text-sm text-charcoal-900 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-forest-700" />
                    Simulated Alerts
                  </div>
                  <span className="text-[10px] bg-charcoal-100 text-charcoal-600 font-bold px-1.5 py-0.5 rounded">
                    {alerts.filter((a) => a.isActive).length} Active
                  </span>
                </div>

                <div className="divide-y divide-charcoal-100 max-h-64 overflow-y-auto">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-3 hover:bg-[#F8FAF9] transition-colors text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-charcoal-800">{alert.cityName}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            alert.isActive
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-charcoal-100 text-charcoal-500'
                          }`}
                        >
                          {alert.isActive ? `Threshold > ${alert.threshold}` : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-charcoal-500 mt-1 text-[11px]">
                        {alert.lastTriggered ? `Last: ${alert.lastTriggered}` : 'No recent breach'}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-charcoal-100 bg-[#F8FAF9]/50 text-center">
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate('/alerts');
                    }}
                    className="text-xs font-semibold text-forest-800 hover:text-forest-900 hover:underline"
                  >
                    Manage Notification Triggers &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Evaluator Badge */}
          <div className="flex items-center gap-2 pl-1 border-l border-charcoal-200">
            <div className="w-8 h-8 rounded-full bg-forest-800 text-white font-bold text-xs flex items-center justify-center ring-2 ring-forest-100 shadow-sm">
              AQ
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-charcoal-900 leading-tight">Faculty Review</div>
              <div className="text-[10px] text-charcoal-500 font-medium">Evaluation Demo</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

