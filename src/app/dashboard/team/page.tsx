'use client';

import { useEffect, useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [error, setError] = useState('');

  function loadTeam() {
    fetch('/api/team').then(r => r.json()).then(setTeam).finally(() => setLoading(false));
  }

  useEffect(() => { loadTeam(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
      setForm({ name: '', email: '', password: '', role: 'admin' });
      setShowForm(false);
      loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  }

  async function removeMember(id: string) {
    if (!confirm('Remove this team member?')) return;
    await fetch('/api/team', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    loadTeam();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Team</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition">
          + Add Member
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <div className="mb-6 p-5 rounded-xl border border-white/5" style={{ background: 'var(--color-card)' }}>
          <h2 className="font-semibold mb-4">Add Team Member</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane@business.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password *</label>
                <input type="password" required minLength={8} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition">Add Member</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-white/10 text-gray-300 rounded-lg text-sm hover:border-white/20 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 text-center py-12">Loading...</div>
      ) : team.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No team members yet.</div>
      ) : (
        <div className="space-y-3">
          {team.map(m => (
            <div key={m.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5" style={{ background: 'var(--color-card)' }}>
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-gray-400">{m.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs border ${m.role === 'owner' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                  {m.role}
                </span>
                {m.role !== 'owner' && (
                  <button onClick={() => removeMember(m.id)} className="text-sm text-gray-500 hover:text-red-400 transition">Remove</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}