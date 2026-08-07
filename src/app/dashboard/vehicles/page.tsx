'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Car,
  Wrench,
  CalendarDays,
  User,
  Users,
  Clock,
} from 'lucide-react';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  vehicleMake?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: number | null;
  vehicleColor?: string | null;
  serviceId?: string | null;
  serviceName?: string | null;
  servicePrice?: number | null;
  date: string;
  time: string;
  status: string;
  notes?: string | null;
}

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  color: string;
  colorHex: string;
  ownerName: string;
  serviceCount: number;
  lastServiceDate: string;
}

const colorMap: Record<string, string> = {
  black: '#1a1a2e',
  white: '#f8f9fa',
  silver: '#c0c0c0',
  gray: '#808080',
  grey: '#808080',
  red: '#dc2626',
  blue: '#2563eb',
  navy: '#1e3a5f',
  green: '#16a34a',
  yellow: '#eab308',
  orange: '#ea580c',
  brown: '#92400e',
  beige: '#d4a574',
  gold: '#ca8a04',
  purple: '#7c3aed',
  pearl: '#f5f0eb',
  charcoal: '#36454f',
  titanium: '#878681',
  midnight: '#191970',
  maroon: '#800000',
  burgundy: '#800020',
  bronze: '#cd7f32',
  slate: '#64748b',
  graphite: '#383838',
};

function getColorHex(colorName: string): string {
  if (!colorName) return '#adb5bd';
  const normalized = colorName.toLowerCase().trim();
  return colorMap[normalized] || '#adb5bd';
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function generateDemoVehicles(): Vehicle[] {
  return [
    {
      id: 'v1', year: 2024, make: 'BMW', model: 'M4 Competition', trim: 'xDrive',
      color: 'Alpine White', colorHex: getColorHex('white'),
      ownerName: 'Marcus Chen', serviceCount: 5, lastServiceDate: '2025-01-10',
    },
    {
      id: 'v2', year: 2023, make: 'Mercedes-AMG', model: 'C63 S',
      color: 'Obsidian Black', colorHex: getColorHex('black'),
      ownerName: 'Sarah Williams', serviceCount: 3, lastServiceDate: '2025-01-08',
    },
    {
      id: 'v3', year: 2024, make: 'Porsche', model: '911 Carrera S',
      color: 'Guards Red', colorHex: getColorHex('red'),
      ownerName: 'David Park', serviceCount: 7, lastServiceDate: '2025-01-12',
    },
    {
      id: 'v4', year: 2023, make: 'Audi', model: 'RS6 Avant',
      color: 'Nardo Gray', colorHex: getColorHex('gray'),
      ownerName: 'Emily Rodriguez', serviceCount: 2, lastServiceDate: '2024-12-28',
    },
    {
      id: 'v5', year: 2025, make: 'Tesla', model: 'Model S Plaid',
      color: 'Pearl White', colorHex: getColorHex('pearl'),
      ownerName: 'James Okafor', serviceCount: 1, lastServiceDate: '2025-01-05',
    },
    {
      id: 'v6', year: 2022, make: 'Lexus', model: 'LC 500',
      color: 'Infrared', colorHex: getColorHex('maroon'),
      ownerName: 'Ava Thompson', serviceCount: 4, lastServiceDate: '2025-01-11',
    },
    {
      id: 'v7', year: 2024, make: 'BMW', model: 'X5 M60i',
      color: 'Manhattan Green', colorHex: getColorHex('green'),
      ownerName: 'Robert Kim', serviceCount: 6, lastServiceDate: '2025-01-09',
    },
    {
      id: 'v8', year: 2023, make: 'Mercedes-Benz', model: 'GLE 63 S',
      color: 'Graphite', colorHex: getColorHex('graphite'),
      ownerName: 'Lisa Nguyen', serviceCount: 3, lastServiceDate: '2024-12-30',
    },
    {
      id: 'v9', year: 2024, make: 'Porsche', model: 'Cayenne Turbo GT',
      color: 'Arctic Grey', colorHex: getColorHex('silver'),
      ownerName: 'Michael Foster', serviceCount: 8, lastServiceDate: '2025-01-13',
    },
    {
      id: 'v10', year: 2025, make: 'Audi', model: 'e-tron GT RS',
      color: 'Daytona Grey', colorHex: getColorHex('charcoal'),
      ownerName: 'Rachel Adams', serviceCount: 2, lastServiceDate: '2025-01-07',
    },
    {
      id: 'v11', year: 2022, make: 'BMW', model: 'M5 CS',
      color: 'Frozen Deep Green', colorHex: getColorHex('green'),
      ownerName: 'Daniel Wright', serviceCount: 9, lastServiceDate: '2025-01-12',
    },
    {
      id: 'v12', year: 2023, make: 'Tesla', model: 'Model 3 Performance',
      color: 'Midnight Silver', colorHex: getColorHex('midnight'),
      ownerName: 'Sophia Lee', serviceCount: 4, lastServiceDate: '2025-01-06',
    },
  ];
}

function VehicleSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-secondary)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="h-32"
        style={{
          background: 'var(--bg-hover)',
          animation: 'pulse-soft 1.5s ease-in-out infinite',
        }}
      />
      <div className="p-4 space-y-3">
        <div className="rounded-md" style={{ width: '75%', height: 16, background: 'var(--bg-hover)', animation: 'pulse-soft 1.5s ease-in-out infinite' }} />
        <div className="rounded-md" style={{ width: '50%', height: 12, background: 'var(--bg-hover)', animation: 'pulse-soft 1.5s ease-in-out infinite 0.1s' }} />
        <div className="rounded-md" style={{ width: '60%', height: 12, background: 'var(--bg-hover)', animation: 'pulse-soft 1.5s ease-in-out infinite 0.2s' }} />
        <div className="rounded-md" style={{ width: '45%', height: 12, background: 'var(--bg-hover)', animation: 'pulse-soft 1.5s ease-in-out infinite 0.3s' }} />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'var(--bg-secondary)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 36, height: 36, background: iconBg }}
        >
          <Icon size={16} strokeWidth={2} style={{ color: iconColor }} />
        </div>
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  );
}

function VehicleCard({ vehicle, index }: { vehicle: Vehicle; index: number }) {
  const vehicleLabel = [vehicle.year, vehicle.make, vehicle.model, vehicle.trim]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className="rounded-2xl overflow-hidden group cursor-pointer"
      style={{
        background: 'var(--bg-secondary)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.2s ease',
        animation: 'fadeIn 0.35s ease-out both',
      }}
      ref={(el) => {
        if (el) el.style.animationDelay = `${index * 0.04}s`;
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${vehicleLabel}`}
    >
      <div
        className="h-32 flex items-center justify-center rounded-t-2xl"
        style={{ background: 'var(--bg-hover)' }}
      >
        <Car
          size={36}
          strokeWidth={1.2}
          style={{ color: 'var(--text-muted)' }}
        />
      </div>

      <div className="p-4 space-y-2.5">
        <h3
          className="text-[15px] font-bold leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {vehicleLabel}
        </h3>

        <div className="flex items-center gap-2">
          <span
            className="shrink-0 rounded-full"
            style={{
              width: 14,
              height: 14,
              background: vehicle.colorHex,
              border: '2px solid var(--border)',
            }}
          />
          <span className="text-[12.5px]" style={{ color: 'var(--text-tertiary)' }}>
            {vehicle.color}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <User
            size={12.5}
            strokeWidth={1.8}
            style={{ color: 'var(--text-muted)', flexShrink: 0 }}
          />
          <span
            className="text-[12.5px] truncate"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {vehicle.ownerName}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Wrench
            size={12.5}
            strokeWidth={1.8}
            style={{ color: 'var(--accent)', flexShrink: 0 }}
          />
          <span className="text-[12.5px]" style={{ color: 'var(--text-tertiary)' }}>
            {vehicle.serviceCount}{' '}
            {vehicle.serviceCount === 1 ? 'service' : 'services'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <CalendarDays
            size={12.5}
            strokeWidth={1.8}
            style={{ color: 'var(--text-muted)', flexShrink: 0 }}
          />
          <span className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>
            {formatDate(vehicle.lastServiceDate)}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl py-20 px-8 text-center"
      style={{
        background: 'var(--bg-secondary)',
        border: '1.5px dashed var(--border)',
      }}
    >
      <div
        className="flex items-center justify-center rounded-full mb-5"
        style={{
          width: 64,
          height: 64,
          background: hasSearch ? 'var(--border-subtle)' : 'var(--accent-muted)',
        }}
      >
        <Car
          size={28}
          strokeWidth={1.5}
          style={{ color: hasSearch ? 'var(--text-muted)' : 'var(--accent)' }}
        />
      </div>
      <h3
        className="text-base font-semibold mb-1"
        style={{ color: 'var(--text-secondary)' }}
      >
        {hasSearch ? 'No vehicles found' : 'No vehicles yet'}
      </h3>
      <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
        {hasSearch
          ? "Try adjusting your search to find what you're looking for."
          : 'Vehicles will appear here once bookings are created.'}
      </p>
    </div>
  );
}

export default function VehiclesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/bookings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch bookings');
        return res.json();
      })
      .then((data: Booking[]) => {
        if (!cancelled) {
          setBookings(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Something went wrong');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const vehicles = useMemo(() => {
    const realBookings = bookings.filter(
      (b) => b.vehicleMake || b.vehicleModel
    );

    if (realBookings.length === 0) {
      return generateDemoVehicles();
    }

    const vehicleMap = new Map<
      string,
      {
        year: number;
        make: string;
        model: string;
        color: string;
        owners: Set<string>;
        serviceCount: number;
        lastServiceDate: string;
      }
    >();

    realBookings.forEach((b) => {
      const key = `${b.vehicleYear}-${b.vehicleMake}-${b.vehicleModel}`;
      const existing = vehicleMap.get(key);

      if (existing) {
        existing.serviceCount++;
        existing.owners.add(b.customerName);
        if (b.date > existing.lastServiceDate) {
          existing.lastServiceDate = b.date;
        }
      } else {
        const ownerSet = new Set<string>();
        ownerSet.add(b.customerName);
        vehicleMap.set(key, {
          year: b.vehicleYear ?? 2024,
          make: b.vehicleMake ?? 'Unknown',
          model: b.vehicleModel ?? 'Unknown',
          color: b.vehicleColor ?? 'Unknown',
          owners: ownerSet,
          serviceCount: 1,
          lastServiceDate: b.date,
        });
      }
    });

    return Array.from(vehicleMap.entries()).map(([key, data]) => ({
      id: `v-${key}`,
      year: data.year,
      make: data.make,
      model: data.model,
      color: data.color,
      colorHex: getColorHex(data.color),
      ownerName: Array.from(data.owners)[0],
      serviceCount: data.serviceCount,
      lastServiceDate: data.lastServiceDate,
    }));
  }, [bookings]);

  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return vehicles;
    const q = searchQuery.toLowerCase().trim();
    return vehicles.filter(
      (v) =>
        `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(q) ||
        v.color.toLowerCase().includes(q) ||
        v.ownerName.toLowerCase().includes(q)
    );
  }, [vehicles, searchQuery]);

  const stats = useMemo(() => {
    const totalVehicles = vehicles.length;
    const uniqueOwners = new Set(vehicles.map((v) => v.ownerName)).size;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const servicedThisWeek = vehicles.filter((v) => {
      const d = new Date(v.lastServiceDate + 'T00:00:00');
      return d >= weekAgo;
    }).length;
    return { totalVehicles, servicedThisWeek, uniqueOwners };
  }, [vehicles]);

  return (
    <div className="flex flex-col gap-6">
      <div style={{ animation: 'fadeIn 0.35s ease-out both' }}>
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Vehicles
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          Vehicle profiles and service history
        </p>
      </div>

      {!loading && vehicles.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{ animation: 'fadeIn 0.35s ease-out 0.05s both' }}
        >
          <StatCard
            icon={Car}
            label="Total Vehicles"
            value={stats.totalVehicles}
            iconBg="var(--accent-muted)"
            iconColor="var(--accent)"
          />
          <StatCard
            icon={Wrench}
            label="Serviced This Week"
            value={stats.servicedThisWeek}
            iconBg="var(--emerald-muted)"
            iconColor="var(--emerald)"
          />
          <StatCard
            icon={Users}
            label="Unique Customers"
            value={stats.uniqueOwners}
            iconBg="var(--violet-muted)"
            iconColor="var(--violet)"
          />
        </div>
      )}

      <div
        className="relative w-full sm:max-w-md"
        style={{ animation: 'fadeIn 0.35s ease-out 0.1s both' }}
      >
        <Search
          size={16}
          strokeWidth={1.8}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          placeholder="Search vehicles, colors, owners..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search vehicles"
          className="pl-10 pr-4 py-2.5 text-sm rounded-xl w-full"
        />
      </div>

      {error && !loading && (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-16 px-8 text-center"
          style={{
            background: 'var(--bg-secondary)',
            border: '1.5px dashed var(--rose)',
          }}
        >
          <div
            className="flex items-center justify-center rounded-full mb-4"
            style={{ width: 56, height: 56, background: 'var(--rose-muted)' }}
          >
            <Clock
              size={24}
              strokeWidth={1.5}
              style={{ color: 'var(--rose)' }}
            />
          </div>
          <h3
            className="text-sm font-semibold mb-1"
            style={{ color: 'var(--rose)' }}
          >
            Failed to load vehicles
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {error}
          </p>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <VehicleSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && !error && filteredVehicles.length > 0 && (
        <>
          <p
            className="text-xs font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            {filteredVehicles.length}{' '}
            {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}
            {searchQuery.trim() && ` matching "${searchQuery.trim()}"`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVehicles.map((vehicle, idx) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                index={idx}
              />
            ))}
          </div>
        </>
      )}

      {!loading && !error && filteredVehicles.length === 0 && (
        <EmptyState hasSearch={searchQuery.trim().length > 0} />
      )}
    </div>
  );
}
