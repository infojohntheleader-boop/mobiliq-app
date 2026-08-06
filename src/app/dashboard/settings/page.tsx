'use client';

import { useEffect, useState } from 'react';

interface OrgData {
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
  brandColor: string;
  logo: string | null;
  plan: string;
}

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgData | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', brandColor: '#6366f1' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/org').then(r => r.json()).then(data => {
      setOrg(data);
      setForm({ name: data.name, phone: data.phone || '', address: data.address || '', brandColor: data.brandColor || '#6366f1' });
    });
  }, []);

  async function save() {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/org', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setMsg('Settings saved!');
    } catch {
      setMsg('Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  if (!org) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Business Info */}
      <div className="p-5 rounded-xl border border-white/5 mb-6" style={{ background: 'var(--color-card)' }}>
        <h2 className="font-semibold mb-4">Business Information</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Business Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(555) 123-4567" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
            <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Main St, City, State" />
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="p-5 rounded-xl border border-white/5 mb-6" style={{ background: 'var(--color-card)' }}>
        <h2 className="font-semibold mb-4">Branding</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Brand Color</label>
          <div className="flex gap-3 items-center">
            <input type="color" value={form.brandColor} onChange={e => setForm({ ...form, brandColor: e.target.value })} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
            <input type="text" value={form.brandColor} onChange={e => setForm({ ...form, brandColor: e.target.value })} className="w-32" />
          </div>
        </div>
      </div>

      {/* Booking Page URL */}
      <div className="p-5 rounded-xl border border-white/5 mb-6" style={{ background: 'var(--color-card)' }}>
        <h2 className="font-semibold mb-4">Booking Page</h2>
        <p className="text-sm text-gray-400 mb-2">Share this link with your customers:</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-sm text-indigo-400 truncate">
            {typeof window !== 'undefined' ? window.location.origin : ''}/{org.slug}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${org.slug}`)}
            className="px-3 py-2 text-xs border border-white/10 text-gray-300 rounded-lg hover:border-white/20 transition"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Plan */}
      <div className="p-5 rounded-xl border border-white/5 mb-6" style={{ background: 'var(--color-card)' }}>
        <h2 className="font-semibold mb-2">Current Plan</h2>
        <p className="text-indigo-400 font-medium capitalize">{org.plan}</p>
      </div>

      {msg && <div className={`mb-4 p-3 rounded-lg text-sm ${msg.includes('saved') ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>{msg}</div>}

      <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition">
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}