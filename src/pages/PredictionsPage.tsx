import React, { useState } from 'react';
import { 
  TrendingUp, 
  Cpu, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BarChart2, 
  MapPin, 
  HelpCircle,
  Database,
  Sliders,
  Filter,
  Check
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { AQIBadge } from '../components/common/AQIBadge';
import { ML_MODELS_DEMO, getCategoryForAQI } from '../data/mockData';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  BarChart, 
  Bar 
} from 'recharts';

export const PredictionsPage: React.FC = () => {
  const { selectedCity, setSelectedCityById, cities } = useCity();
  const [selectedHorizon, setSelectedHorizon] = useState<'24h' | '3d' | '7d'>('24h');
  const [selectedModelKey, setSelectedModelKey] = useState<'xgb' | 'rf' | 'gb'>('xgb');

  // Multi-horizon forecast data preparation
  const forecastChartData = [
    { label: 'T-6h (Past)', observed: Math.round(selectedCity.aqi * 1.05), forecast: null, lower: null, upper: null },
    { label: 'T-4h (Past)', observed: Math.round(selectedCity.aqi * 1.02), forecast: null, lower: null, upper: null },
    { label: 'T-2h (Past)', observed: Math.round(selectedCity.aqi * 0.98), forecast: null, lower: null, upper: null },
    { label: 'Now (Observed)', observed: selectedCity.aqi, forecast: selectedCity.aqi, lower: selectedCity.aqi - 5, upper: selectedCity.aqi + 5 },
    { label: '+2h', observed: null, forecast: Math.round(selectedCity.aqi * 0.96), lower: Math.round(selectedCity.aqi * 0.90), upper: Math.round(selectedCity.aqi * 1.02) },
    { label: '+6h', observed: null, forecast: Math.round(selectedCity.aqi * 1.06), lower: Math.round(selectedCity.aqi * 0.97), upper: Math.round(selectedCity.aqi * 1.15) },
    { label: '+12h', observed: null, forecast: Math.round(selectedCity.aqi * 1.14), lower: Math.round(selectedCity.aqi * 1.04), upper: Math.round(selectedCity.aqi * 1.24) },
    { label: '+18h', observed: null, forecast: Math.round(selectedCity.aqi * 1.18), lower: Math.round(selectedCity.aqi * 1.06), upper: Math.round(selectedCity.aqi * 1.30) },
    { label: '+24h', observed: null, forecast: Math.round(selectedCity.aqi * 1.02), lower: Math.round(selectedCity.aqi * 0.90), upper: Math.round(selectedCity.aqi * 1.14) },
  ];

  const sevenDayChartData = selectedCity.predictions7d.map((d) => ({
    label: d.label,
    forecast: d.predictedAqi,
    lower: d.confidenceLower,
    upper: d.confidenceUpper,
  }));

  const activeChartData = selectedHorizon === '7d' ? sevenDayChartData : forecastChartData;

  const currentModel = ML_MODELS_DEMO.find((m) => m.modelKey === selectedModelKey) || ML_MODELS_DEMO[2];

  // Benchmark comparison chart data for ML cards
  const benchmarkComparison = [
    { name: 'Random Forest', MAE: 14.8, RMSE: 21.3, R2_Pct: 88.4 },
    { name: 'Gradient Boost', MAE: 12.6, RMSE: 18.1, R2_Pct: 91.6 },
    { name: 'XGBoost (Selected)', MAE: 10.4, RMSE: 15.2, R2_Pct: 94.2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Atmospheric Forecasting Engine
            </span>
            <span className="text-xs bg-forest-100 text-forest-800 font-bold px-2 py-0.5 rounded-full">
              Simulated Predictions
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Predicting Tomorrow&apos;s Air
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-2xl">
            Machine learning-powered air quality forecasting for Indian cities calibrated on meteorological inversion and criteria pollutants.
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

      {/* Top Metrics Cards: Current AQI vs Next 24h & 7d predicted */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider block">
            Observed AQI Now
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black font-mono text-charcoal-900">
              {selectedCity.aqi}
            </span>
            <span className="text-xs text-charcoal-400 font-medium">NAQI</span>
          </div>
          <div className="mt-2">
            <AQIBadge category={selectedCity.category} size="sm" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider block">
            Predicted 24h Average
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black font-mono text-forest-800">
              {selectedCity.predictions24h[selectedCity.predictions24h.length - 1]?.predictedAqi || 184}
            </span>
            <span className="text-xs text-charcoal-400 font-medium">AQI</span>
          </div>
          <div className="mt-2">
            <AQIBadge
              category={
                getCategoryForAQI(
                  selectedCity.predictions24h[selectedCity.predictions24h.length - 1]?.predictedAqi || 184
                ).category
              }
              size="sm"
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider block">
            Expected 24h Peak Window
          </span>
          <div className="text-xl font-extrabold text-charcoal-900 mt-2">
            04:00 - 06:00 Dawn
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">
            Ground-level inversion trapping
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-charcoal-200/80 shadow-subtle">
          <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider block">
            Model Certainty (CI)
          </span>
          <div className="text-xl font-extrabold text-forest-800 mt-2 font-mono">
            ± 8.5% Margin
          </div>
          <p className="text-[11px] text-charcoal-500 font-medium mt-1">
            95% Confidence Interval band
          </p>
        </div>
      </div>

      {/* Main Forecast Chart Card with Horizon Toggle */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-charcoal-200/80 shadow-premium">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-forest-700" />
              <h3 className="text-xl font-bold text-charcoal-900">
                Pollutant Trajectory Forecast
              </h3>
            </div>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Historical actual measurements (solid) seamlessly flowing into multi-horizon machine learning predictions (dashed).
            </p>
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F8FAF9] border border-charcoal-200">
            <button
              onClick={() => setSelectedHorizon('24h')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedHorizon === '24h'
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-forest-800'
              }`}
            >
              24-Hour Horizon
            </button>
            <button
              onClick={() => setSelectedHorizon('3d')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedHorizon === '3d'
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-forest-800'
              }`}
            >
              3-Day Forecast
            </button>
            <button
              onClick={() => setSelectedHorizon('7d')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedHorizon === '7d'
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-forest-800'
              }`}
            >
              7-Day Weekly Outlook
            </button>
          </div>
        </div>

        {/* Forecast Line Chart with Confidence Ribbon */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[100, 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0.75rem',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                iconType="plainline"
              />
              {selectedHorizon !== '7d' && (
                <Line
                  type="monotone"
                  dataKey="observed"
                  stroke="#145C46"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#145C46' }}
                  name="Observed Actual AQI"
                  connectNulls={false}
                />
              )}
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#10B981"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#10B981' }}
                name="AI Predicted AQI"
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="upper"
                stroke="#CBD5E1"
                strokeWidth={1}
                strokeDasharray="2 2"
                dot={false}
                name="Upper Bound (95% CI)"
              />
              <Line
                type="monotone"
                dataKey="lower"
                stroke="#CBD5E1"
                strokeWidth={1}
                strokeDasharray="2 2"
                dot={false}
                name="Lower Bound (95% CI)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3 bg-[#F8FAF9] rounded-2xl border border-charcoal-200 text-xs text-charcoal-500 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Forecast confidence is highest within 0-12 hours; 7-day projections capture macro synoptic fronts.
          </span>
          <span className="font-mono text-[11px] text-charcoal-400">
            Model: {currentModel.name}
          </span>
        </div>
      </div>

      {/* Three Machine Learning Model Cards */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xl font-bold text-charcoal-900">
              Evaluated Regression Models
            </h3>
            <p className="text-xs text-charcoal-500">
              Click a model card to select it for live forecasting benchmarks (Sample Metrics)
            </p>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Notice: SAMPLE MODEL METRICS (Demo Mode)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ML_MODELS_DEMO.map((model) => (
            <div
              key={model.modelKey}
              onClick={() => setSelectedModelKey(model.modelKey)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedModelKey === model.modelKey
                  ? 'bg-white border-forest-600 shadow-premium ring-2 ring-forest-500/30'
                  : 'bg-white border-charcoal-200/80 hover:border-charcoal-300 hover:shadow-subtle'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  {model.badge && (
                    <span className="text-[10px] font-bold bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full">
                      {model.badge}
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-base text-charcoal-900 mb-1">
                  {model.name}
                </h4>
                <p className="text-xs text-charcoal-500 leading-relaxed mb-4">
                  {model.description}
                </p>

                {/* Performance Metrics Table */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/70 text-center mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-400 block">MAE</span>
                    <span className="text-sm font-extrabold font-mono text-charcoal-900">{model.mae}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-400 block">RMSE</span>
                    <span className="text-sm font-extrabold font-mono text-charcoal-900">{model.rmse}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-400 block">R² Score</span>
                    <span className="text-sm font-extrabold font-mono text-forest-700">{model.r2}</span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="space-y-1 mb-4">
                  <span className="text-[11px] font-bold text-charcoal-700 block">Top Predictive Features:</span>
                  {model.topFeatures.slice(0, 3).map((feat, i) => (
                    <div key={i} className="text-[11px] text-charcoal-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs">
                <span className="text-charcoal-400 text-[11px] font-mono">Latency: {model.inferenceSpeedMs}ms</span>
                <span className={`font-bold flex items-center gap-1 ${selectedModelKey === model.modelKey ? 'text-forest-800' : 'text-charcoal-500'}`}>
                  {selectedModelKey === model.modelKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-forest-700" />
                      Active Predictor
                    </>
                  ) : (
                    'Select Model'
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Benchmark Comparison Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-charcoal-200/80 shadow-subtle">
        <h3 className="font-bold text-lg text-charcoal-900 mb-1">
          Model Error & Accuracy Benchmark Comparison
        </h3>
        <p className="text-xs text-charcoal-500 mb-4">
          Visual comparison of Mean Absolute Error (lower is better) and R² explained variance (higher is better).
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkComparison}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0.75rem',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="MAE" fill="#F59E0B" radius={[4, 4, 0, 0]} name="MAE (Mean Absolute Error)" />
              <Bar dataKey="RMSE" fill="#EF4444" radius={[4, 4, 0, 0]} name="RMSE (Root Mean Square)" />
              <Bar dataKey="R2_Pct" fill="#145C46" radius={[4, 4, 0, 0]} name="R² Accuracy (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* How our prediction works */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-200/80 shadow-subtle">
        <h3 className="font-bold text-xl text-charcoal-900 mb-2">
          How Our Prediction Works
        </h3>
        <p className="text-xs text-charcoal-500 mb-6">
          End-to-end pipeline connecting Indian environmental monitoring stations to machine learning regressors.
        </p>

        {/* 5-Step Pipeline Visual */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 text-center">
            <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              1
            </div>
            <h4 className="font-bold text-xs text-charcoal-900 mb-1">Historical Data</h4>
            <p className="text-[11px] text-charcoal-500 leading-tight">
              Ingestion of 100k+ hourly CAAQMS observations across seasons.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 text-center">
            <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              2
            </div>
            <h4 className="font-bold text-xs text-charcoal-900 mb-1">Preprocessing</h4>
            <p className="text-[11px] text-charcoal-500 leading-tight">
              Outlier cleaning, missing value imputation, and sensor zero-span baseline calibration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 text-center">
            <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              3
            </div>
            <h4 className="font-bold text-xs text-charcoal-900 mb-1">Feature Engineering</h4>
            <p className="text-[11px] text-charcoal-500 leading-tight">
              1h-24h lag variables, wind vector products, inversion indices, and solar radiation flux.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-charcoal-200/80 text-center">
            <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              4
            </div>
            <h4 className="font-bold text-xs text-charcoal-900 mb-1">ML Model</h4>
            <p className="text-[11px] text-charcoal-500 leading-tight">
              Hyperparameter-tuned XGBoost and Gradient Boost regression trees.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-forest-800 text-white rounded-2xl text-center">
            <div className="w-8 h-8 rounded-full bg-emerald-400 text-forest-950 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              5
            </div>
            <h4 className="font-bold text-xs text-white mb-1">AQI Forecast</h4>
            <p className="text-[11px] text-forest-100 leading-tight">
              Hourly trajectory output with 95% confidence intervals and public health alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

