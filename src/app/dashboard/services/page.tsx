'use client';

import { useEffect, useState } from 'react';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  isActive: boolean;
  addons: { id: string; name: string; price: number }[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '' });
  const [addonForm, setAddonForm] = useState({ serviceId: '', name: '', price: '' });
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [error, setError] = useState('');

  function loadServices() {
    fetch('/api/services').then(r => r.json()).then(setServices).finally(() => setLoading(false));
  }

  useEffect(() => { loadServices(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const body = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      duration: parseInt(form.duration),
    };

    try {
      const url = editingId ? `/api/services/${editingId}` : '/api/services';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
      setForm({ name: '', description: '', price: '', duration: '' });
      setEditingId(null);
      setShowForm(false);
      loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  }

  function editService(s: Service) {
    setEditingId(s.id);
    setForm({ name: s.name, description: s.description || '', price: String(s.price), duration: String(s.duration) });
    setShowForm(true);
  }

  async function deleteService(id: string) {
    if (!confirm('Delete this service?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    loadServices();
  }

  async function toggleActive(s: Service) {
    await fetch(`/api/services/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !s.isActive }),
    });
    loadServices();
  }

  async function addAddon(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addAddon',
        serviceId: addonForm.serviceId,
        name: addonForm.name,
        price: parseFloat(addonForm.price),
      }),
    });
    if (res.ok) {
      setAddonForm({ serviceId: '', name: '', price: '' });
      setShowAddonForm(false);
      loadServices();
    }
  }

  async function deleteAddon(serviceId: string, addonId: string) {
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteAddon', addonId }),
    });
    loadServices();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <button onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', duration: '' }); setShowForm(true); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition">
          + Add Service
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <div className="mb-6 p-5 rounded-xl border border-white/5" style={{ background: 'var(--color-card)' }}>
          <h2 className="font-semibold mb-4">{editingId ? 'Edit Service' : 'New Service'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Detail" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Price ($) *</label>
                <input type="number" required step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="149.99" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Duration (min) *</label>
                <input type="number" required min="15" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="60" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition">{editingId ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-white/10 text-gray-300 rounded-lg text-sm hover:border-white/20 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 text-center py-12">Loading...</div>
      ) : services.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No services yet. Create your first service above.</div>
      ) : (
        <div className="space-y-4">
          {services.map(s => (
            <div key={s.id} className={`p-4 rounded-xl border ${s.isActive ? 'border-white/5' : 'border-white/5 opacity-50'}`} style={{ background: 'var(--color-card)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{s.name} {!s.isActive && <span className="text-xs text-gray-500">(inactive)</span>}</h3>
                  <p className="text-sm text-gray-400 mt-1">{s.description || 'No description'}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-indigo-400 font-medium">${Number(s.price).toFixed(2)}</span>
                    <span className="text-gray-400">{s.duration} min</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(s)} className={`px-2 py-1 text-xs rounded transition ${s.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>{s.isActive ? 'Active' : 'Inactive'}</button>
                  <button onClick={() => editService(s)} className="px-2 py-1 text-xs text-gray-400 hover:text-white transition">Edit</button>
                  <button onClick={() => deleteService(s.id)} className="px-2 py-1 text-xs text-gray-400 hover:text-red-400 transition">Delete</button>
                </div>
              </div>
              {s.addons.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-gray-400 mb-2">Add-ons:</p>
                  <div className="flex flex-wrap gap-2">
                    {s.addons.map(a => (
                      <span key={a.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 text-xs">
                        {a.name} (+${Number(a.price).toFixed(2)})
                        <button onClick={() => deleteAddon(s.id, a.id)} className="text-gray-500 hover:text-red-400 ml-1">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {services.length > 0 && (
        <div className="mt-6">
          <button onClick={() => setShowAddonForm(!showAddonForm)} className="text-sm text-indigo-400 hover:text-indigo-300 transition">
            {showAddonForm ? 'Cancel' : '+ Add Add-on to Service'}
          </button>
          {showAddonForm && (
            <form onSubmit={addAddon} className="mt-3 flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Service</label>
                <select required value={addonForm.serviceId} onChange={e => setAddonForm({ ...addonForm, serviceId: e.target.value })} className="w-48">
                  <option value="">Select...</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input type="text" required value={addonForm.name} onChange={e => setAddonForm({ ...addonForm, name: e.target.value })} placeholder="Ceramic coat" className="w-40" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Price</label>
                <input type="number" required step="0.01" min="0" value={addonForm.price} onChange={e => setAddonForm({ ...addonForm, price: e.target.value })} placeholder="49.99" className="w-28" />
              </div>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition">Add</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}