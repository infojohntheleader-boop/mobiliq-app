'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  CalendarPlus,
  Search,
  Check,
  Play,
  CircleCheck,
  X as XIcon,
  Trash2,
  CalendarDays,
  Clock,
  Car,
  Mail,
  ChevronDown,
  CalendarX,
} from 'lucide-react';

/* ================================================================== */
/*  Types                                                              */
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

type FilterTab = 'all' | 'today' | 'week' | 'pending' | 'confirmed';
type StatusFilter = '' | 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

/* ================================================================== */
/*  Status Configuration                                               */
/* ================================================================== */
const statusConfig: Record<
  string,
  { label: string; dotColor: string; bg: string; text: string }
> = {
  pending: {
    label: 'Pending',
    dotColor: 'var(--accent)',
    bg: 'var(--accent-muted)',
    text: 'var(--accent)',
  },
  confirmed: {
    label: 'Confirmed',
    dotColor: 'var(--emerald)',
    bg: 'var(--emerald-muted)',
    text: 'var(--emerald)',
  },
  'in-progress': {
    label: 'In Progress',
    dotColor: 'var(--amber)',
    bg: 'var(--amber-muted)',
    text: 'var(--amber)',
  },
  completed: {
    label: 'Completed',
    dotColor: 'var(--text-muted)',
    bg: 'var(--border-subtle)',
    text: 'var(--text-tertiary)',
  },
  cancelled: {
    label: 'Cancelled',
    dotColor: 'var(--rose)',
    bg: 'var(--rose-muted)',
    text: 'var(--rose)',
  },
};

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */
function isToday(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isThisWeek(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return d >= startOfWeek && d <= endOfWeek;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function vehicleLabel(b: Booking): string {
  const parts = [b.vehicleYear, b.vehicleMake, b.vehicleModel].filter(Boolean);
  return parts.join(' ') || 'No vehicle info';
}

/* ================================================================== */
/*  Tabs Configuration                                                 */
/* ================================================================== */
const tabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
];

/* ================================================================== */
/*  Skeleton Card                                                      */
/* ================================================================== */
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'var(--bg-secondary)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Dot skeleton */}
        <div
          className="shrink-0 w-3 h-3 rounded-full mt-1.5"
          style={{ background: 'var(--border)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}
        />
        <div className="flex-1 space-y-3">
          {/* Name */}
          <div
            className="h-4 rounded-md w-40"
            style={{ background: 'var(--bg-hover)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}
          />
          {/* Email */}
          <div
            className="h-3 rounded-md w-56"
            style={{ background: 'var(--bg-hover)', animation: 'pulse-soft 1.2s ease-in-out 0.1s infinite' }}
          />
          {/* Vehicle + Service row */}
          <div className="flex gap-4">
            <div
              className="h-3 rounded-md w-32"
              style={{ background: 'var(--bg-hover)', animation: 'pulse-soft 1.2s ease-in-out 0.2s infinite' }}
            />
            <div
              className="h-3 rounded-md w-24"
              style={{ background: 'var(--bg-hover)', animation: 'pulse-soft 1.2s ease-in-out 0.3s infinite' }}
            />
          </div>
          {/* Date/Time + Status row */}
          <div className="flex items-center gap-3 pt-1">
            <div
              className="h-6 rounded-full w-24"
              style={{ background: 'var(--bg-hover)', animation: 'pulse-soft 1.2s ease-in-out 0.4s infinite' }}
            />
            <div
              className="h-6 rounded-full w-20"
              style={{ background: 'var(--bg-hover)', animation: 'pulse-soft 1.2s ease-in-out 0.5s infinite' }}
            />
          </div>
        </div>
        {/* Action buttons skeleton */}
        <div className="shrink-0 flex gap-2">
          <div
            className="h-8 w-8 rounded-lg"
            style={{ background: 'var(--bg-hover)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}
          />
          <div
            className="h-8 w-8 rounded-lg"
            style={{ background: 'var(--bg-hover)', animation: 'pulse-soft 1.2s ease-in-out 0.15s infinite' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Empty State                                                        */
/* ================================================================== */
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      style={{ animation: 'fadeIn 0.4s ease-out both' }}
    >
      <div
        className="flex items-center justify-center rounded-full mb-6"
        style={{
          width: 80,
          height: 80,
          background: 'var(--bg-hover)',
        }}
      >
        <CalendarX size={36} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
      </div>
      <h3
        className="text-[17px] font-semibold mb-2"
        style={{ color: 'var(--text-secondary)' }}
      >
        No appointments yet
      </h3>
      <p
        className="text-[14px] max-w-xs text-center"
        style={{ color: 'var(--text-muted)' }}
      >
        When customers book a service, their appointments will appear here.
      </p>
    </div>
  );
}

/* ================================================================== */
/*  Appointment Card                                                   */
/* ================================================================== */
function AppointmentCard({
  booking,
  onUpdateStatus,
  onDelete,
}: {
  booking: Booking;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const cfg = statusConfig[booking.status] || statusConfig.pending;

  const availableActions: { label: string; icon: React.ElementType; status: string; color: string; bg: string }[] = [];

  if (booking.status === 'pending') {
    availableActions.push(
      { label: 'Confirm', icon: Check, status: 'confirmed', color: 'var(--emerald)', bg: 'var(--emerald-muted)' },
      { label: 'Cancel', icon: XIcon, status: 'cancelled', color: 'var(--rose)', bg: 'var(--rose-muted)' },
    );
  } else if (booking.status === 'confirmed') {
    availableActions.push(
      { label: 'Start', icon: Play, status: 'in-progress', color: 'var(--amber)', bg: 'var(--amber-muted)' },
      { label: 'Cancel', icon: XIcon, status: 'cancelled', color: 'var(--rose)', bg: 'var(--rose-muted)' },
    );
  } else if (booking.status === 'in-progress') {
    availableActions.push(
      { label: 'Complete', icon: CircleCheck, status: 'completed', color: 'var(--emerald)', bg: 'var(--emerald-muted)' },
      { label: 'Cancel', icon: XIcon, status: 'cancelled', color: 'var(--rose)', bg: 'var(--rose-muted)' },
    );
  }

  return (
    <div
      className="rounded-2xl p-5 md:p-6 transition-all duration-200 group"
      style={{
        background: 'var(--bg-secondary)',
        boxShadow: 'var(--shadow-sm)',
        animation: 'fadeIn 0.35s ease-out both',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="flex items-start gap-4">
        {/* Left: Status Dot */}
        <div className="flex flex-col items-center pt-1.5 shrink-0">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{
              background: cfg.dotColor,
              boxShadow: `0 0 8px ${cfg.dotColor}40`,
            }}
          />
          <div
            className="w-0.5 flex-1 mt-1 rounded-full min-h-[40px]"
            style={{ background: 'var(--bg-hover)' }}
          />
        </div>

        {/* Center: Content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Name + Price */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3
              className="text-[15px] font-semibold truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {booking.customerName}
            </h3>
            {booking.servicePrice != null && (
              <span
                className="shrink-0 text-[14px] font-bold tabular-nums"
                style={{ color: 'var(--accent)' }}
              >
                ${Number(booking.servicePrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Row 2: Email */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <Mail size={12} strokeWidth={1.5} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span
              className="text-[12.5px] truncate"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {booking.customerEmail}
            </span>
          </div>

          {/* Row 3: Vehicle + Service */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
            <div className="flex items-center gap-1.5">
              <Car size={12} strokeWidth={1.5} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span
                className="text-[12.5px]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {vehicleLabel(booking)}
              </span>
            </div>
            {booking.serviceName && (
              <span
                className="text-[12.5px] font-medium"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {booking.serviceName}
              </span>
            )}
          </div>

          {/* Row 4: Date, Time, Status Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={12.5} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {formatDate(booking.date)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12.5} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {formatTime(booking.time)}
              </span>
            </div>
            {/* Status badge */}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold"
              style={{ background: cfg.bg, color: cfg.text }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dotColor }} />
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="shrink-0 flex items-center gap-1.5 ml-2">
          {availableActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.status}
                onClick={() => onUpdateStatus(booking.id, action.status)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-150"
                style={{
                  background: action.bg,
                  color: action.color,
                  opacity: 0,
                  transform: 'translateX(4px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(0.95)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
                title={action.label}
                aria-label={action.label}
              >
                <Icon size={13} strokeWidth={2} />
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              if (confirm('Delete this appointment?')) onDelete(booking.id);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-[12px] transition-all duration-150"
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              opacity: 0,
              transform: 'translateX(4px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--rose-muted)';
              e.currentTarget.style.color = 'var(--rose)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            title="Delete"
            aria-label="Delete appointment"
          >
            <Trash2 size={13.5} strokeWidth={1.8} />
          </button>
        </div>
      </div>

    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                */
/* ================================================================== */
export default function AppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  /* --- Fetch bookings ----------------------------------------------- */
  const loadBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  /* --- Filter bookings ---------------------------------------------- */
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Tab filter
    if (activeTab === 'today') {
      result = result.filter((b) => isToday(b.date));
    } else if (activeTab === 'week') {
      result = result.filter((b) => isThisWeek(b.date));
    } else if (activeTab === 'pending') {
      result = result.filter((b) => b.status === 'pending');
    } else if (activeTab === 'confirmed') {
      result = result.filter((b) => b.status === 'confirmed');
    }

    // Status dropdown filter
    if (statusFilter) {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.customerName.toLowerCase().includes(q) ||
          b.customerEmail.toLowerCase().includes(q) ||
          (b.serviceName || '').toLowerCase().includes(q) ||
          vehicleLabel(b).toLowerCase().includes(q),
      );
    }

    // Sort by date desc, then time desc
    result.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return (b.time || '').localeCompare(a.time || '');
    });

    return result;
  }, [bookings, activeTab, searchQuery, statusFilter]);

  /* --- Update status ------------------------------------------------ */
  async function handleUpdateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status } : b)),
        );
      }
    } catch {
      // Silently handle
    }
  }

  /* --- Delete -------------------------------------------------------- */
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } catch {
      // Silently handle
    }
  }

  /* --- Close status dropdown on outside click ----------------------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-status-dropdown]')) {
        setStatusDropdownOpen(false);
      }
    }
    if (statusDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [statusDropdownOpen]);

  /* ================================================================== */
  /*  RENDER                                                            */
  /* ================================================================== */
  return (
    <div className="max-w-[1200px] mx-auto">
      {/* ============================================================== */}
      {/*  PAGE HEADER                                                    */}
      {/* ============================================================== */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        style={{ animation: 'fadeIn 0.3s ease-out both' }}
      >
        <div>
          <h2
            className="text-[22px] md:text-[26px] font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Appointments
          </h2>
          <p
            className="text-[13.5px] mt-1"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Manage your upcoming bookings and schedule
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold text-white shrink-0 transition-all duration-150"
          style={{
            background: 'var(--accent)',
            boxShadow: 'var(--shadow-glow)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(37,99,235,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--accent)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
          }}
        >
          <CalendarPlus size={16} strokeWidth={2} />
          New Appointment
        </button>
      </div>

      {/* ============================================================== */}
      {/*  FILTER BAR                                                     */}
      {/* ============================================================== */}
      <div
        className="mb-6"
        style={{ animation: 'fadeIn 0.35s ease-out 0.1s both' }}
      >
        <div
          className="rounded-2xl p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
          style={{
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="shrink-0 px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-150"
                style={{
                  background:
                    activeTab === tab.key ? 'var(--accent)' : 'transparent',
                  color:
                    activeTab === tab.key ? 'var(--white)' : 'var(--text-tertiary)',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-tertiary)';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="hidden md:block flex-1" />

          {/* Search */}
          <div className="relative flex-1 md:flex-none md:w-64">
            <Search
              size={14.5}
              strokeWidth={1.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-[13px] rounded-lg w-full"
              style={{
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative" data-status-dropdown>
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] font-medium shrink-0 transition-all duration-150"
              style={{
                background: statusFilter ? 'var(--bg-secondary)' : 'transparent',
                border: '1.5px solid var(--border)',
                color: statusFilter ? 'var(--text-secondary)' : 'var(--text-tertiary)',
              }}
            >
              <span>{statusFilter ? statusConfig[statusFilter]?.label || 'All Status' : 'All Status'}</span>
              <ChevronDown
                size={14}
                strokeWidth={2}
                className="transition-transform duration-150"
                style={{
                  transform: statusDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                }}
              />
            </button>
            {statusDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 py-1 rounded-xl z-20 min-w-[160px]"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-lg)',
                  animation: 'fadeIn 0.15s ease-out both',
                }}
              >
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setStatusDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-[12.5px] transition-colors duration-100"
                  style={{
                    color: 'var(--text-tertiary)',
                    background: statusFilter === '' ? 'var(--bg-secondary)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  All Status
                </button>
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setStatusFilter(key as StatusFilter);
                      setStatusDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[12.5px] transition-colors duration-100 flex items-center gap-2"
                    style={{
                      color: 'var(--text-tertiary)',
                      background: statusFilter === key ? 'var(--bg-secondary)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: cfg.dotColor }}
                    />
                    {cfg.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/*  RESULTS COUNT                                                  */}
      {/* ============================================================== */}
      {!loading && (
        <p
          className="text-[12.5px] font-medium mb-4"
          style={{ color: 'var(--text-muted)', animation: 'fadeIn 0.3s ease-out both' }}
        >
          {filteredBookings.length} appointment{filteredBookings.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* ============================================================== */}
      {/*  CONTENT                                                        */}
      {/* ============================================================== */}
      {loading ? (
        /* Skeleton */
        <div className="space-y-3" style={{ animation: 'fadeIn 0.3s ease-out both' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState />
      ) : (
        /* Appointment cards */
        <div className="space-y-3">
          {filteredBookings.map((booking, i) => (
            <AppointmentCard
              key={booking.id}
              booking={booking}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/*  HOVER ACTION BUTTONS STYLE FIX                                 */}
      {/* ============================================================== */}
      <style>{`
        .rounded-2xl:hover button[style*="opacity: 0"] {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>
    </div>
  );
}
