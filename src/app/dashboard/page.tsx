'use client';

import { useEffect, useState } from 'react';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: number | null;
  vehicleColor: string | null;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export default function DashboardBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    let f = bookings;
    if (statusFilter !== 'all') f = f.filter(b => b.status === statusFilter);
    if (search) {
      const s = search.toLowerCase();
      f = f.filter(b =>
        b.customerName.toLowerCase().includes(s) ||
        b.customerEmail.toLowerCase().includes(s) ||
        (b.vehicleMake || '').toLowerCase().includes(s) ||
        (b.serviceName || '').toLowerCase().includes(s)
      );
    }
    setFiltered(f);
  }, [bookings, statusFilter, search]);

  async function loadBookings() {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to load bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load bookings.');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadBookings();
  }

  async function deleteBooking(id: string) {
    if (!confirm('Delete this booking?')) return;
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    loadBookings();
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + Number(b.servicePrice || 0), 0),
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'in-progress': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Pending', value: stats.pending },
          { label: 'Confirmed', value: stats.confirmed },
          { label: 'Completed', value: stats.completed },
          { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}` },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl border border-white/5" style={{ background: 'var(--color-card)' }}>
            <div className="text-xs text-gray-400 mb-1">{s.label}</div>
            <div className="text-xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text" placeholder="Search name, email, vehicle, service..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-40">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {loading ? (
        <div className="text-gray-400 text-center py-12">Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No bookings found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-white/5">
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Service</th>
                <th className="pb-3 pr-4">Vehicle</th>
                <th className="pb-3 pr-4">Date/Time</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-white/5">
                  <td className="py-3 pr-4">
                    <div className="font-medium">{b.customerName}</div>
                    <div className="text-xs text-gray-400">{b.customerEmail}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div>{b.serviceName}</div>
                    <div className="text-xs text-gray-400">${Number(b.servicePrice).toFixed(2)}</div>
                  </td>
                  <td className="py-3 pr-4 text-gray-300">
                    {b.vehicleYear && `${b.vehicleYear} `}{b.vehicleMake} {b.vehicleModel}
                  </td>
                  <td className="py-3 pr-4 text-gray-300">
                    {b.date} {b.time}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[b.status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      {b.status === 'pending' && (
                        <button onClick={() => updateStatus(b.id, 'confirmed')} className="px-2 py-1 text-xs bg-blue-600/10 text-blue-400 rounded hover:bg-blue-600/20 transition">Confirm</button>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => updateStatus(b.id, 'in-progress')} className="px-2 py-1 text-xs bg-purple-600/10 text-purple-400 rounded hover:bg-purple-600/20 transition">Start</button>
                      )}
                      {b.status === 'in-progress' && (
                        <button onClick={() => updateStatus(b.id, 'completed')} className="px-2 py-1 text-xs bg-green-600/10 text-green-400 rounded hover:bg-green-600/20 transition">Complete</button>
                      )}
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button onClick={() => updateStatus(b.id, 'cancelled')} className="px-2 py-1 text-xs bg-red-600/10 text-red-400 rounded hover:bg-red-600/20 transition">Cancel</button>
                      )}
                      <button onClick={() => deleteBooking(b.id)} className="px-2 py-1 text-xs text-gray-500 hover:text-red-400 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}