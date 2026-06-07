import { Package, PackageStatus } from '../types';

export interface StatusTransitionRule {
  name: string;
  condition: (pkg: Package) => boolean;
  action: (pkg: Package) => Partial<Package>;
}

export interface ProgressUpdateRule {
  name: string;
  calculate: (pkg: Package) => number;
}

export const progressUpdateRules: ProgressUpdateRule[] = [
  {
    name: 'deliveredNoProgress',
    calculate: (pkg) => (pkg.status === 'delivered' ? pkg.progress : Math.min(pkg.progress + Math.random() * 3, 100)),
  },
];

export const statusTransitionRules: StatusTransitionRule[] = [
  {
    name: 'deliveredNoChange',
    condition: (pkg) => pkg.status === 'delivered',
    action: (pkg) => ({ status: pkg.status }),
  },
  {
    name: 'progressCompleteToDelivered',
    condition: (pkg) => pkg.progress >= 100 && pkg.status !== 'delivered',
    action: () => ({ status: 'delivered' as PackageStatus }),
  },
  {
    name: 'randomException',
    condition: (pkg) => Math.random() < 0.005 && pkg.status !== 'exception' && pkg.status !== 'delivered',
    action: () => ({ status: 'exception' as PackageStatus }),
  },
];

export function applyProgressUpdate(pkg: Package): number {
  let newProgress = pkg.progress;
  for (const rule of progressUpdateRules) {
    newProgress = rule.calculate({ ...pkg, progress: newProgress });
  }
  return newProgress;
}

export function applyStatusTransitions(pkg: Package, newProgress: number): PackageStatus {
  const updatedPkg = { ...pkg, progress: newProgress };
  for (const rule of statusTransitionRules) {
    if (rule.condition(updatedPkg)) {
      const result = rule.action(updatedPkg);
      if (result.status) {
        return result.status;
      }
    }
  }
  return updatedPkg.status;
}

export function calculatePosition(pkg: Package, newProgress: number): { x: number; y: number } {
  const currentIndex = Math.min(
    Math.floor((newProgress / 100) * (pkg.route.length - 1)),
    pkg.route.length - 1
  );
  return pkg.route[currentIndex];
}
