import { PackageStatus } from '../types';

export const statusColor: Record<PackageStatus, string> = {
  transit: '#3b82f6',
  delivered: '#22c55e',
  exception: '#ef4444',
};

export const statusLabel: Record<PackageStatus, string> = {
  transit: '运输中',
  delivered: '已签收',
  exception: '异常',
};

export const statusBg: Record<PackageStatus, string> = {
  transit: 'bg-blue-500',
  delivered: 'bg-green-500',
  exception: 'bg-red-500',
};
