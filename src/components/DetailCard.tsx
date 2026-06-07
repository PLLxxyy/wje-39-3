import { Package } from '../types';
import { statusColor, statusLabel } from '../utils/helpers';
import { X, MapPin, User, Calendar, Package as PackageIcon } from 'lucide-react';

interface Props {
  pkg: Package | null;
  onClose: () => void;
}

export default function DetailCard({ pkg, onClose }: Props) {
  if (!pkg) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-80 bg-slate-800/95 border border-slate-600 rounded-xl shadow-2xl p-4 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PackageIcon className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-200">{pkg.trackingNo}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>收件人：{pkg.recipient}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>地址：{pkg.address}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>当前城市：{pkg.currentCity} → {pkg.destinationCity}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>预计送达：{pkg.estimatedDelivery}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className="px-2 py-0.5 rounded text-xs text-white font-medium"
          style={{ backgroundColor: statusColor[pkg.status] }}
        >
          {statusLabel[pkg.status]}
        </span>
        <div className="flex-1 bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pkg.progress}%`, backgroundColor: statusColor[pkg.status] }}
          />
        </div>
        <span className="text-xs text-slate-400">{pkg.progress}%</span>
      </div>
    </div>
  );
}
