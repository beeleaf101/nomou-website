import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Wifi, WifiOff, AlertTriangle, Droplets, Wind, Thermometer } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export default function PortalMap() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [selected, setSelected] = useState(user?.nodes[0]?.id ?? '');

  const statusColor: Record<string, string> = { online: '#4CAF50', offline: '#ef4444', warning: '#FF9800' };
  const StatusIcon: Record<string, React.ElementType> = { online: Wifi, offline: WifiOff, warning: AlertTriangle };

  const selectedNode = user?.nodes.find(n => n.id === selected);

  // Normalize lat/lng to % positions within the map card
  const nodes = user?.nodes ?? [];
  const lats = nodes.map(n => n.lat);
  const lngs = nodes.map(n => n.lng);
  const minLat = Math.min(...lats) - 0.002;
  const maxLat = Math.max(...lats) + 0.002;
  const minLng = Math.min(...lngs) - 0.002;
  const maxLng = Math.max(...lngs) + 0.002;

  const toPos = (lat: number, lng: number) => ({
    x: ((lng - minLng) / (maxLng - minLng)) * 80 + 10,
    y: ((maxLat - lat) / (maxLat - minLat)) * 80 + 10,
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Node Map</h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Live locations of all your deployed sensor nodes</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map area */}
        <div className={`lg:col-span-2 rounded-3xl border overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Kuwait — Al-Wafra Region</h3>
            <div className="flex items-center gap-3 text-xs">
              {Object.entries(statusColor).map(([s, c]) => (
                <span key={s} className="flex items-center gap-1 capitalize font-medium" style={{ color: c }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />{s}
                </span>
              ))}
            </div>
          </div>

          {/* Satellite-style map placeholder */}
          <div className="relative h-[400px] overflow-hidden"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #0d2a15 0%, #1a4a20 50%, #0d2a15 100%)'
                : 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
            }}>

            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: 10 }, (_, i) => (
                <g key={i}>
                  <line x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke={isDark ? '#fff' : '#000'} strokeWidth="0.5" />
                  <line x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke={isDark ? '#fff' : '#000'} strokeWidth="0.5" />
                </g>
              ))}
            </svg>

            {/* Field patches */}
            {[
              { x: 15, y: 20, w: 25, h: 20, opacity: 0.15 },
              { x: 45, y: 15, w: 30, h: 25, opacity: 0.12 },
              { x: 20, y: 55, w: 20, h: 25, opacity: 0.18 },
              { x: 55, y: 50, w: 25, h: 30, opacity: 0.14 },
            ].map((p, i) => (
              <div key={i} className="absolute rounded-lg" style={{
                left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%`,
                backgroundColor: isDark ? `rgba(76,175,80,${p.opacity})` : `rgba(45,122,62,${p.opacity})`,
                border: `1px solid ${isDark ? 'rgba(76,175,80,0.2)' : 'rgba(45,122,62,0.2)'}`,
              }} />
            ))}

            {/* Labels */}
            <div className={`absolute top-3 left-3 text-[10px] font-mono ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
              29.0°N 47.9°E
            </div>
            <div className={`absolute bottom-3 right-3 text-[10px] font-mono ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
              28.6°N 47.93°E
            </div>

            {/* Node pins */}
            {nodes.map(node => {
              const pos = toPos(node.lat, node.lng);
              const SIcon = StatusIcon[node.status];
              const isSelected = node.id === selected;
              return (
                <motion.button key={node.id}
                  onClick={() => setSelected(node.id)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10">
                  {/* Pulse ring */}
                  {node.status === 'online' && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: statusColor[node.status] }} />
                  )}
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isSelected ? 'ring-2 ring-white ring-offset-1' : ''}`}
                    style={{ backgroundColor: statusColor[node.status] }}>
                    <MapPin size={18} className="text-white" />
                  </div>
                  {isSelected && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-[#0d1f12] text-white' : 'bg-white text-gray-800'} shadow-md`}>
                      {node.name}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Node list + detail */}
        <div className="space-y-3">
          {nodes.map(node => {
            const SIcon = StatusIcon[node.status];
            const isSelected = node.id === selected;
            return (
              <motion.div key={node.id} whileHover={{ x: 4 }}
                onClick={() => setSelected(node.id)}
                className={`rounded-2xl p-4 border cursor-pointer transition-all ${
                  isSelected
                    ? isDark ? 'border-green-primary bg-green-primary/10' : 'border-green-primary bg-green-primary/5'
                    : isDark ? 'border-white/10 bg-white/5 hover:bg-white/8' : 'border-gray-200 bg-white hover:bg-gray-50 shadow-sm'
                }`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{node.name}</p>
                    <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{node.location}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${statusColor[node.status]}20`, color: statusColor[node.status] }}>
                    <SIcon size={10} /> {node.status}
                  </span>
                </div>
                {isSelected && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-current/10">
                    {[
                      { icon: Droplets, v: `${node.soil}%`, l: 'Soil', c: '#03A9F4' },
                      { icon: Wind, v: `${node.air} AQI`, l: 'Air', c: '#4CAF50' },
                      { icon: Thermometer, v: `${node.temp}°C`, l: 'Temp', c: '#FF9800' },
                    ].map(m => {
                      const MIcon = m.icon;
                      return (
                        <div key={m.l} className="text-center">
                          <MIcon size={14} style={{ color: m.c }} className="mx-auto mb-0.5" />
                          <p className={`text-xs font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>{m.v}</p>
                          <p className={`text-[10px] ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{m.l}</p>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
