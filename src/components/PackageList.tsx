import { Package, FilterStatus } from '../types';
import { statusColor, statusLabel, statusBg } from '../utils/helpers';

interface Props {
  packages: Package[];
  filter: FilterStatus;
  onFilterChange: (f: FilterStatus) => void;
  onSelect: (pkg: Package) => void;
  selectedId?: string;
}

export default function PackageList({ packages, filter, onFilterChange, onSelect, selectedId }: Props) {
  const filtered = filter === 'all' ? packages : packages.filter((p) => p.status === filter);

  const filters: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'transit', label: '运输中' },
    { key: 'delivered', label: '已签收' },
    { key: 'exception', label: '异常' },
  ];

  return (
    <div className="w-72 bg-slate-800/90 border-r border-slate-700 flex flex-col">
      <div className="p-3 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-200 mb-2">包裹列表</h2>
        <div className="flex gap-1 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                filter === f.key ? 'bg-slate-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filtered.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => onSelect(pkg)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              selectedId === pkg.id
                ? 'border-blue-500 bg-slate-700/80'
                : 'border-slate-700 bg-slate-800 hover:bg-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-slate-300">{pkg.trackingNo}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${statusBg[pkg.status]}`}>
                {statusLabel[pkg.status]}
              </span>
            </div>
            <div className="text-xs text-slate-400 mb-2">
              {pkg.currentCity} → {pkg.destinationCity}
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pkg.progress}%`, backgroundColor: statusColor[pkg.status] }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1">进度 {pkg.progress}%</div>
          </button>
        ))}
      </div>
    </div>
  );
}
