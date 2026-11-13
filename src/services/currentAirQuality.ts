import { AQICategory, PollutantValues } from '../types';

type ApiResponse = {
  hourly?: {
    time: number[];
    pm2_5?: (number | null)[];
    pm10?: (number | null)[];
    nitrogen_dioxide?: (number | null)[];
    sulphur_dioxide?: (number | null)[];
    carbon_monoxide?: (number | null)[];
    ozone?: (number | null)[];
  };
  error?: boolean;
  reason?: string;
};

export interface CurrentAirReading {
  aqi: number;
  category: AQICategory;
  pollutants: PollutantValues;
  dominantPollutant: string;
  time: string;
  hourly: { time: string; aqi: number; pm25: number; pm10: number }[];
}

const breakpoints: Record<string, [number, number][]> = {
  pm25: [[0,30],[31,60],[61,90],[91,120],[121,250],[251,500]],
  pm10: [[0,50],[51,100],[101,250],[251,350],[351,430],[431,600]],
  no2: [[0,40],[41,80],[81,180],[181,280],[281,400],[401,1000]],
  so2: [[0,40],[41,80],[81,380],[381,800],[801,1600],[1601,2000]],
  co: [[0,1],[1.1,2],[2.1,10],[10.1,17],[17.1,34],[34.1,50]],
  o3: [[0,50],[51,100],[101,168],[169,208],[209,748],[749,1000]],
};
const aqiBands: [number, number][] = [[0,50],[51,100],[101,200],[201,300],[301,400],[401,500]];

function subIndex(pollutant: keyof typeof breakpoints, value: number): number {
  const ranges = breakpoints[pollutant];
  const index = ranges.findIndex(([_, high]) => value <= high);
  const i = index < 0 ? ranges.length - 1 : index;
  const [cLow, cHigh] = ranges[i];
  const [iLow, iHigh] = aqiBands[i];
  return Math.max(0, Math.min(500, Math.round(((iHigh - iLow) / (cHigh - cLow)) * (value - cLow) + iLow)));
}

export function categoryFor(value: number): AQICategory {
  if (value <= 50) return 'Good';
  if (value <= 100) return 'Satisfactory';
  if (value <= 200) return 'Moderate';
  if (value <= 300) return 'Poor';
  if (value <= 400) return 'Very Poor';
  return 'Severe';
}

export async function fetchCurrentAir(latitude: number, longitude: number): Promise<CurrentAirReading> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(4), longitude: longitude.toFixed(4),
    hourly: 'pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,ozone',
    past_hours: '24', forecast_hours: '24', timezone: 'GMT', timeformat: 'unixtime',
  });
  const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
  if (!response.ok) throw new Error(`Air quality service returned ${response.status}`);
  const payload: ApiResponse = await response.json();
  if (payload.error || !payload.hourly?.time?.length) throw new Error(payload.reason || 'No air-quality data is available for this location.');

  const h = payload.hourly;
  const now = Date.now();
  const latestIndex = h.time.reduce((best, time, index) => {
    const stamp = time * 1000;
    return stamp <= now && (best < 0 || stamp > h.time[best] * 1000) ? index : best;
  }, -1);
  if (latestIndex < 0) throw new Error('No current hourly model data is available.');
  const read = (series?: (number | null)[]) => {
    const value = series?.[latestIndex];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  };
  const raw = { pm25: read(h.pm2_5), pm10: read(h.pm10), no2: read(h.nitrogen_dioxide), so2: read(h.sulphur_dioxide), co: read(h.carbon_monoxide), o3: read(h.ozone) };
  const valid: [keyof typeof breakpoints, number][] = Object.entries(raw)
    .filter((entry): entry is [keyof typeof breakpoints, number] => entry[1] !== null)
    .map(([key, value]) => [key as keyof typeof breakpoints, key === 'co' ? value! / 1000 : value!]);
  if (valid.length < 3 || !valid.some(([key]) => key === 'pm25' || key === 'pm10')) throw new Error('Not enough pollutant data to estimate an AQI for this location.');
  const indexes = valid.map(([key, value]) => ({ key, value: subIndex(key, value) }));
  const highest = indexes.reduce((a, b) => b.value > a.value ? b : a);
  const pollutants: PollutantValues = {
    pm25: raw.pm25 ?? 0, pm10: raw.pm10 ?? 0, no2: raw.no2 ?? 0,
    so2: raw.so2 ?? 0, co: (raw.co ?? 0) / 1000, o3: raw.o3 ?? 0,
  };
  const hourly = h.time.map((time, i) => {
    const vals = [
      ['pm25', h.pm2_5?.[i]], ['pm10', h.pm10?.[i]], ['no2', h.nitrogen_dioxide?.[i]],
      ['so2', h.sulphur_dioxide?.[i]], ['co', h.carbon_monoxide?.[i] == null ? null : h.carbon_monoxide[i]! / 1000], ['o3', h.ozone?.[i]],
    ].filter((entry): entry is [keyof typeof breakpoints, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1]));
    const subs = vals.map(([key, value]) => subIndex(key, value));
    return { time: new Date(time * 1000).toISOString(), aqi: subs.length ? Math.max(...subs) : 0, pm25: h.pm2_5?.[i] ?? 0, pm10: h.pm10?.[i] ?? 0 };
  }).filter((x) => x.time && x.aqi > 0);

  const dominantPollutant = highest.key === 'pm25' ? 'PM2.5' : highest.key === 'pm10' ? 'PM10' : highest.key.toUpperCase();
  return { aqi: highest.value, category: categoryFor(highest.value), pollutants, dominantPollutant, time: new Date(h.time[latestIndex] * 1000).toISOString(), hourly };
}

export function getBrowserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Location access is not supported by this browser.'));
    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      reject(new Error(error.code === error.PERMISSION_DENIED ? 'Location permission was denied. Allow location access in your browser and try again.' : 'Could not determine your location. Check device location services and try again.'));
    }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 });
  });
}
