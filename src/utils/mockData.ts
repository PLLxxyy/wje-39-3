import { Package } from '../types';

const cities = [
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

function randomDate(days: number): string {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
}

function generateRoute(from: { x: number; y: number }, to: { x: number; y: number }): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [from];
  const steps = 5 + Math.floor(Math.random() * 4);
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    points.push({
      x: from.x + (to.x - from.x) * t + (Math.random() - 0.5) * 8,
      y: from.y + (to.y - from.y) * t + (Math.random() - 0.5) * 8,
    });
  }
  points.push(to);
  return points;
}

export function generatePackages(count: number): Package[] {
  const packages: Package[] = [];
  const statuses: Array<'transit' | 'delivered' | 'exception'> = ['transit', 'transit', 'transit', 'delivered', 'exception'];

  for (let i = 0; i < count; i++) {
    const fromCity = cities[Math.floor(Math.random() * cities.length)];
    let toCity = cities[Math.floor(Math.random() * cities.length)];
    while (toCity.name === fromCity.name) {
      toCity = cities[Math.floor(Math.random() * cities.length)];
    }

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const progress = status === 'delivered' ? 100 : status === 'exception' ? Math.random() * 60 : Math.random() * 90;
    const route = generateRoute(fromCity, toCity);
    const currentIndex = Math.min(Math.floor((progress / 100) * (route.length - 1)), route.length - 1);
    const pos = route[currentIndex];

    packages.push({
      id: `PKG${String(i + 1).padStart(4, '0')}`,
      trackingNo: `SF${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      recipient: `用户${i + 1}`,
      address: `${toCity.name}市${['朝阳区', '海淀区', '天河区', '福田区', '武侯区', '江汉区'][Math.floor(Math.random() * 6)]}某街道${Math.floor(Math.random() * 900) + 100}号`,
      currentCity: fromCity.name,
      destinationCity: toCity.name,
      status,
      progress: Math.round(progress),
      estimatedDelivery: randomDate(status === 'delivered' ? -1 : Math.floor(Math.random() * 3) + 1),
      x: pos.x,
      y: pos.y,
      route,
    });
  }

  return packages;
}

export function movePackages(packages: Package[]): Package[] {
  return packages.map((pkg) => {
    if (pkg.status === 'delivered') return pkg;

    const newProgress = Math.min(pkg.progress + (Math.random() * 3), 100);
    const currentIndex = Math.min(Math.floor((newProgress / 100) * (pkg.route.length - 1)), pkg.route.length - 1);
    const pos = pkg.route[currentIndex];

    let newStatus = pkg.status;
    if (newProgress >= 100) newStatus = 'delivered';
    else if (Math.random() < 0.005 && pkg.status !== 'exception') newStatus = 'exception';

    return {
      ...pkg,
      progress: Math.round(newProgress),
      status: newStatus,
      x: pos.x,
      y: pos.y,
    };
  });
}
