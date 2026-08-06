'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5" style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold">Mobiliq</div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">Log In</Link>
            <Link href="/signup" className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition">Start Free</Link>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-gray-400">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-white/5 px-6 py-4 space-y-3">
            <a href="#features" className="block text-gray-400 hover:text-white">Features</a>
            <a href="#pricing" className="block text-gray-400 hover:text-white">Pricing</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-white">How It Works</a>
            <Link href="/login" className="block text-gray-300">Log In</Link>
            <Link href="/signup" className="block text-indigo-400">Start Free</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 mb-6">
            Now in Early Access
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Your booking system,{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              fully branded
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Mobiliq gives detailing businesses a professional online booking experience with a custom booking page, real-time management dashboard, and team tools — all under your own brand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition">
              Get Started Free
            </Link>
            <a href="#how-it-works" className="px-8 py-3 border border-white/10 hover:border-white/20 text-gray-300 rounded-lg font-medium transition">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything you need</h2>
          <p className="text-gray-400 text-center mb-14 max-w-xl mx-auto">Built specifically for mobile detailing and auto service businesses</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📅', title: 'Online Booking', desc: 'Customers book 24/7 from your branded page. Choose services, pick date & time, and get instant confirmation.' },
              { icon: '📊', title: 'Dashboard', desc: 'See all bookings, revenue, and team performance in one place. Filter, search, and manage everything.' },
              { icon: '🎨', title: 'Your Brand', desc: 'Custom colors, logo, and a unique URL like mobiliq.com/your-business. Looks like your own site.' },
              { icon: '👥', title: 'Team Management', desc: 'Add team members, assign roles, and keep everyone on the same page.' },
              { icon: '🔧', title: 'Service Management', desc: 'Define your services, pricing, and add-ons. Update anytime — changes go live instantly.' },
              { icon: '📱', title: 'Mobile Friendly', desc: 'Your booking page and dashboard work perfectly on phones, tablets, and desktops.' },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/5" style={{ background: 'var(--color-card)' }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">How It Works</h2>
          <div className="space-y-8">
            {[
              { step: '1', title: 'Create your account', desc: 'Sign up with your business name and email. Takes less than 30 seconds.' },
              { step: '2', title: 'Set up your services', desc: 'Add your detailing packages, pricing, and any add-ons you offer.' },
              { step: '3', title: 'Share your booking link', desc: 'Get a custom URL (mobiliq.com/your-slug) and share it with customers.' },
              { step: '4', title: 'Manage bookings', desc: 'View, confirm, and track all bookings from your dashboard.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">{s.step}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
          <p className="text-gray-400 text-center mb-14">No hidden fees. Cancel anytime.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { plan: 'Starter', price: '$29', period: '/mo', features: ['Up to 50 bookings/mo', '3 services', '1 team member', 'Basic booking page', 'Email support'], cta: 'Start Free Trial' },
              { plan: 'Pro', price: '$59', period: '/mo', popular: true, features: ['Unlimited bookings', 'Unlimited services', '5 team members', 'Custom branding', 'Add-ons & upgrades', 'Priority support'], cta: 'Start Free Trial' },
              { plan: 'Business', price: '$99', period: '/mo', features: ['Everything in Pro', 'Unlimited team', 'API access', 'White-label option', 'Dedicated support', 'Custom integrations'], cta: 'Start Free Trial' },
            ].map((p, i) => (
              <div key={i} className={`p-6 rounded-xl border ${p.popular ? 'border-indigo-500/50 relative' : 'border-white/5'}`} style={{ background: 'var(--color-card)' }}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-medium bg-indigo-600 text-white rounded-full">Most Popular</div>
                )}
                <h3 className="font-semibold text-lg mb-1">{p.plan}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold">{p.price}</span>
                  <span className="text-gray-400 text-sm">{p.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-indigo-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`block text-center py-2.5 rounded-lg font-medium text-sm transition ${p.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'border border-white/10 text-gray-300 hover:border-white/20'}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-2xl border border-indigo-500/20" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))' }}>
          <h2 className="text-3xl font-bold mb-4">Ready to grow your business?</h2>
          <p className="text-gray-400 mb-8">Join hundreds of detailing businesses using Mobiliq to manage bookings and impress customers.</p>
          <Link href="/signup" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div>Mobiliq &copy; {new Date().getFullYear()}</div>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
