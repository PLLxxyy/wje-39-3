export type PackageStatus = 'transit' | 'delivered' | 'exception';

export interface Package {
  id: string;
  trackingNo: string;
  recipient: string;
  address: string;
  currentCity: string;
  destinationCity: string;
  status: PackageStatus;
  progress: number;
  estimatedDelivery: string;
  x: number;
  y: number;
  route: { x: number; y: number }[];
}

export type MapMode = 'normal' | 'satellite';
export type FilterStatus = 'all' | PackageStatus;
