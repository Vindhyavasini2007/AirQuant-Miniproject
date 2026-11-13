import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Volume2
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { AQIBadge } from '../components/common/AQIBadge';
import { getCategoryForAQI } from '../data/mockData';

export const AlertsPage: React.FC = () => {
  const { cities, alerts, addAlert, toggleAlert, deleteAlert } = useCity();

  // Form State for creating a new alert
  const [cityId, setCityId] = useState(cities[0].id);
  const [threshold, setThreshold] = useState<number>(200);
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [notificationType, setNotificationType] = useState<'push' | 'email' | 'sms'>('push');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const city = cities.find((c) => c.id === cityId);
    if (!city) return;

    addAlert({
      cityId: city.id,
      cityName: city.name,
      threshold,
      condition,
      isActive: true,
      notificationType,
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const previewCategory = getCategoryForAQI(threshold);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Threshold Watchdog
            </span>
            <span className="text-xs bg-forest-50 text-forest-800 font-bold px-2 py-0.5 rounded-full border border-forest-200">
              Interactive Demo Trigger Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Air Quality Notification Triggers
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-2xl">
            Configure automated alerts triggered when ambient criteria AQI breaches specified levels.
          </p>
        </div>

        <div className="text-xs text-charcoal-500 font-medium bg-[#F8FAF9] p-3 rounded-2xl border border-charcoal-200">
          <span className="font-bold text-forest-800 block">Simulated Demo Mode:</span>
          <span>Notifications trigger local toast &amp; status logs. Persisted in localStorage.</span>
        </div>
      </div>

      {showSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Alert successfully configured and persisted to browser local storage.</span>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Layout: Left Create Alert Form, Right Active Alerts List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Create Alert Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-premium">
          <div className="flex items-center gap-2 pb-4 mb-5 border-b border-charcoal-100">
            <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-charcoal-900">
                Create Air Quality Alert
              </h3>
              <p className="text-xs text-charcoal-400">Set criteria triggers for any Indian city</p>
            </div>
          </div>

          <form onSubmit={handleCreateAlert} className="space-y-4">
            {/* City Selection */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Target Indian City
              </label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-charcoal-200 outline-none focus:border-forest-600"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} ({city.state}) — Current: {city.aqi} AQI
                  </option>
                ))}
              </select>
            </div>

            {/* Condition: Above or Below */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Trigger Condition
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('above')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    condition === 'above'
                      ? 'bg-forest-800 text-white border-forest-800'
                      : 'bg-[#F8FAF9] text-charcoal-600 border-charcoal-200'
                  }`}
                >
                  AQI Exceeds (&gt;)
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('below')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    condition === 'below'
                      ? 'bg-forest-800 text-white border-forest-800'
                      : 'bg-[#F8FAF9] text-charcoal-600 border-charcoal-200'
                  }`}
                >
                  AQI Drops Below (&lt;)
                </button>
              </div>
            </div>

            {/* Threshold Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-charcoal-700">
                  AQI Threshold Value
                </label>
                <span className="text-base font-extrabold font-mono text-forest-800">
                  {threshold} AQI
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="450"
                step="10"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-forest-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-charcoal-400 mt-1">
                <span>30 (Good)</span>
                <span>200 (Moderate/Poor)</span>
                <span>450 (Severe)</span>
              </div>
            </div>

            {/* Threshold Preview Badge */}
            <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/70 flex items-center justify-between text-xs">
              <span className="text-charcoal-600 font-medium">Trigger Severity Band:</span>
              <AQIBadge category={previewCategory.category} size="sm" />
            </div>

            {/* Notification Channel */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Dispatch Channel
              </label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value as any)}
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-charcoal-200 outline-none"
              >
                <option value="push">Browser Push Notification (Simulated)</option>
                <option value="email">Emergency Email Digest (Simulated)</option>
                <option value="sms">SMS / WhatsApp Alert (Simulated)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-premium hover:shadow-elevated transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              Save Alert Rule
            </button>
          </form>
        </div>

        {/* Right: Active Alerts & Trigger History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Rules List */}
          <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-charcoal-100">
              <div>
                <h3 className="font-bold text-base text-charcoal-900">
                  Configured Triggers ({alerts.length})
                </h3>
                <p className="text-xs text-charcoal-400">
                  Toggle on/off or remove watchdog listeners
                </p>
              </div>
              <span className="text-xs font-bold text-forest-800 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200">
                {alerts.filter((a) => a.isActive).length} Armed
              </span>
            </div>

            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      alert.isActive
                        ? 'bg-white border-charcoal-200/80 shadow-xs'
                        : 'bg-[#F8FAF9] border-charcoal-200/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className="text-forest-700 hover:text-forest-900 transition-colors"
                        title={alert.isActive ? 'Disable alert' : 'Enable alert'}
                      >
                        {alert.isActive ? (
                          <ToggleRight className="w-7 h-7 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-7 h-7 text-charcoal-400" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-charcoal-900">
                            {alert.cityName}
                          </h4>
                          <span className="text-[10px] font-mono font-bold bg-charcoal-100 text-charcoal-700 px-2 py-0.5 rounded">
                            {alert.condition.toUpperCase()} {alert.threshold} AQI
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-400 mt-0.5">
                          Channel: {alert.notificationType.toUpperCase()} • Created: {alert.createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          alert.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-charcoal-100 text-charcoal-500'
                        }`}
                      >
                        {alert.isActive ? 'Active' : 'Disabled'}
                      </span>

                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-1.5 rounded-lg text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-charcoal-500">
                No alerts configured. Use the form on the left to set up a new alert rule.
              </div>
            )}
          </div>

          {/* Simulated Dispatch History Log */}
          <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
            <h3 className="font-bold text-base text-charcoal-900 mb-1">
              Simulated Dispatch History
            </h3>
            <p className="text-xs text-charcoal-500 mb-4">
              Recent automated triggers based on simulated CAAQMS telemetry streams.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start justify-between text-xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-charcoal-900 block">
                      Delhi Anand Vihar CAAQMS: AQI reached 248 (&gt; 200 threshold)
                    </span>
                    <span className="text-[11px] text-charcoal-500">
                      Dispatched simulated Emergency Push Notification to 1,420 registered users.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-charcoal-400 font-mono shrink-0">
                  Today 07:30
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-charcoal-200 flex items-start justify-between text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-charcoal-900 block">
                      Ghaziabad Vasundhara: Forecast inversion alert
                    </span>
                    <span className="text-[11px] text-charcoal-500">
                      Predicted peak (240 AQI) expected at 04:00 Dawn. Advisory issued.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-charcoal-400 font-mono shrink-0">
                  Yesterday 20:15
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

