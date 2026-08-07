'use client';

import Link from 'next/link';
import {
  DollarSign,
  CalendarCheck,
  Car,
  Receipt,
  ArrowUpRight,
  UserPlus,
  CreditCard,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

// Data: Appointments for today
const appointments = [
  {
    id: 1,
    time: '08:00 AM',
    customer: 'James Rodriguez',
    vehicle: '2023 BMW X5 - Black',
    service: 'Full Detail',
    status: 'completed' as const,
  },
  {
    id: 2,
    time: '09:30 AM',
    customer: 'Sarah Chen',
    vehicle: '2024 Tesla Model 3 - White',
    service: 'Ceramic Coating',
    status: 'in-progress' as const,
  },
  {
    id: 3,
    time: '10:00 AM',
    customer: 'Marcus Williams',
    vehicle: '2022 Mercedes C300 - Silver',
    service: 'Interior Deep Clean',
    status: 'in-progress' as const,
  },
  {
    id: 4,
    time: '11:30 AM',
    customer: 'Emily Park',
    vehicle: '2024 Audi Q7 - Gray',
    service: 'Exterior Wash & Wax',
    status: 'confirmed' as const,
  },
  {
    id: 5,
    time: '01:00 PM',
    customer: 'David Kim',
    vehicle: '2023 Porsche 911 - Red',
    service: 'Paint Correction',
    status: 'confirmed' as const,
  },
  {
    id: 6,
    time: '02:30 PM',
    customer: 'Ava Thompson',
    vehicle: '2024 Lexus RX - Pearl',
    service: 'Full Detail',
    status: 'confirmed' as const,
  },
];

// Data: Weekly revenue for the bar chart
const weeklyRevenue = [
  { day: 'Mon', amount: 3200 },
  { day: 'Tue', amount: 2800 },
  { day: 'Wed', amount: 4100 },
  { day: 'Thu', amount: 3600 },
  { day: 'Fri', amount: 4800 },
  { day: 'Sat', amount: 5600 },
  { day: 'Sun', amount: 2400 },
];

const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.amount));
const totalWeeklyRevenue = weeklyRevenue.reduce((s, d) => s + d.amount, 0);

// Data: Recent activity feed
const recentActivity = [
  {
    id: 1,
    type: 'customer' as const,
    message: 'New customer registered - Ava Thompson',
    time: '12 min ago',
    icon: UserPlus,
    color: 'var(--violet)' as const,
  },
  {
    id: 2,
    type: 'payment' as const,
    message: 'Payment received - $349.00 from Marcus Williams',
    time: '34 min ago',
    icon: CreditCard,
    color: 'var(--emerald)' as const,
  },
  {
    id: 3,
    type: 'complete' as const,
    message: 'Full Detail completed for James Rodriguez',
    time: '1 hr ago',
    icon: CheckCircle2,
    color: 'var(--electric-blue)' as const,
  },
  {
    id: 4,
    type: 'service' as const,
    message: 'New booking - Ceramic Coating for Emily Park',
    time: '2 hr ago',
    icon: Sparkles,
    color: 'var(--amber)' as const,
  },
];

// Helpers
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string; bar: string }> = {
  confirmed: {
    label: 'Confirmed',
    bg: 'var(--electric-blue-light)',
    text: 'var(--electric-blue)',
    dot: 'var(--electric-blue)',
    bar: 'var(--electric-blue)',
  },
  'in-progress': {
    label: 'In Progress',
    bg: 'var(--amber-light)',
    text: 'var(--amber)',
    dot: 'var(--amber)',
    bar: 'var(--amber)',
  },
  completed: {
    label: 'Completed',
    bg: 'var(--emerald-light)',
    text: 'var(--emerald)',
    dot: 'var(--emerald)',
    bar: 'var(--emerald)',
  },
};

// Stat Card component
function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  trend,
  trendColor,
  sub,
  delay,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  trend?: string;
  trendColor?: string;
  sub?: string;
  delay: number;
}) {
  return (
    <div
      className="relative rounded-2xl p-6 transition-shadow duration-200"
      style={{
        background: 'var(--white)',
        boxShadow: 'var(--shadow-sm)',
        animation: `fadeIn 0.4s ease-out ${delay}ms both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div
        className="absolute top-6 right-6 flex items-center justify-center rounded-xl"
        style={{ width: 42, height: 42, background: iconBg, color: iconColor }}
      >
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <p className="text-[13px] font-medium mb-1 pr-14" style={{ color: 'var(--gray-500)' }}>
        {label}
      </p>
      <p
        className="text-[28px] font-bold tracking-tight leading-none mb-2"
        style={{ color: 'var(--gray-900)' }}
      >
        {value}
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        {trend && (
          <span
            className="inline-flex items-center gap-1 text-[12px] font-semibold"
            style={{ color: trendColor || 'var(--emerald)' }}
          >
            <ArrowUpRight size={14} strokeWidth={2.5} />
            {trend}
          </span>
        )}
        {sub && (
          <span className="text-[12.5px]" style={{ color: 'var(--gray-400)' }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

// Appointment Row component
function AppointmentRow({
  appointment,
  delay,
}: {
  appointment: (typeof appointments)[0];
  delay: number;
}) {
  const cfg = statusConfig[appointment.status];

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-100"
      style={{
        background: 'var(--white)',
        borderLeft: `3px solid ${cfg.bar}`,
        boxShadow: 'var(--shadow-xs)',
        animation: `fadeIn 0.35s ease-out ${delay}ms both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--gray-25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--white)';
      }}
    >
      <div className="shrink-0 pt-0.5" style={{ width: 72 }}>
        <p className="text-[13px] font-semibold tabular-nums" style={{ color: 'var(--gray-800)' }}>
          {appointment.time}
        </p>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold truncate" style={{ color: 'var(--gray-900)' }}>
          {appointment.customer}
        </p>
        <p className="text-[12.5px] truncate mt-0.5" style={{ color: 'var(--gray-500)' }}>
          {appointment.vehicle}
        </p>
        <p className="text-[12px] mt-1 font-medium" style={{ color: 'var(--gray-400)' }}>
          {appointment.service}
        </p>
      </div>

      <span
        className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold"
        style={{ background: cfg.bg, color: cfg.text }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
        {cfg.label}
      </span>
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const todayDow = new Date().getDay();
  const todayIndex = todayDow === 0 ? 6 : todayDow - 1; // Mon=0 .. Sun=6

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-8" style={{ animation: 'fadeIn 0.3s ease-out both' }}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2
              className="text-[22px] md:text-[26px] font-bold tracking-tight"
              style={{ color: 'var(--gray-900)' }}
            >
              {getGreeting()}, Alex
            </h2>
            <p className="text-[14px] mt-1" style={{ color: 'var(--gray-500)' }}>
              {formatDate()}
            </p>
          </div>
          <Link
            href="/dashboard/appointments"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold shrink-0"
            style={{ color: 'var(--electric-blue)' }}
          >
            View all appointments
            <ArrowUpRight size={15} strokeWidth={2.2} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-8">
        <StatCard
          icon={DollarSign}
          iconBg="var(--emerald-light)"
          iconColor="var(--emerald)"
          value="$2,840"
          label="Revenue Today"
          trend="+12.5% from yesterday"
          trendColor="var(--emerald)"
          delay={60}
        />
        <StatCard
          icon={CalendarCheck}
          iconBg="var(--electric-blue-light)"
          iconColor="var(--electric-blue)"
          value="8"
          label="Appointments Today"
          sub="3 remaining"
          delay={120}
        />
        <StatCard
          icon={Car}
          iconBg="var(--amber-light)"
          iconColor="var(--amber)"
          value="4"
          label="Vehicles in Progress"
          sub="2 washing · 1 coating · 1 QC"
          delay={180}
        />
        <StatCard
          icon={Receipt}
          iconBg="var(--violet-light)"
          iconColor="var(--violet)"
          value="$1,240"
          label="Pending Invoices"
          sub="5 invoices"
          delay={240}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">
        <div
          className="lg:col-span-3 rounded-2xl p-6"
          style={{
            background: 'var(--white)',
            boxShadow: 'var(--shadow-sm)',
            animation: 'fadeIn 0.4s ease-out 300ms both',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--gray-900)' }}>
              Today's Schedule
            </h3>
            <span
              className="text-[12px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'var(--gray-100)', color: 'var(--gray-500)' }}
            >
              {appointments.length} appointments
            </span>
          </div>
          <div className="space-y-2.5">
            {appointments.map((appt, i) => (
              <AppointmentRow key={appt.id} appointment={appt} delay={320 + i * 50} />
            ))}
          </div>
        </div>

        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            background: 'var(--white)',
            boxShadow: 'var(--shadow-sm)',
            animation: 'fadeIn 0.4s ease-out 400ms both',
          }}
        >
          <h3 className="text-[15px] font-semibold mb-6" style={{ color: 'var(--gray-900)' }}>
            Revenue This Week
          </h3>

          <div className="flex items-end gap-2.5 mb-6" style={{ height: 160 }}>
            {weeklyRevenue.map((d, i) => {
              const pct = (d.amount / maxRevenue) * 100;
              const isMax = d.amount === maxRevenue;
              const isToday = i === todayIndex;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <span
                    className="text-[10.5px] font-semibold tabular-nums"
                    style={{ color: isMax ? 'var(--electric-blue)' : 'var(--gray-400)' }}
                  >
                    ${(d.amount / 1000).toFixed(1)}k
                  </span>
                  <div
                    className="w-full rounded-lg transition-all duration-300"
                    style={{
                      height: `${pct}%`,
                      background: isMax ? 'var(--electric-blue)' : 'var(--electric-blue-muted)',
                      borderRadius: 'var(--radius-sm)',
                      minHeight: 8,
                    }}
                  />
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: isToday ? 'var(--electric-blue)' : 'var(--gray-400)' }}
                  >
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className="flex items-center justify-between pt-5"
            style={{ borderTop: '1px solid var(--gray-100)' }}
          >
            <span className="text-[13px] font-medium" style={{ color: 'var(--gray-500)' }}>
              Weekly Total
            </span>
            <span className="text-[18px] font-bold tabular-nums" style={{ color: 'var(--gray-900)' }}>
              ${totalWeeklyRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          background: 'var(--white)',
          boxShadow: 'var(--shadow-sm)',
          animation: 'fadeIn 0.4s ease-out 600ms both',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-semibold" style={{ color: 'var(--gray-900)' }}>
            Recent Activity
          </h3>
          <button className="text-[12.5px] font-medium" style={{ color: 'var(--electric-blue)' }}>
            View all
          </button>
        </div>

        <div className="space-y-0">
          {recentActivity.map((item, i) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 py-4"
                style={{
                  borderBottom: i < recentActivity.length - 1 ? '1px solid var(--gray-100)' : 'none',
                  animation: `fadeIn 0.3s ease-out ${620 + i * 50}ms both`,
                }}
              >
                <div
                  className="shrink-0 flex items-center justify-center rounded-full mt-0.5"
                  style={{
                    width: 36,
                    height: 36,
                    background: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  <ItemIcon size={16} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] leading-snug" style={{ color: 'var(--gray-700)' }}>
                    {item.message}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] tabular-nums mt-0.5" style={{ color: 'var(--gray-400)' }}>
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
