export type AQICategory = 
  | 'Good' 
  | 'Satisfactory' 
  | 'Moderate' 
  | 'Poor' 
  | 'Very Poor' 
  | 'Severe';

export interface PollutantValues {
  pm25: number;      // µg/m³
  pm10: number;      // µg/m³
  no2: number;       // µg/m³
  so2: number;       // µg/m³
  co: number;        // mg/m³
  o3: number;        // µg/m³
}

export interface WeatherData {
  temperature: number; // °C
  humidity: number;    // %
  windSpeed: number;   // km/h
  windDirection: string;
  pressure: number;    // hPa
  condition: string;
  visibility: number;  // km
}

export interface HourlyReading {
  time: string;
  aqi: number;
  pm25: number;
  pm10: number;
  temperature?: number;
}

export interface HistoricalReading {
  date: string;
  dayName: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  category: AQICategory;
}

export interface PredictionItem {
  timestamp: string;
  label: string;
  actualAqi?: number;
  predictedAqi: number;
  confidenceLower: number;
  confidenceUpper: number;
  category: AQICategory;
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
  aqi: number;
  category: AQICategory;
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'O3';
  pollutants: PollutantValues;
  weather: WeatherData;
  monitoringStation: string;
  lastUpdated: string;
  hourlyTrends: HourlyReading[];
  weeklyTrends: HistoricalReading[];
  monthlyTrends: HistoricalReading[];
  predictions24h: PredictionItem[];
  predictions7d: PredictionItem[];
}

export interface MLModelMetric {
  name: string;
  modelKey: 'rf' | 'gb' | 'xgb';
  description: string;
  mae: number;
  rmse: number;
  r2: number;
  trainingSamples: string;
  inferenceSpeedMs: number;
  badge?: string;
  topFeatures: string[];
}

export interface AlertRule {
  id: string;
  cityId: string;
  cityName: string;
  threshold: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
  notificationType: 'push' | 'email' | 'sms';
  lastTriggered?: string;
}

export interface CPCBStandard {
  category: AQICategory;
  range: [number, number];
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  healthImpact: string;
  adviceGeneral: string;
  adviceSensitive: string;
  outdoorGuidance: string;
}

