'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  CalendarClock,
  FileText,
  Users,
  CreditCard,
  BarChart3,
  Sparkles,
  Check,
  Star,
} from 'lucide-react';

const CAR_IMAGE = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fcae316342f2.jpg';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTs: number;
    let raf: number;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const features = [
  {
    icon: CalendarClock,
    title: 'Smart Scheduling',
    description: 'Accept online bookings 24/7. Set availability, offer packages with add-ons, and eliminate phone tag forever.',
    color: 'var(--accent)',
    bg: 'var(--accent-muted)',
    span: 'col-span-1 md:col-span-2',
    rowSpan: '',
  },
  {
    icon: FileText,
    title: 'Professional Invoicing',
    description: 'Auto-generate invoices from completed jobs. Track payments, send receipts, and keep finances organized.',
    color: 'var(--emerald)',
    bg: 'var(--emerald-muted)',
    span: 'col-span-1',
    rowSpan: 'row-span-2',
  },
  {
    icon: Users,
    title: 'Customer CRM',
    description: 'Know every customer by name. Track vehicle history, preferences, and communication in one profile.',
    color: 'var(--violet)',
    bg: 'var(--violet-muted)',
    span: 'col-span-1',
    rowSpan: '',
  },
  {
    icon: CreditCard,
    title: 'Payment Processing',
    description: 'Accept payments instantly. Support cards, ACH, and send automatic payment reminders.',
    color: 'var(--amber)',
    bg: 'var(--amber-muted)',
    span: 'col-span-1',
    rowSpan: '',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Real-time dashboards with revenue trends, customer growth, and service performance metrics.',
    color: 'var(--rose)',
    bg: 'var(--rose-muted)',
    span: 'col-span-1',
    rowSpan: '',
  },
  {
    icon: Sparkles,
    title: 'Service Packages',
    description: 'Create and customize service bundles with pricing tiers, duration estimates, and upsell add-ons.',
    color: 'var(--accent)',
    bg: 'var(--accent-muted)',
    span: 'col-span-1',
    rowSpan: '',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mo',
    popular: false,
    features: ['Up to 50 bookings/mo', '3 services', '1 team member', 'Basic booking page', 'Email support'],
  },
  {
    name: 'Pro',
    price: '$59',
    period: '/mo',
    popular: true,
    features: ['Unlimited bookings', 'Unlimited services', '5 team members', 'Custom branding', 'Add-ons & upgrades', 'Priority support'],
  },
  {
    name: 'Business',
    price: '$99',
    period: '/mo',
    popular: false,
    features: ['Everything in Pro', 'Unlimited team', 'API access', 'White-label option', 'Dedicated support', 'Custom integrations'],
  },
];

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Pricing', href: '#pricing' },
];

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const statsRef = useInView(0.2);
  const count1 = useCountUp(12, 2000, statsRef.inView);
  const count2 = useCountUp(84, 2000, statsRef.inView);
  const count3 = useCountUp(2400, 2000, statsRef.inView);
  const count4 = useCountUp(999, 2000, statsRef.inView);

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 glass glass-border" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'var(--accent)' }}
            >
              M
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Mobiliq</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 transition"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Get Started
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
          </div>
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden px-6 py-4 space-y-3" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className="block text-sm font-medium py-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <Link href="/login" className="text-sm font-medium py-2" style={{ color: 'var(--text-secondary)' }}>Log in</Link>
              <Link href="/signup" className="btn-primary text-center">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 hero-grid" />
        <div className="hero-glow" />
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8" style={{ background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
              Now in public beta
            </div>
            <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6" style={{ animationDelay: '100ms' }}>
              The operating system{' '}
              <br className="hidden sm:block" />
              <span className="gradient-text">for your detailing shop</span>
            </h1>
            <p className="animate-fade-in-up text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)', animationDelay: '200ms' }}>
              Manage bookings, invoicing, customer relationships, and payments — all from one beautifully crafted platform built for car detailing businesses.
            </p>
            <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '300ms' }}>
              <Link href="/signup" className="btn-primary px-8 py-3 text-base">
                Start Free Trial
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <a href="#dashboard" className="btn-ghost px-8 py-3 text-base">
                See the Dashboard
              </a>
            </div>
          </div>
          <div className="animate-fade-in-up mt-16 lg:mt-20 max-w-4xl mx-auto" style={{ animationDelay: '450ms' }}>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="flex items-center gap-2 px-5 py-3" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'var(--rose)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'var(--amber)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'var(--emerald)' }} />
                </div>
                <div className="flex-1 mx-4">
                  <div className="text-center text-xs py-1 rounded-md max-w-xs mx-auto" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                    app.mobiliq.com/dashboard
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src={CAR_IMAGE}
                  alt="Car detailing dashboard preview"
                  className="w-full h-[300px] sm:h-[400px] lg:h-[480px] object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 40%)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef.ref} className="py-16 px-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              ${count1}k+
            </p>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>Monthly Revenue Avg.</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {count2.toLocaleString()}+
            </p>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>Bookings Processed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {count3.toLocaleString()}+
            </p>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {statsRef.inView ? '99.9%' : '0%'}
            </p>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>Uptime</p>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Everything you need to run your shop
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Stop juggling spreadsheets and phone calls. Mobiliq brings every part of your business into one dashboard.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className={`feature-card ${f.span} ${f.rowSpan}`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: f.bg, color: f.color }}
                  >
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="dashboard" className="py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Dashboard</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Your command center
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              A real-time dashboard built for detailing businesses. See everything at a glance.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-center gap-2 px-5 py-3" style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--rose)' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--amber)' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--emerald)' }} />
              </div>
              <div className="flex-1 mx-4">
                <div className="text-center text-xs py-1 rounded-md max-w-xs mx-auto" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                  app.mobiliq.com/dashboard
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-8" style={{ background: 'var(--bg-primary)' }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Revenue Today', value: '$2,840', change: '+12.5%', color: 'var(--emerald)' },
                  { label: 'Appointments', value: '8', change: '3 remaining', color: 'var(--accent)' },
                  { label: 'In Progress', value: '4', change: '2 washing', color: 'var(--amber)' },
                  { label: 'Pending Invoices', value: '$1,240', change: '5 invoices', color: 'var(--violet)' },
                ].map((s, i) => (
                  <div key={i} className="dash-card">
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
                    <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                    <p className="text-xs mt-1.5" style={{ color: s.color }}>{s.change}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 dash-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Today's Schedule</p>
                  </div>
                  {[
                    { time: '9:00 AM', name: 'Marcus Johnson', svc: 'Full Detail', vehicle: '2024 BMW M4', status: 'Confirmed', statusColor: 'var(--accent)' },
                    { time: '11:30 AM', name: 'Sarah Williams', svc: 'Ceramic Coating', vehicle: '2023 Porsche 911', status: 'In Progress', statusColor: 'var(--amber)' },
                    { time: '2:00 PM', name: 'David Chen', svc: 'Interior Only', vehicle: '2025 Tesla Model S', status: 'Confirmed', statusColor: 'var(--accent)' },
                    { time: '4:30 PM', name: 'Amanda Torres', svc: 'Paint Correction', vehicle: '2024 Mercedes AMG', status: 'Completed', statusColor: 'var(--emerald)' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3" style={{ borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono tabular-nums shrink-0 w-16" style={{ color: 'var(--text-muted)' }}>{a.time}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{a.name}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{a.svc} · {a.vehicle}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-semibold" style={{ color: a.statusColor }}>{a.status}</span>
                    </div>
                  ))}
                </div>
                <div className="dash-card">
                  <p className="text-sm font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Revenue This Week</p>
                  <div className="flex items-end gap-1.5" style={{ height: 120 }}>
                    {[45, 62, 38, 71, 55, 80, 68].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <div
                          className="w-full rounded-sm"
                          style={{
                            height: `${h}%`,
                            background: i === 5 ? 'var(--accent)' : 'var(--bg-hover)',
                            minHeight: 6,
                          }}
                        />
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Weekly Total</span>
                    <span className="text-sm font-bold gradient-text">$4,280</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-muted)' }}>
              <Star size={18} style={{ color: 'var(--accent)' }} fill="var(--accent)" />
            </div>
          </div>
          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed mb-8" style={{ color: 'var(--text-primary)' }}>
            &ldquo;Mobiliq completely transformed how we run our shop. We went from 15 phone calls a day for bookings to zero. Our revenue is up 40% and our customers love the professional booking experience.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'var(--accent-gradient)' }}
            >
              JR
            </div>
            <div className="text-left">
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Jake Rodriguez</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Owner of Precision Auto Spa</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Simple, transparent pricing
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Start free. Upgrade when you're ready. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative rounded-2xl p-8"
                style={{
                  background: plan.popular ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                  border: plan.popular ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--border-subtle)',
                  boxShadow: plan.popular ? '0 0 40px rgba(59,130,246,0.08)' : 'none',
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{plan.price}</span>
                  <span style={{ color: 'var(--text-tertiary)' }}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--accent-muted)' }}>
                        <Check size={10} style={{ color: 'var(--accent)' }} strokeWidth={3} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={plan.popular ? 'btn-primary w-full justify-center' : 'btn-ghost w-full justify-center'}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5" style={{ color: 'var(--text-primary)' }}>
            Ready to grow your{' '}
            <span className="gradient-text">detailing business</span>?
          </h2>
          <p className="text-base sm:text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Join hundreds of detailing businesses using Mobiliq to streamline operations and impress customers.
          </p>
          <Link href="/signup" className="btn-primary px-10 py-3.5 text-base">
            Start Your Free Trial
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      <footer className="py-12 px-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'var(--accent)' }}
            >
              M
            </div>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Mobiliq</span>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="transition" style={{ color: 'var(--text-tertiary)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}>Privacy</a>
            <a href="#" className="transition" style={{ color: 'var(--text-tertiary)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}>Terms</a>
            <a href="#" className="transition" style={{ color: 'var(--text-tertiary)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}>Contact</a>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} Mobiliq. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
