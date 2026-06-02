import { useState, useEffect, useRef } from 'react';

// Locally: uses Vite proxy /arduino → 192.168.8.196
// On Vercel: uses /api/arduino proxy function (no CORS issues)
const IS_DEV = import.meta.env.DEV;
const ARDUINO_DIRECT = import.meta.env.VITE_ARDUINO_URL
  ? String(import.meta.env.VITE_ARDUINO_URL)
  : null;
const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN ?? '';

function getUrl(path: string) {
  if (ARDUINO_DIRECT) return `${ARDUINO_DIRECT}${path}`;
  if (IS_DEV) return `/arduino${path}`;
  return `/api/arduino?path=${path}`;
}

function getAqiCategory(aqi: number): string {
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export interface SensorCurrent {
  temperature: number;
  humidity: number;
  humidity_cat: string;
  soil_pct: number;
  soil_cat: string;
  light_pct: number;
  light_cat: string;
  aqi: number;
  aqi_cat: string;
  online: boolean;
  lastUpdated: Date;
}

export interface SensorHistory {
  labels: string[];
  soil: number[];
  temp: number[];
  humid: number[];
  light: number[];
}

const DEFAULT_CURRENT: SensorCurrent = {
  temperature: 0, humidity: 0, humidity_cat: '--',
  soil_pct: 0, soil_cat: '--', light_pct: 0, light_cat: '--',
  aqi: 0, aqi_cat: '--',
  online: false, lastUpdated: new Date(),
};

const DEFAULT_HISTORY: SensorHistory = {
  labels: [], soil: [], temp: [], humid: [], light: [],
};

export function useArduinoData() {
  const [current, setCurrent]   = useState<SensorCurrent>(DEFAULT_CURRENT);
  const [history, setHistory]   = useState<SensorHistory>(DEFAULT_HISTORY);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const histIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aqiIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aqiRef = useRef<{ aqi: number; aqi_cat: string }>({ aqi: 0, aqi_cat: '--' });

  const fetchAqi = async () => {
    if (!WAQI_TOKEN) return;
    try {
      const res = await fetch(
        `https://api.waqi.info/feed/kuwait/?token=${WAQI_TOKEN}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (!res.ok) return;
      const d = await res.json();
      if (d.status === 'ok' && d.data?.aqi) {
        const aqi = parseInt(d.data.aqi) || 0;
        aqiRef.current = { aqi, aqi_cat: getAqiCategory(aqi) };
        setCurrent(prev => ({ ...prev, aqi, aqi_cat: getAqiCategory(aqi) }));
      }
    } catch { /* silent */ }
  };

  const fetchCurrent = async () => {
    try {
      const res = await fetch(getUrl('/api/current'), {
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      setCurrent({
        temperature:  parseFloat(d.temperature) || 0,
        humidity:     parseFloat(d.humidity) || 0,
        humidity_cat: d.humidity_cat ?? '--',
        soil_pct:     parseInt(d.soil_pct) || 0,
        soil_cat:     d.soil_cat ?? '--',
        light_pct:    parseInt(d.light_pct) || 0,
        light_cat:    d.light_cat ?? '--',
        aqi:          aqiRef.current.aqi,
        aqi_cat:      aqiRef.current.aqi_cat,
        online:       true,
        lastUpdated:  new Date(),
      });
      setError(null);
      setLoading(false);
    } catch {
      setError('Node offline or unreachable');
      setCurrent(prev => ({ ...prev, online: false }));
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(getUrl('/api/history'), {
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) return;
      const d = await res.json();
      setHistory({
        labels: d.labels ?? [],
        soil:   d.soil  ?? [],
        temp:   d.temp  ?? [],
        humid:  d.humid ?? [],
        light:  d.light ?? [],
      });
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchAqi();
    fetchCurrent();
    fetchHistory();
    intervalRef.current     = setInterval(fetchCurrent, 2000);
    histIntervalRef.current = setInterval(fetchHistory, 30000);
    aqiIntervalRef.current  = setInterval(fetchAqi, 300000);
    return () => {
      if (intervalRef.current)     clearInterval(intervalRef.current);
      if (histIntervalRef.current) clearInterval(histIntervalRef.current);
      if (aqiIntervalRef.current)  clearInterval(aqiIntervalRef.current);
    };
  }, []);

  return { current, history, loading, error };
}