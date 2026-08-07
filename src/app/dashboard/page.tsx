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

const appointments = [
  { id: 1, time: '08:00 AM', customer: 'James Rodriguez', vehicle: '2023 BMW X5 - Black', service: 'Full Detail', status: 'completed' as const },
  { id: 2, time: '09:30 AM', customer: 'Sarah Chen', vehicle: '2024 Tesla Model 3 - White', service: 'Ceramic Coating', status: 'in-progress' as const },
  { id: 3, time: '10:00 AM', customer: 'Marcus Williams', vehicle: '2022 Mercedes C300 - Silver', service: 'Interior Deep Clean', status: 'in-progress' as const },
  { id: 4, time: '11:30 AM', customer: 'Emily Park', vehicle: '2024 Audi Q7 - Gray', service: 'Exterior Wash & Wax', status: 'confirmed' as const },
  { id: 5, time: '01:00 PM', customer: 'David Kim', vehicle: '2023 Porsche 911 - Red', service: 'Paint Correction', status: 'confirmed' as const },
  { id: 6, time: '02:30 PM', customer: 'Ava Thompson', vehicle: '2024 Lexus RX - Pearl', service: 'Full Detail', status: 'confirmed' as const },
];

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

const recentActivity = [
  { id: 1, message: 'New customer registered — Ava Thompson', time: '12 min ago', icon: UserPlus, color: 'var(--violet)' },
  { id: 2, message: 'Payment received — $349.00 from Marcus Williams', time: '34 min ago', icon: CreditCard, color: 'var(--emerald)' },
  { id: 3, message: 'Full Detail completed for James Rodriguez', time: '1 hr ago', icon: CheckCircle2, color: 'var(--accent)' },
  { id: 4, message: 'New booking — Ceramic Coating for Emily Park', time: '2 hr ago', icon: Sparkles, color: 'var(--amber)' },
];

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

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  confirmed: { label: 'Confirmed', bg: 'var(--accent-muted)', text: 'var(--accent)', dot: 'var(--accent)' },
  'in-progress': { label: 'In Progress', bg: 'var(--amber-muted)', text: 'var(--amber)', dot: 'var(--amber)' },
  completed: { label: 'Completed', bg: 'var(--emerald-muted)', text: 'var(--emerald)', dot: 'var(--emerald)' },
};

function StatCard({ icon: Icon, iconBg, iconColor, value, label, trend, trendColor, sub, delay }: {
  icon: React.ElementType; iconBg: string; iconColor: string; value: string; label: string;
  trend?: string; trendColor?: string; sub?: string; delay: number;
}) {
  return (
    <div
      className="dash-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: iconBg, color: iconColor }}>
          <Icon size={18} strokeWidth={1.7} />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: trendColor || 'var(--emerald)' }}>
            <ArrowUpRight size={13} strokeWidth={2.5} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-[26px] font-bold tracking-tight leading-none mb-1.5" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
      {sub && <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const todayDow = new Date().getDay();
  const todayIndex = todayDow === 0 ? 6 : todayDow - 1;

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 className="text-[22px] md:text-[26px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {getGreeting()}, Alex
            </h2>
            <p className="text-[14px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{formatDate()}</p>
          </div>
          <Link
            href="/dashboard/appointments"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold shrink-0"
            style={{ color: 'var(--accent)' }}
          >
            View all appointments
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={DollarSign} iconBg="var(--emerald-muted)" iconColor="var(--emerald)" value="$2,840" label="Revenue Today" trend="+12.5%" trendColor="var(--emerald)" delay={60} />
        <StatCard icon={CalendarCheck} iconBg="var(--accent-muted)" iconColor="var(--accent)" value="8" label="Appointments Today" sub="3 remaining" delay={120} />
        <StatCard icon={Car} iconBg="var(--amber-muted)" iconColor="var(--amber)" value="4" label="Vehicles in Progress" sub="2 washing" delay={180} />
        <StatCard icon={Receipt} iconBg="var(--violet-muted)" iconColor="var(--violet)" value="$1,240" label="Pending Invoices" sub="5 invoices" delay={240} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-3 dash-card animate-fade-in" style={{ animationDelay: '300ms', padding: 0, overflow: 'hidden' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 className="text-[14.5px] font-semibold" style={{ color: 'var(--text-primary)' }}>Today&apos;s Schedule</h3>
            <span className="text-[11.5px] font-medium px-2.5 py-1 rounded-full" style={{ background: 'var(--bg-hover)', color: 'var(--text-tertiary)' }}>
              {appointments.length} appointments
            </span>
          </div>
          <div>
            {appointments.map((appt, i) => {
              const cfg = statusConfig[appt.status];
              return (
                <div
                  key={appt.id}
                  className="flex items-center justify-between px-6 py-3.5 transition-colors duration-100"
                  style={{ borderBottom: `1px solid var(--border-subtle)` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-[12.5px] font-mono tabular-nums shrink-0 w-16" style={{ color: 'var(--text-muted)' }}>{appt.time}</span>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{appt.customer}</p>
                      <p className="text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>{appt.vehicle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:block text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{appt.service}</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: cfg.bg, color: cfg.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 dash-card animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="text-[14.5px] font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Revenue This Week</h3>
          <div className="flex items-end gap-2" style={{ height: 140 }}>
            {weeklyRevenue.map((d, i) => {
              const pct = (d.amount / maxRevenue) * 100;
              const isToday = i === todayIndex;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-semibold tabular-nums" style={{ color: isToday ? 'var(--accent)' : 'var(--text-muted)' }}>
                    ${(d.amount / 1000).toFixed(1)}k
                  </span>
                  <div
                    className="w-full rounded-md transition-all duration-300"
                    style={{
                      height: `${pct}%`,
                      background: isToday ? 'var(--accent)' : 'var(--bg-hover)',
                      minHeight: 6,
                      boxShadow: isToday ? '0 0 12px var(--accent-glow)' : 'none',
                    }}
                  />
                  <span className="text-[10.5px] font-medium" style={{ color: isToday ? 'var(--accent)' : 'var(--text-muted)' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>Weekly Total</span>
            <span className="text-[18px] font-bold tabular-nums gradient-text">${totalWeeklyRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="dash-card animate-fade-in" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[14.5px] font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
          <button className="text-[12.5px] font-medium" style={{ color: 'var(--accent)' }}>View all</button>
        </div>
        <div>
          {recentActivity.map((item, i) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 py-3.5"
                style={{ borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
              >
                <div
                  className="shrink-0 flex items-center justify-center rounded-full mt-0.5"
                  style={{ width: 34, height: 34, background: `${item.color}15`, color: item.color }}
                >
                  <ItemIcon size={15} strokeWidth={1.7} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{item.message}</p>
                </div>
                <span className="shrink-0 text-[11.5px] tabular-nums mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
