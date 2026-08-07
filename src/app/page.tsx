'use client';

import Link from 'next/link';
import { useState } from 'react';

const CAR_IMAGE = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fcae316342f2.jpg';

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'var(--electric-blue)' }}>M</div>
            <span className="text-lg font-bold text-gray-900">Mobiliq</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Products</a>
            <a href="#solutions" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Solutions</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Pricing</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 transition">Log in</Link>
            <Link href="/signup" className="text-sm font-medium text-white px-5 py-2.5 rounded-lg transition" style={{ background: 'var(--electric-blue)' }}>Start Free Trial</Link>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-gray-600">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
            <a href="#products" onClick={() => setMobileMenu(false)} className="block text-sm font-medium text-gray-600">Products</a>
            <a href="#solutions" onClick={() => setMobileMenu(false)} className="block text-sm font-medium text-gray-600">Solutions</a>
            <a href="#pricing" onClick={() => setMobileMenu(false)} className="block text-sm font-medium text-gray-600">Pricing</a>
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link href="/login" className="text-sm font-medium text-gray-600 py-2">Log in</Link>
              <Link href="/signup" className="text-sm font-medium text-white text-center py-2.5 rounded-lg" style={{ background: 'var(--electric-blue)' }}>Start Free Trial</Link>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight text-gray-900 mb-6">
              Run Your Detailing Business{' '}
              <span style={{ color: 'var(--electric-blue)' }}>Like a Pro</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
              All-in-one platform for managing bookings, invoicing, and customer relationships. Give your detailing business the tools it deserves — all under your own brand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-white font-semibold text-base transition shadow-lg shadow-blue-900/20" style={{ background: 'var(--electric-blue)' }}>
                Start Free Trial
                <svg className="ml-2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </Link>
              <a href="#demo" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-base border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition">
                Book a Demo
              </a>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img src={CAR_IMAGE} alt="Luxury car in detailing studio" className="w-full h-[400px] lg:h-[480px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="py-12 px-6 border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-medium text-gray-500">Trusted by detailers worldwide</p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['bg-blue-700', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500'].map((bg, i) => (
                <div key={i} className={`w-9 h-9 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>{['JD','MK','AR','TL','SP'][i]}</div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 20 20" fill="#FBBF24"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/></svg>
              ))}
              <span className="text-sm font-semibold text-gray-700 ml-1">4.9/5</span>
              <span className="text-sm text-gray-400">(2,400+ reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURE GRID ===== */}
      <section id="products" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--electric-blue)' }}>Products</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything you need in one place</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Stop juggling spreadsheets, phone calls, and messy notes. Mobiliq brings every part of your business into a single, beautiful dashboard.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg width="28" height="28" fill="none" stroke="#00288e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
                ),
                title: 'Smart Scheduling',
                desc: 'Customers book online 24/7. Set your availability, offer service packages with add-ons, and eliminate phone tag forever.',
              },
              {
                icon: (
                  <svg width="28" height="28" fill="none" stroke="#00288e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
                ),
                title: 'Professional Invoicing',
                desc: 'Generate invoices automatically from completed jobs. Track payments, send receipts, and keep your finances organized.',
              },
              {
                icon: (
                  <svg width="28" height="28" fill="none" stroke="#00288e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                ),
                title: 'Customer CRM',
                desc: 'Know every customer by name. Track vehicle history, preferences, and communication — all in one profile.',
              },
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 bg-white">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: 'var(--blue-50)' }}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCT PREVIEW ===== */}
      <section id="solutions" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--electric-blue)' }}>Dashboard</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Experience the Precision</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">A real-time command center built for detailing businesses. See everything at a glance.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/10 overflow-hidden">
            {/* Mock Dashboard Bar */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 bg-gray-50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4">
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-400 max-w-xs">mobiliq.com/dashboard</div>
              </div>
            </div>
            {/* Mock Dashboard Content */}
            <div className="p-8">
              <div className="grid grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Monthly Revenue', value: '$12,480', change: '+23%', color: '#00288e' },
                  { label: 'Active Bookings', value: '34', change: '+12%', color: '#059669' },
                  { label: 'New Customers', value: '18', change: '+8%', color: '#7C3AED' },
                  { label: 'Completion Rate', value: '96%', change: '+2%', color: '#DC2626' },
                ].map((s, i) => (
                  <div key={i} className="p-5 rounded-xl border border-gray-100">
                    <p className="text-xs font-medium text-gray-400 mb-1">{s.label}</p>
                    <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs font-medium text-emerald-500 mt-1">{s.change} vs last month</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-6">
                {/* Appointments List */}
                <div className="col-span-2 rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-700">Upcoming Appointments</p>
                  </div>
                  {[
                    { time: '9:00 AM', name: 'Marcus Johnson', service: 'Full Detail', vehicle: '2024 BMW M4', status: 'Confirmed' },
                    { time: '11:30 AM', name: 'Sarah Williams', service: 'Ceramic Coating', vehicle: '2023 Porsche 911', status: 'Pending' },
                    { time: '2:00 PM', name: 'David Chen', service: 'Interior Only', vehicle: '2025 Tesla Model S', status: 'Confirmed' },
                    { time: '4:30 PM', name: 'Amanda Torres', service: 'Paint Correction', vehicle: '2024 Mercedes AMG', status: 'In Progress' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: ['#3B82F6','#10B981','#F59E0B','#8B5CF6'][i] }}>{a.name.split(' ').map(n=>n[0]).join('')}</div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{a.name}</p>
                          <p className="text-xs text-gray-400">{a.service} · {a.vehicle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600">{a.time}</p>
                        <span className={`text-xs font-medium ${a.status === 'Confirmed' ? 'text-emerald-600' : a.status === 'Pending' ? 'text-amber-600' : 'var(--electric-blue)'}`}>{a.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Revenue Chart Placeholder */}
                <div className="rounded-xl border border-gray-100 p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-4">Revenue This Week</p>
                  <div className="flex items-end gap-2 h-40">
                    {[45, 62, 38, 71, 55, 80, 68].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-sm transition-all" style={{ height: `${h}%`, background: i === 5 ? 'var(--electric-blue)' : 'var(--blue-50)', minHeight: '8px' }} />
                        <span className="text-[10px] text-gray-400">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                    <span className="text-xs text-gray-400">Weekly Total</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--electric-blue)' }}>$4,280</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIAL ===== */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <svg className="mx-auto mb-6" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00288e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          <blockquote className="text-2xl sm:text-3xl font-medium text-gray-900 leading-relaxed mb-8">
            &ldquo;Mobiliq completely transformed how we run our shop. We went from 15 phone calls a day for bookings to zero. Our revenue is up 40% and our customers love the professional booking experience.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-700 flex items-center justify-center text-white text-lg font-bold">JR</div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Jake Rodriguez</p>
              <p className="text-sm text-gray-500">Owner, Precision Auto Spa · Austin, TX</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--electric-blue)' }}>Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Start free. Upgrade when you're ready. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { plan: 'Starter', price: '$29', period: '/mo', features: ['Up to 50 bookings/mo','3 services','1 team member','Basic booking page','Email support'], cta: 'Start Free Trial', popular: false },
              { plan: 'Pro', price: '$59', period: '/mo', features: ['Unlimited bookings','Unlimited services','5 team members','Custom branding','Add-ons & upgrades','Priority support'], cta: 'Start Free Trial', popular: true },
              { plan: 'Business', price: '$99', period: '/mo', features: ['Everything in Pro','Unlimited team','API access','White-label option','Dedicated support','Custom integrations'], cta: 'Start Free Trial', popular: false },
            ].map((p, i) => (
              <div key={i} className={`relative p-8 rounded-2xl border ${p.popular ? 'border-blue-200 shadow-xl shadow-blue-900/10' : 'border-gray-200'} bg-white`}>
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white" style={{ background: 'var(--electric-blue)' }}>Most Popular</div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-1">{p.plan}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{p.price}</span>
                  <span className="text-gray-400">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-gray-600">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="#00288e"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`block text-center py-3 rounded-lg font-semibold text-sm transition ${p.popular ? 'text-white shadow-lg shadow-blue-900/20' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`} style={p.popular ? { background: 'var(--electric-blue)' } : {}}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center p-12 sm:p-16 rounded-3xl" style={{ background: 'var(--electric-blue)' }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to grow your business?</h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">Join hundreds of detailing businesses using Mobiliq to streamline operations and impress customers.</p>
          <Link href="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white font-semibold text-base transition hover:bg-blue-50" style={{ color: 'var(--electric-blue)' }}>
            Start Your Free Trial
            <svg className="ml-2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: 'var(--electric-blue)' }}>M</div>
            <span className="font-bold text-gray-900">Mobiliq</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900 transition">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition">Terms</a>
            <a href="#" className="hover:text-gray-900 transition">Contact</a>
          </div>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Mobiliq. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}