import { useState, useRef, useCallback } from 'react';
import { Package, MapMode } from '../types';
import { statusColor } from '../utils/helpers';
import { Map, Satellite, ZoomIn, ZoomOut } from 'lucide-react';

interface Props {
  packages: Package[];
  selectedId?: string;
  onSelect: (pkg: Package) => void;
}

export default function MapView({ packages, selectedId, onSelect }: Props) {
  const [mode, setMode] = useState<MapMode>('normal');
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.min(Math.max(s + delta, 0.5), 3));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  }, []);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const cityPoints = [
    { name: '北京', x: 70, y: 20 },
    { name: '上海', x: 85, y: 55 },
    { name: '广州', x: 70, y: 80 },
    { name: '深圳', x: 72, y: 82 },
    { name: '成都', x: 35, y: 55 },
    { name: '武汉', x: 60, y: 55 },
    { name: '西安', x: 45, y: 40 },
    { name: '杭州', x: 82, y: 52 },
    { name: '南京', x: 80, y: 48 },
    { name: '重庆', x: 38, y: 58 },
    { name: '天津', x: 72, y: 22 },
    { name: '苏州', x: 84, y: 50 },
    { name: '郑州', x: 55, y: 40 },
    { name: '长沙', x: 58, y: 65 },
    { name: '沈阳', x: 80, y: 10 },
  ];

  const connections = [
    ['北京', '上海'], ['北京', '广州'], ['北京', '成都'], ['北京', '西安'],
    ['上海', '广州'], ['上海', '杭州'], ['上海', '南京'], ['上海', '苏州'],
    ['广州', '深圳'], ['广州', '武汉'], ['成都', '重庆'], ['成都', '西安'],
    ['武汉', '郑州'], ['武汉', '长沙'], ['武汉', '南京'], ['杭州', '南京'],
  ];

  const cityMap = new Map(cityPoints.map((c) => [c.name, c]));

  return (
    <div className="flex-1 relative overflow-hidden bg-slate-900" ref={containerRef}>
      {/* Toolbar */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          onClick={() => setMode(mode === 'normal' ? 'satellite' : 'normal')}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700"
          title={mode === 'normal' ? '切换卫星图' : '切换普通图'}
        >
          {mode === 'normal' ? <Satellite className="w-4 h-4" /> : <Map className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setScale((s) => Math.min(s + 0.2, 3))}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Map Canvas */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke={mode === 'satellite' ? '#1a2e1a' : '#1e293b'} strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={mode === 'satellite' ? '#0d1f0d' : '#0f172a'} />
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Simplified landmass hint */}
          {mode === 'satellite' ? (
            <ellipse cx="60" cy="45" rx="45" ry="38" fill="#1a2e1a" opacity="0.6" />
          ) : (
            <ellipse cx="60" cy="45" rx="45" ry="38" fill="#1e293b" opacity="0.5" />
          )}

          {/* Connections */}
          {connections.map(([a, b], i) => {
            const ca = cityMap.get(a);
            const cb = cityMap.get(b);
            if (!ca || !cb) return null;
            return (
              <line
                key={i}
                x1={ca.x}
                y1={ca.y}
                x2={cb.x}
                y2={cb.y}
                stroke="#334155"
                strokeWidth="0.3"
                strokeDasharray="1 1"
              />
            );
          })}

          {/* City dots */}
          {cityPoints.map((city) => (
            <g key={city.name}>
              <circle cx={city.x} cy={city.y} r="0.8" fill="#64748b" />
              <text x={city.x} y={city.y - 1.5} fontSize="2.5" fill="#94a3b8" textAnchor="middle">
                {city.name}
              </text>
            </g>
          ))}

          {/* Package routes */}
          {packages.map((pkg) => {
            if (pkg.route.length < 2) return null;
            const pathD = pkg.route.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
            return (
              <path
                key={`route-${pkg.id}`}
                d={pathD}
                fill="none"
                stroke={statusColor[pkg.status]}
                strokeWidth="0.3"
                opacity="0.4"
                strokeDasharray="1 0.5"
              />
            );
          })}

          {/* Package markers */}
          {packages.map((pkg) => (
            <g
              key={pkg.id}
              transform={`translate(${pkg.x}, ${pkg.y})`}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(pkg);
              }}
            >
              <circle
                r={selectedId === pkg.id ? 2.5 : 1.8}
                fill={statusColor[pkg.status]}
                stroke="#0f172a"
                strokeWidth="0.3"
                opacity="0.9"
              >
                <animate attributeName="r" values={`${selectedId === pkg.id ? 2.5 : 1.8};${selectedId === pkg.id ? 3.5 : 2.8};${selectedId === pkg.id ? 2.5 : 1.8}`} dur="2s" repeatCount="indefinite" />
              </circle>
              <text y={-3} fontSize="2" fill={statusColor[pkg.status]} textAnchor="middle" fontWeight="bold">
                {pkg.id}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
