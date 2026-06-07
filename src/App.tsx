import { useState } from 'react';
import { Package, FilterStatus } from './types';
import { usePackages } from './hooks/usePackages';
import StatsBar from './components/StatsBar';
import PackageList from './components/PackageList';
import MapView from './components/MapView';
import DetailCard from './components/DetailCard';

function App() {
  const { packages } = usePackages(3000);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [selected, setSelected] = useState<Package | null>(null);

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <StatsBar packages={packages} />
      <div className="flex-1 flex overflow-hidden">
        <PackageList
          packages={packages}
          filter={filter}
          onFilterChange={setFilter}
          onSelect={(pkg) => setSelected(pkg)}
          selectedId={selected?.id}
        />
        <div className="flex-1 relative">
          <MapView
            packages={packages}
            selectedId={selected?.id}
            onSelect={(pkg) => setSelected(pkg)}
          />
          <DetailCard pkg={selected} onClose={() => setSelected(null)} />
        </div>
      </div>
    </div>
  );
}

export default App;
