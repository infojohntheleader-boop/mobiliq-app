'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Car,
  User,
  X,
  CalendarDays,
  DollarSign,
  CircleDot,
} from 'lucide-react';

/* ================================================================== */
/*  Types                                                               */
/* ================================================================== */
type AppointmentStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

interface Appointment {
  id: string;
  time: string;
  endTime: string;
  customerFirst: string;
  customerLast: string;
  customerEmail: string;
  customerPhone: string;
  vehicle: string;
  service: string;
  status: AppointmentStatus;
  price: number;
  day: number;
  month: number;
  year: number;
}

/* ================================================================== */
/*  Status Configuration                                                */
/* ================================================================== */
const statusConfig: Record<
  AppointmentStatus,
  { label: string; pillBg: string; pillText: string; dotColor: string; badgeBg: string; badgeText: string }
> = {
  pending: {
    label: 'Pending',
    pillBg: 'var(--accent-muted)',
    pillText: 'var(--accent)',
    dotColor: '#2563eb',
    badgeBg: 'var(--accent-muted)',
    badgeText: 'var(--accent)',
  },
  confirmed: {
    label: 'Confirmed',
    pillBg: 'var(--emerald-muted)',
    pillText: 'var(--emerald)',
    dotColor: '#059669',
    badgeBg: 'var(--emerald-muted)',
    badgeText: 'var(--emerald)',
  },
  'in-progress': {
    label: 'In Progress',
    pillBg: 'var(--amber-muted)',
    pillText: 'var(--amber)',
    dotColor: '#d97706',
    badgeBg: 'var(--amber-muted)',
    badgeText: 'var(--amber)',
  },
  completed: {
    label: 'Completed',
    pillBg: 'var(--bg-hover)',
    pillText: 'var(--text-tertiary)',
    dotColor: '#868e96',
    badgeBg: 'var(--bg-hover)',
    badgeText: 'var(--text-tertiary)',
  },
  cancelled: {
    label: 'Cancelled',
    pillBg: 'var(--rose-muted)',
    pillText: 'var(--rose)',
    dotColor: '#e11d48',
    badgeBg: 'var(--rose-muted)',
    badgeText: 'var(--rose)',
  },
};

/* ================================================================== */
/*  Demo Data Generator                                                 */
/* ================================================================== */
function generateDemoAppointments(): Appointment[] {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const today = now.getDate();

  const customerPool = [
    { first: 'Marcus', last: 'Johnson', email: 'marcus.j@email.com', phone: '(555) 234-5678' },
    { first: 'Sophia', last: 'Chen', email: 'sophia.c@email.com', phone: '(555) 345-6789' },
    { first: 'Elijah', last: 'Williams', email: 'elijah.w@email.com', phone: '(555) 456-7890' },
    { first: 'Ava', last: 'Martinez', email: 'ava.m@email.com', phone: '(555) 567-8901' },
    { first: 'Liam', last: 'Thompson', email: 'liam.t@email.com', phone: '(555) 678-9012' },
    { first: 'Isabella', last: 'Garcia', email: 'isabella.g@email.com', phone: '(555) 789-0123' },
    { first: 'Noah', last: 'Anderson', email: 'noah.a@email.com', phone: '(555) 890-1234' },
    { first: 'Emma', last: 'Taylor', email: 'emma.t@email.com', phone: '(555) 901-2345' },
    { first: 'James', last: 'Brown', email: 'james.b@email.com', phone: '(555) 012-3456' },
    { first: 'Olivia', last: 'Davis', email: 'olivia.d@email.com', phone: '(555) 123-4567' },
    { first: 'Lucas', last: 'Wilson', email: 'lucas.w@email.com', phone: '(555) 234-8901' },
    { first: 'Mia', last: 'Moore', email: 'mia.m@email.com', phone: '(555) 345-9012' },
  ];

  const servicePool = [
    { name: 'Full Detail', duration: 120, price: 249 },
    { name: 'Express Wash', duration: 45, price: 79 },
    { name: 'Interior Deep Clean', duration: 90, price: 179 },
    { name: 'Ceramic Coating', duration: 180, price: 449 },
    { name: 'Paint Correction', duration: 240, price: 599 },
    { name: 'Engine Bay Detail', duration: 60, price: 129 },
    { name: 'Headlight Restore', duration: 30, price: 59 },
  ];

  const vehiclePool = [
    '2024 BMW X5',
    '2023 Mercedes-AMG C63',
    '2024 Porsche 911',
    '2023 Audi RS6 Avant',
    '2024 Tesla Model S',
    '2022 Range Rover Sport',
    '2023 Lexus LC 500',
    '2024 Maserati MC20',
    '2023 BMW M4 Competition',
    '2024 Mercedes G-Wagon',
  ];

  const statuses: AppointmentStatus[] = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
  const timeSlots = ['08:00', '09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

  // Spread appointments across the month, with some on today and nearby days
  const appointments: Appointment[] = [];
  let id = 1;

  // Ensure today has 2-3 appointments
  const todaySlots = [0, 3, 5];
  todaySlots.forEach((si) => {
    const customer = customerPool[todaySlots.indexOf(si) * 3];
    const service = servicePool[si];
    const hour = parseInt(timeSlots[si].split(':')[0]);
    const min = parseInt(timeSlots[si].split(':')[1]);
    appointments.push({
      id: `appt-${id++}`,
      time: timeSlots[si],
      endTime: `${String(hour + Math.floor(service.duration / 60)).padStart(2, '0')}:${String(min + (service.duration % 60)).padStart(2, '0')}`,
      customerFirst: customer.first,
      customerLast: customer.last,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      vehicle: vehiclePool[si],
      service: service.name,
      status: si === 0 ? 'in-progress' : si === 3 ? 'confirmed' : 'pending',
      price: service.price,
      day: today,
      month,
      year,
    });
  });

  // Spread 15 more across the month
  const usedDays = new Set([today]);
  for (let i = 0; i < 15; i++) {
    let day: number;
    do {
      day = Math.floor(Math.random() * 28) + 1;
    } while (usedDays.has(day));
    usedDays.add(day);

    const ci = i % customerPool.length;
    const customer = customerPool[ci];
    const si = i % servicePool.length;
    const service = servicePool[si];
    const ti = i % timeSlots.length;
    const time = timeSlots[ti];
    const hour = parseInt(time.split(':')[0]);
    const min = parseInt(time.split(':')[1]);
    const statusIdx = i % (statuses.length - 1); // skip cancelled mostly
    const status = day < today ? statuses[Math.min(statusIdx + 3, statuses.length - 1)] : statuses[statusIdx];

    appointments.push({
      id: `appt-${id++}`,
      time,
      endTime: `${String(hour + Math.floor(service.duration / 60)).padStart(2, '0')}:${String(min + (service.duration % 60)).padStart(2, '0')}`,
      customerFirst: customer.first,
      customerLast: customer.last,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      vehicle: vehiclePool[ci % vehiclePool.length],
      service: service.name,
      status,
      price: service.price,
      day,
      month,
      year,
    });
  }

  // Add a couple multi-appointment days (2 appointments on same day)
  const extraDays = [3, 8, 15, 22, 27].filter((d) => d !== today);
  extraDays.forEach((d, idx) => {
    if (d > 28) return;
    const customer = customerPool[(idx + 6) % customerPool.length];
    const service = servicePool[(idx + 2) % servicePool.length];
    const time = timeSlots[(idx + 4) % timeSlots.length];
    const hour = parseInt(time.split(':')[0]);
    const min = parseInt(time.split(':')[1]);
    appointments.push({
      id: `appt-${id++}`,
      time,
      endTime: `${String(hour + Math.floor(service.duration / 60)).padStart(2, '0')}:${String(min + (service.duration % 60)).padStart(2, '0')}`,
      customerFirst: customer.first,
      customerLast: customer.last,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      vehicle: vehiclePool[(idx + 4) % vehiclePool.length],
      service: service.name,
      status: d < today ? 'completed' : 'confirmed',
      price: service.price,
      day: d,
      month,
      year,
    });
  });

  return appointments.sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
}

/* ================================================================== */
/*  Helpers                                                             */
/* ================================================================== */
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  // Convert Sunday=0 to Monday-based: Mon=0, Tue=1, ..., Sun=6
  return day === 0 ? 6 : day - 1;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatDate(day: number, month: number, year: number): string {
  const date = new Date(year, month, day);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

/* ================================================================== */
/*  Calendar Page Component                                             */
/* ================================================================== */
export default function CalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(0 as unknown as 1 | -1);
  const [animating, setAnimating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const demoAppointments = useMemo(() => generateDemoAppointments(), []);

  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // Filter appointments for current view month
  const monthAppointments = useMemo(
    () => demoAppointments.filter((a) => a.month === currentMonth && a.year === currentYear),
    [currentMonth, currentYear, demoAppointments],
  );

  // Appointments grouped by day
  const appointmentsByDay = useMemo(() => {
    const map: Record<number, Appointment[]> = {};
    monthAppointments.forEach((a) => {
      if (!map[a.day]) map[a.day] = [];
      map[a.day].push(a);
    });
    return map;
  }, [monthAppointments]);

  // Selected day appointments
  const selectedAppointments = useMemo(
    () => (selectedDay ? (appointmentsByDay[selectedDay] || []) : []),
    [selectedDay, appointmentsByDay],
  );

  // Calendar grid cells
  const calendarCells = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    const cells: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    // Previous month fill
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
      });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, d),
      });
    }

    // Next month fill (to complete rows)
    const remaining = (7 - (cells.length % 7)) % 7;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        day: d,
        isCurrentMonth: false,
        date: new Date(nextYear, nextMonth, d),
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  /* --- Month Navigation --- */
  const navigateMonth = useCallback(
    (delta: number) => {
      if (animating) return;
      setDirection(delta as 1 | -1);
      setAnimating(true);
      setSelectedDay(null);
      setSidebarOpen(false);

      setTimeout(() => {
        let newMonth = currentMonth + delta;
        let newYear = currentYear;
        if (newMonth > 11) {
          newMonth = 0;
          newYear++;
        } else if (newMonth < 0) {
          newMonth = 11;
          newYear--;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setTimeout(() => setAnimating(false), 50);
      }, 150);
    },
    [currentMonth, currentYear, animating],
  );

  const goToToday = useCallback(() => {
    setCurrentMonth(todayMonth);
    setCurrentYear(todayYear);
    setSelectedDay(todayDate);
    setSidebarOpen(true);
  }, [todayMonth, todayYear, todayDate]);

  const handleDayClick = useCallback(
    (day: number, isCurrentMonth: boolean) => {
      if (!isCurrentMonth) return;
      setSelectedDay(day);
      setSidebarOpen(true);
    },
    [],
  );

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - var(--header-height) - 64px)' }}>
      {/* Global scoped styles */}
      <style>{`
        .cal-container {
          display: flex;
          flex-direction: column;
          gap: 0;
          height: 100%;
        }

        /* --- Calendar grid --- */
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          flex: 1;
        }

        /* --- Day cell --- */
        .cal-cell {
          position: relative;
          min-height: 100px;
          padding: 6px;
          background: var(--bg-secondary);
          cursor: pointer;
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
          border: 1.5px solid transparent;
        }
        .cal-cell:hover {
          border-color: var(--accent);
          box-shadow: var(--shadow-glow);
          z-index: 2;
        }
        .cal-cell.cal-cell-selected {
          border-color: var(--accent);
          background: var(--accent-muted);
          box-shadow: var(--shadow-glow);
          z-index: 2;
        }
        .cal-cell.cal-cell-dimmed {
          opacity: 0.35;
        }

        /* --- Day number --- */
        .cal-day-num {
          font-size: 13px;
          font-weight: 500;
          line-height: 1;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }
        .cal-cell-today .cal-day-num {
          color: var(--accent);
          font-weight: 700;
        }

        /* --- Today circle --- */
        .cal-today-circle {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0;
        }
        .cal-today-circle .cal-day-num {
          color: var(--white);
          font-weight: 700;
          position: relative;
          z-index: 1;
        }

        /* --- Appointment pill --- */
        .cal-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
          transition: transform 0.1s ease;
        }
        .cal-pill:hover {
          transform: translateX(1px);
        }

        /* --- More indicator --- */
        .cal-more {
          font-size: 10.5px;
          font-weight: 600;
          color: var(--text-tertiary);
          padding: 1px 6px;
          cursor: pointer;
        }
        .cal-more:hover {
          color: var(--accent);
        }

        /* --- Weekday header --- */
        .cal-weekday {
          text-align: center;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 8px 0;
        }

        /* --- Sidebar panel --- */
        .cal-sidebar {
          width: 360px;
          flex-shrink: 0;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          overflow-y: auto;
          max-height: calc(100vh - var(--header-height) - 180px);
          position: sticky;
          top: calc(var(--header-height) + 32px);
        }

        /* --- Detail appointment card --- */
        .detail-card {
          padding: 16px;
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          margin-bottom: 10px;
          transition: box-shadow 0.15s ease;
        }
        .detail-card:hover {
          box-shadow: var(--shadow-sm);
        }

        /* --- Status badge --- */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        /* --- Nav button --- */
        .cal-nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1.5px solid var(--border);
          background: var(--bg-secondary);
          color: var(--text-tertiary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .cal-nav-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          box-shadow: var(--shadow-glow);
        }

        .cal-today-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 10px;
          border: 1.5px solid var(--accent);
          background: var(--bg-secondary);
          color: var(--accent);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .cal-today-btn:hover {
          background: var(--accent);
          color: var(--white);
          box-shadow: var(--shadow-glow);
        }

        /* --- Month transition animation --- */
        .cal-slide-enter {
          animation: calSlideIn 0.2s ease-out forwards;
        }

        @keyframes calSlideIn {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }

        /* --- Mobile bottom sheet --- */
        .cal-bottom-sheet-overlay {
          position: fixed;
          inset: 0;
          background: rgba(13, 17, 23, 0.3);
          backdrop-filter: blur(2px);
          z-index: 60;
          animation: fadeIn 0.15s ease-out;
        }

        .cal-bottom-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          max-height: 70vh;
          background: var(--bg-secondary);
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
          box-shadow: var(--shadow-xl);
          z-index: 61;
          overflow-y: auto;
          animation: slideUp 0.25s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .cal-bottom-sheet-handle {
          width: 36px;
          height: 4px;
          border-radius: 2px;
          background: var(--text-muted);
          margin: 10px auto 0;
        }

        /* --- Responsive adjustments --- */
        @media (max-width: 1023px) {
          .cal-cell { min-height: 80px; }
        }
        @media (max-width: 767px) {
          .cal-cell { min-height: 64px; padding: 4px; }
          .cal-day-num { font-size: 12px; }
          .cal-today-circle { width: 22px; height: 22px; top: 3px; left: 3px; }
          .cal-pill { font-size: 9.5px; padding: 1px 4px; border-radius: 4px; }
          .cal-weekday { font-size: 10px; padding: 6px 0; }
        }

        /* --- Empty state --- */
        .cal-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          text-align: center;
        }
      `}</style>

      {/* ============================================================== */}
      {/*  PAGE HEADER                                                     */}
      {/* ============================================================== */}
      <div
        className="flex items-center justify-between flex-wrap gap-4 pb-6"
      >
        {/* Left: Title */}
        <div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Calendar
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Manage your appointments and schedule
          </p>
        </div>

        {/* Center: Month navigation */}
        <div className="flex items-center gap-3">
          <button className="cal-nav-btn" onClick={() => navigateMonth(-1)} aria-label="Previous month">
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <div className="text-center min-w-[180px]">
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {MONTH_NAMES[currentMonth]}{' '}
              <span style={{ color: 'var(--text-tertiary)' }}>{currentYear}</span>
            </span>
          </div>
          <button className="cal-nav-btn" onClick={() => navigateMonth(1)} aria-label="Next month">
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Right: Today button */}
        <button className="cal-today-btn" onClick={goToToday}>
          <CalendarDays size={14} strokeWidth={2.2} />
          Today
        </button>
      </div>

      {/* ============================================================== */}
      {/*  CALENDAR BODY: Grid + Sidebar                                   */}
      {/* ============================================================== */}
      <div className="flex gap-6 flex-col lg:flex-row" style={{ minHeight: 0 }}>
        {/* ----- Calendar Grid ----- */}
        <div className="flex-1 cal-container cal-slide-enter" key={`${currentMonth}-${currentYear}-${animating}`}>
          {/* Weekday headers */}
          <div className="cal-grid" style={{ marginBottom: 1 }}>
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="cal-weekday" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0' }}>
                {wd}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="cal-grid" style={{ borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            {calendarCells.map((cell, idx) => {
              const dayAppointments = cell.isCurrentMonth ? appointmentsByDay[cell.day] || [] : [];
              const isToday = cell.isCurrentMonth && cell.day === todayDate && currentMonth === todayMonth && currentYear === todayYear;
              const isSelected = cell.isCurrentMonth && cell.day === selectedDay;
              const maxShow = 3;
              const visibleAppointments = dayAppointments.slice(0, maxShow);
              const moreCount = dayAppointments.length - maxShow;

              return (
                <div
                  key={idx}
                  className={`cal-cell${!cell.isCurrentMonth ? ' cal-cell-dimmed' : ''}${isToday ? ' cal-cell-today' : ''}${isSelected ? ' cal-cell-selected' : ''}`}
                  onClick={() => handleDayClick(cell.day, cell.isCurrentMonth)}
                  role="button"
                  tabIndex={cell.isCurrentMonth ? 0 : -1}
                  aria-label={`${cell.isCurrentMonth ? cell.day : ''} ${cell.isCurrentMonth ? MONTH_NAMES[currentMonth] : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDayClick(cell.day, cell.isCurrentMonth);
                    }
                  }}
                >
                  {/* Day number */}
                  {isToday ? (
                    <div className="cal-today-circle">
                      <span className="cal-day-num">{cell.day}</span>
                    </div>
                  ) : (
                    <div className="cal-day-num">{cell.day}</div>
                  )}

                  {/* Appointment pills */}
                  {visibleAppointments.map((appt) => {
                    const cfg = statusConfig[appt.status];
                    return (
                      <div
                        key={appt.id}
                        className="cal-pill"
                        style={{ background: cfg.pillBg, color: cfg.pillText }}
                        title={`${appt.time} - ${appt.customerFirst} ${appt.customerLast}`}
                      >
                        <Clock size={10} strokeWidth={2} className="shrink-0" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {appt.time} {appt.customerFirst}
                        </span>
                      </div>
                    );
                  })}

                  {/* +N more indicator */}
                  {moreCount > 0 && (
                    <div className="cal-more" onClick={(e) => { e.stopPropagation(); handleDayClick(cell.day, true); }}>
                      +{moreCount} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/*  DESKTOP SIDEBAR (selected day detail)                          */}
        {/* ============================================================== */}
        <div className="hidden lg:block">
          {selectedDay && (
            <div className="cal-sidebar cal-slide-enter" key={`sidebar-${selectedDay}`}>
              <SelectedDayPanel
                day={selectedDay}
                month={currentMonth}
                year={currentYear}
                appointments={selectedAppointments}
                onClose={() => setSelectedDay(null)}
              />
            </div>
          )}
          {!selectedDay && (
            <div
              className="cal-sidebar flex items-center justify-center"
              style={{ minHeight: 300 }}
            >
              <div className="cal-empty">
                <CalendarDays size={40} strokeWidth={1.2} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                  Select a day
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Click on any day to view appointment details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/*  MOBILE BOTTOM SHEET                                              */}
      {/* ============================================================== */}
      {selectedDay && sidebarOpen && (
        <div className="lg:hidden">
          {/* Overlay */}
          <div
            className="cal-bottom-sheet-overlay"
            onClick={() => {
              setSidebarOpen(false);
              setSelectedDay(null);
            }}
            aria-hidden="true"
          />
          {/* Sheet */}
          <div className="cal-bottom-sheet">
            <div className="cal-bottom-sheet-handle" />
            <div className="p-5 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {formatDate(selectedDay, currentMonth, currentYear)}
                </h3>
                <button
                  className="p-2 rounded-lg"
                  style={{ color: 'var(--text-muted)' }}
                  onClick={() => {
                    setSidebarOpen(false);
                    setSelectedDay(null);
                  }}
                  aria-label="Close"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>

              {selectedAppointments.length === 0 ? (
                <div className="cal-empty" style={{ padding: '32px 16px' }}>
                  <CalendarDays size={32} strokeWidth={1.2} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                    No appointments
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    This day is free from scheduled work
                  </p>
                </div>
              ) : (
                selectedAppointments.map((appt) => (
                  <AppointmentDetailCard key={appt.id} appointment={appt} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Selected Day Panel (Desktop)                                        */
/* ================================================================== */
function SelectedDayPanel({
  day,
  month,
  year,
  appointments,
  onClose,
}: {
  day: number;
  month: number;
  year: number;
  appointments: Appointment[];
  onClose: () => void;
}) {
  const totalRevenue = appointments.reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3
          className="text-base font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Selected Day
        </h3>
        <button
          className="p-1.5 rounded-lg"
          style={{ color: 'var(--text-muted)' }}
          onClick={onClose}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          aria-label="Close panel"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>
      <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
        {formatDate(day, month, year)}
      </p>

      {/* Summary stats */}
      {appointments.length > 0 && (
        <div
          className="flex gap-3 mb-4"
        >
          <div
            className="flex-1 rounded-xl p-3 text-center"
            style={{ background: 'var(--accent-muted)' }}
          >
            <p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
              {appointments.length}
            </p>
            <p className="text-[11px] font-medium" style={{ color: 'var(--accent)' }}>
              Appointments
            </p>
          </div>
          <div
            className="flex-1 rounded-xl p-3 text-center"
            style={{ background: 'var(--emerald-muted)' }}
          >
            <p className="text-xl font-bold" style={{ color: 'var(--emerald)' }}>
              ${totalRevenue}
            </p>
            <p className="text-[11px] font-medium" style={{ color: 'var(--emerald)' }}>
              Revenue
            </p>
          </div>
        </div>
      )}

      {/* Appointment list */}
      {appointments.length === 0 ? (
        <div className="cal-empty" style={{ padding: '32px 16px' }}>
          <CalendarDays size={32} strokeWidth={1.2} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
            No appointments scheduled
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            This day is free from bookings
          </p>
        </div>
      ) : (
        appointments.map((appt) => (
          <AppointmentDetailCard key={appt.id} appointment={appt} />
        ))
      )}
    </div>
  );
}

/* ================================================================== */
/*  Appointment Detail Card (reusable)                                  */
/* ================================================================== */
function AppointmentDetailCard({ appointment }: { appointment: Appointment }) {
  const cfg = statusConfig[appointment.status];

  return (
    <div className="detail-card">
      {/* Time + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={14} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {formatTime(appointment.time)} &ndash; {formatTime(appointment.endTime)}
          </span>
        </div>
        <span className="status-badge" style={{ background: cfg.badgeBg, color: cfg.badgeText }}>
          <span className="status-dot" style={{ background: cfg.dotColor }} />
          {cfg.label}
        </span>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="flex items-center justify-center rounded-full text-[11px] font-bold shrink-0"
          style={{
            width: 28,
            height: 28,
            background: 'var(--accent)',
            color: 'var(--white)',
          }}
        >
          {appointment.customerFirst[0]}{appointment.customerLast[0]}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {appointment.customerFirst} {appointment.customerLast}
          </p>
          <p className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>
            {appointment.customerEmail}
          </p>
        </div>
      </div>

      {/* Vehicle + Service */}
      <div className="flex flex-col gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <Car size={13} strokeWidth={1.8} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            {appointment.vehicle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User size={13} strokeWidth={1.8} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            {appointment.service}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={13} strokeWidth={1.8} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
            ${appointment.price}
          </span>
        </div>
      </div>
    </div>
  );
}
