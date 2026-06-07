import { Package, PackageStatus } from '../types';
import { Truck, CheckCircle, AlertTriangle, Package as PackageIcon } from 'lucide-react';

interface Props {
  packages: Package[];
}

export default function StatsBar({ packages }: Props) {
  const total = packages.length;
  const transit = packages.filter((p) => p.status === 'transit').length;
  const delivered = packages.filter((p) => p.status === 'delivered').length;
  const exception = packages.filter((p) => p.status === 'exception').length;

  const items = [
    { label: '今日发货', value: total, icon: PackageIcon, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: '在途数量', value: transit, icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: '已签收', value: delivered, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: '异常件', value: exception, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="flex gap-4 px-4 py-3 bg-slate-800/80 border-b border-slate-700">
      {items.map((item) => (
        <div key={item.label} className={`flex items-center gap-3 px-4 py-2 rounded-lg ${item.bg} flex-1`}>
          <item.icon className={`w-5 h-5 ${item.color}`} />
          <div>
            <div className="text-xs text-slate-400">{item.label}</div>
            <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
