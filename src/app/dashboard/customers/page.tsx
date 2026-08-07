'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Search,
  Plus,
  ChevronRight,
  Car,
  CalendarDays,
  DollarSign,
  Clock,
  Mail,
  UserPlus,
  Users,
  Inbox,
} from 'lucide-react';

/* ================================================================== */
/*  Types                                                               */
/* ================================================================== */
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

interface Customer {
  name: string;
  email: string;
  phone: string | null;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string | null;
  vehicles: string[];
}

/* ================================================================== */
/*  Avatar Color Palette                                                */
/* ================================================================== */
const avatarColors = [
  { bg: 'var(--electric-blue)', fg: 'var(--white)' },
  { bg: '#7c3aed', fg: 'var(--white)' },
  { bg: 'var(--emerald)', fg: 'var(--white)' },
  { bg: 'var(--amber)', fg: 'var(--white)' },
  { bg: 'var(--rose)', fg: 'var(--white)' },
];

function getAvatarColor(index: number) {
  return avatarColors[index % avatarColors.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/* ================================================================== */
/*  Date Formatting                                                     */
/* ================================================================== */
function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

/* ================================================================== */
/*  Skeleton Loading                                                    */
/* ================================================================== */
function CustomerSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'var(--white)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--gray-100)',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar skeleton */}
        <div
          className="shrink-0 rounded-full"
          style={{
            width: 52,
            height: 52,
            background: 'var(--gray-100)',
            animation: 'pulse-soft 1.5s ease-in-out infinite',
          }}
        />
        {/* Text skeleton */}
        <div className="flex-1 min-w-0">
          <div
            className="rounded-md mb-2"
            style={{
              width: '60%',
              height: 14,
              background: 'var(--gray-100)',
              animation: 'pulse-soft 1.5s ease-in-out infinite',
            }}
          />
          <div
            className="rounded-md mb-4"
            style={{
              width: '80%',
              height: 12,
              background: 'var(--gray-100)',
              animation: 'pulse-soft 1.5s ease-in-out infinite 0.1s',
            }}
          />
          {/* Stats row skeleton */}
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-md"
                style={{
                  width: 60,
                  height: 10,
                  background: 'var(--gray-100)',
                  animation: `pulse-soft 1.5s ease-in-out infinite ${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Customer Card                                                       */
/* ================================================================== */
function CustomerCard({
  customer,
  index,
}: {
  customer: Customer;
  index: number;
}) {
  const avatarColor = getAvatarColor(index);
  const vehicleCount = customer.vehicles.length;

  return (
    <div
      className="customer-card rounded-2xl p-5 cursor-pointer group"
      style={{
        background: 'var(--white)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--gray-100)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--electric-blue-muted)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--gray-100)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${customer.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
      }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="shrink-0 flex items-center justify-center rounded-full text-sm font-bold"
          style={{
            width: 52,
            height: 52,
            background: avatarColor.bg,
            color: avatarColor.fg,
            letterSpacing: '0.02em',
          }}
        >
          {getInitials(customer.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3
            className="text-[15px] font-semibold truncate"
            style={{ color: 'var(--gray-900)' }}
          >
            {customer.name}
          </h3>

          {/* Email */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <Mail size={12} strokeWidth={1.8} style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
            <span
              className="text-[12.5px] truncate"
              style={{ color: 'var(--gray-500)' }}
            >
              {customer.email}
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={12.5} strokeWidth={1.8} style={{ color: 'var(--electric-blue)' }} />
              <span className="text-[12px] font-medium" style={{ color: 'var(--gray-600)' }}>
                {customer.totalBookings} {customer.totalBookings === 1 ? 'booking' : 'bookings'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign size={12.5} strokeWidth={1.8} style={{ color: 'var(--emerald)' }} />
              <span className="text-[12px] font-medium" style={{ color: 'var(--gray-600)' }}>
                {formatCurrency(customer.totalSpent)}
              </span>
            </div>
          </div>

          {/* Vehicle count + Last visit row */}
          <div className="flex items-center justify-between mt-2.5 pt-2.5" style={{ borderTop: '1px solid var(--gray-100)' }}>
            <div className="flex items-center gap-1.5">
              <Car size={12.5} strokeWidth={1.8} style={{ color: 'var(--gray-400)' }} />
              <span className="text-[11.5px] font-medium" style={{ color: 'var(--gray-500)' }}>
                {vehicleCount} {vehicleCount === 1 ? 'vehicle' : 'vehicles'}
              </span>
            </div>
            {customer.lastVisit && (
              <div className="flex items-center gap-1.5">
                <Clock size={11} strokeWidth={1.8} style={{ color: 'var(--gray-400)' }} />
                <span className="text-[11px]" style={{ color: 'var(--gray-400)' }}>
                  {formatDate(customer.lastVisit)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div
          className="shrink-0 flex items-center justify-center mt-1 rounded-lg"
          style={{
            width: 28,
            height: 28,
            color: 'var(--gray-400)',
            transition: 'all 0.15s ease',
          }}
        >
          <ChevronRight size={16} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Empty State                                                         */
/* ================================================================== */
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl py-20 px-8 text-center"
      style={{
        background: 'var(--white)',
        border: '1.5px dashed var(--gray-200)',
      }}
    >
      <div
        className="flex items-center justify-center rounded-full mb-5"
        style={{
          width: 64,
          height: 64,
          background: hasSearch ? 'var(--gray-100)' : 'var(--electric-blue-light)',
        }}
      >
        {hasSearch ? (
          <Inbox size={28} strokeWidth={1.5} style={{ color: 'var(--gray-400)' }} />
        ) : (
          <Users size={28} strokeWidth={1.5} style={{ color: 'var(--electric-blue)' }} />
        )}
      </div>
      <h3
        className="text-base font-semibold mb-1"
        style={{ color: 'var(--gray-700)' }}
      >
        {hasSearch ? 'No customers found' : 'No customers yet'}
      </h3>
      <p
        className="text-sm max-w-xs"
        style={{ color: 'var(--gray-400)' }}
      >
        {hasSearch
          ? 'Try adjusting your search query to find what you\'re looking for.'
          : 'Customers will appear here once bookings are created.'}
      </p>
      {!hasSearch && (
        <button
          className="flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
          style={{
            background: 'var(--electric-blue)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--electric-blue-hover)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow-blue)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--electric-blue)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <UserPlus size={15} strokeWidth={2.2} />
          Add your first customer
        </button>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Customers Page                                                      */
/* ================================================================== */
export default function CustomersPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /* --- Fetch bookings --- */
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

  /* --- Derive unique customers from bookings --- */
  const customers = useMemo(() => {
    const customerMap = new Map<string, {
      name: string;
      email: string;
      phone: string | null;
      totalBookings: number;
      totalSpent: number;
      lastVisit: string | null;
      vehicles: Set<string>;
    }>();

    bookings.forEach((b) => {
      const key = b.customerEmail.toLowerCase().trim();
      const existing = customerMap.get(key);

      if (existing) {
        existing.totalBookings++;
        existing.totalSpent += b.servicePrice ?? 0;
        if (b.date > (existing.lastVisit ?? '')) {
          existing.lastVisit = b.date;
        }
        const vehicleStr = [b.vehicleYear, b.vehicleMake, b.vehicleModel].filter(Boolean).join(' ');
        if (vehicleStr) existing.vehicles.add(vehicleStr);
      } else {
        const vehicleStr = [b.vehicleYear, b.vehicleMake, b.vehicleModel].filter(Boolean).join(' ');
        const vehicleSet = new Set<string>();
        if (vehicleStr) vehicleSet.add(vehicleStr);
        customerMap.set(key, {
          name: b.customerName,
          email: b.customerEmail,
          phone: b.customerPhone ?? null,
          totalBookings: 1,
          totalSpent: b.servicePrice ?? 0,
          lastVisit: b.date,
          vehicles: vehicleSet,
        });
      }
    });

    // Sort by totalSpent descending
    return Array.from(customerMap.values())
      .map((c) => ({
        ...c,
        vehicles: Array.from(c.vehicles),
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [bookings]);

  /* --- Search filtering --- */
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)),
    );
  }, [customers, searchQuery]);

  /* --- Summary stats --- */
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpend = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  const handleAddCustomer = useCallback(() => {
    // Placeholder - would open a modal or navigate to form
  }, []);

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className="flex flex-col gap-6">
      {/* Global scoped styles */}
      <style>{`
        .customers-search-input {
          font-family: inherit;
          font-size: 14px;
          background: var(--white);
          border: 1.5px solid var(--gray-200);
          border-radius: var(--radius-md);
          padding: 10px 14px 10px 40px;
          color: var(--gray-800);
          outline: none;
          transition: all 0.15s ease;
          width: 100%;
        }
        .customers-search-input:focus {
          border-color: var(--electric-blue);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .customers-search-input::placeholder {
          color: var(--gray-400);
        }

        .add-customer-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          background: var(--electric-blue);
          color: var(--white);
          font-size: 13.5px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .add-customer-btn:hover {
          background: var(--electric-blue-hover);
          box-shadow: var(--shadow-glow-blue);
          transform: translateY(-1px);
        }
        .add-customer-btn:active {
          transform: translateY(0);
        }

        .stat-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-100);
          transition: box-shadow 0.15s ease;
        }
        .stat-card:hover {
          box-shadow: var(--shadow-md);
        }

        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .customer-card-animate {
          animation: cardFadeIn 0.3s ease-out both;
        }
      `}</style>

      {/* ============================================================== */}
      {/*  PAGE HEADER                                                     */}
      {/* ============================================================== */}
      <div>
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--gray-900)' }}
        >
          Customers
        </h2>
        <p
          className="text-sm mt-0.5"
          style={{ color: 'var(--gray-500)' }}
        >
          Manage your customer relationships and view booking history
        </p>
      </div>

      {/* ============================================================== */}
      {/*  STATS BAR                                                       */}
      {/* ============================================================== */}
      {!loading && customers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 36,
                  height: 36,
                  background: 'var(--electric-blue-light)',
                }}
              >
                <Users size={16} strokeWidth={2} style={{ color: 'var(--electric-blue)' }} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gray-400)' }}>
                Total Customers
              </p>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--gray-900)' }}>
              {totalCustomers}
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 36,
                  height: 36,
                  background: 'var(--emerald-light)',
                }}
              >
                <DollarSign size={16} strokeWidth={2} style={{ color: 'var(--emerald)' }} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gray-400)' }}>
                Lifetime Revenue
              </p>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--gray-900)' }}>
              {formatCurrency(totalRevenue)}
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 36,
                  height: 36,
                  background: 'var(--violet-light)',
                }}
              >
                <CalendarDays size={16} strokeWidth={2} style={{ color: 'var(--violet)' }} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gray-400)' }}>
                Avg. Spend
              </p>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--gray-900)' }}>
              {formatCurrency(avgSpend)}
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/*  SEARCH + ADD BAR                                                */}
      {/* ============================================================== */}
      <div className="flex items-center gap-3 flex-col sm:flex-row">
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            strokeWidth={1.8}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--gray-400)' }}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="customers-search-input"
            aria-label="Search customers"
          />
        </div>
        <button className="add-customer-btn" onClick={handleAddCustomer}>
          <Plus size={16} strokeWidth={2.5} />
          Add Customer
        </button>
      </div>

      {/* ============================================================== */}
      {/*  CONTENT                                                         */}
      {/* ============================================================== */}
      {/* Error state */}
      {error && !loading && (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-16 px-8 text-center"
          style={{
            background: 'var(--white)',
            border: '1.5px dashed var(--rose)',
          }}
        >
          <div
            className="flex items-center justify-center rounded-full mb-4"
            style={{
              width: 56,
              height: 56,
              background: 'var(--rose-light)',
            }}
          >
            <Inbox size={24} strokeWidth={1.5} style={{ color: 'var(--rose)' }} />
          </div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--rose)' }}>
            Failed to load customers
          </h3>
          <p className="text-xs" style={{ color: 'var(--gray-400)' }}>
            {error}
          </p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CustomerSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Customer grid */}
      {!loading && !error && filteredCustomers.length > 0 && (
        <>
          <p className="text-xs font-medium" style={{ color: 'var(--gray-400)' }}>
            {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'}
            {searchQuery.trim() && ` matching "${searchQuery.trim()}"`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCustomers.map((customer, idx) => (
              <div
                key={customer.email}
                className="customer-card-animate"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <CustomerCard customer={customer} index={idx} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && !error && filteredCustomers.length === 0 && (
        <EmptyState hasSearch={searchQuery.trim().length > 0} />
      )}
    </div>
  );
}
