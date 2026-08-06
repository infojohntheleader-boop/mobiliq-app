'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  addons: { id: string; name: string; price: number }[];
}

interface OrgInfo {
  name: string;
  brandColor: string;
  logo: string | null;
  phone: string | null;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [org, setOrg] = useState<OrgInfo | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orgError, setOrgError] = useState(false);

  // Form state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  const [vehicle, setVehicle] = useState({ make: '', model: '', year: '', color: '' });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/public/${slug}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setOrg(data.org);
        setServices(data.services);
      } catch {
        setOrgError(true);
      }
    }
    load();
  }, [slug]);

  if (orgError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Business not found</h1>
          <p className="text-gray-400">This booking page doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  if (!org) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading...</div></div>;
  }

  const accentColor = org.brandColor || '#6366f1';
  const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  function toggleAddon(id: string) {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  }

  function getTotal() {
    if (!selectedService) return 0;
    let total = Number(selectedService.price);
    selectedAddons.forEach(id => {
      const addon = selectedService.addons.find(a => a.id === id);
      if (addon) total += Number(addon.price);
    });
    return total;
  }

  async function handleSubmit() {
    setError('');
    if (!selectedService || !date || !time || !customerInfo.name || !customerInfo.email) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/public/${slug}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          servicePrice: selectedService.price,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          vehicleMake: vehicle.make,
          vehicleModel: vehicle.model,
          vehicleYear: vehicle.year ? parseInt(vehicle.year) : null,
          vehicleColor: vehicle.color,
          date,
          time,
          notes,
          addons: selectedAddons.map(id => {
            const a = selectedService!.addons.find(ad => ad.id === id);
            return a ? { name: a.name, price: a.price } : null;
          }).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Booking failed');
      }
      router.push(`/${slug}/confirm`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Header */}
      <header className="border-b border-white/5" style={{ background: 'rgba(10,10,15,0.9)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          {org.logo && <img src={org.logo} alt="" className="w-10 h-10 rounded-lg object-cover" />}
          <div>
            <h1 className="font-bold text-lg">{org.name}</h1>
            {org.phone && <p className="text-xs text-gray-400">{org.phone}</p>}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['Service', 'Your Info', 'Vehicle & Confirm'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition ${i <= step ? 'text-white' : 'text-gray-500'}`} style={{ background: i <= step ? accentColor : '#1e1e2e' }}>{i + 1}</div>
              <span className={`text-sm ${i <= step ? 'text-white' : 'text-gray-500'}`}>{label}</span>
              {i < 2 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        {/* Step 0: Select Service */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-1">Choose a Service</h2>
            <p className="text-gray-400 text-sm mb-6">Select the service you&apos;d like to book</p>
            {services.length === 0 && <p className="text-gray-500">No services available yet.</p>}
            {services.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedService(s); setSelectedAddons([]); }}
                className={`w-full text-left p-4 rounded-xl border transition ${selectedService?.id === s.id ? 'border-indigo-500/50' : 'border-white/5 hover:border-white/10'}`}
                style={{ background: selectedService?.id === s.id ? 'rgba(99,102,241,0.08)' : 'var(--color-card)' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{s.name}</h3>
                    {s.description && <p className="text-sm text-gray-400 mt-1">{s.description}</p>}
                    <p className="text-xs text-gray-500 mt-1">{s.duration} min</p>
                  </div>
                  <div className="font-bold" style={{ color: accentColor }}>${Number(s.price).toFixed(2)}</div>
                </div>
                {selectedService?.id === s.id && s.addons.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-xs text-gray-400 mb-2">Available Add-ons:</p>
                    <div className="flex flex-wrap gap-2">
                      {s.addons.map(a => (
                        <button
                          key={a.id}
                          onClick={(e) => { e.stopPropagation(); toggleAddon(a.id); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedAddons.includes(a.id) ? 'text-white' : 'text-gray-400 border border-white/10'}`}
                          style={selectedAddons.includes(a.id) ? { background: accentColor } : {}}
                        >
                          {a.name} +${Number(a.price).toFixed(2)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            ))}
            <button
              onClick={() => selectedService && setStep(1)}
              disabled={!selectedService}
              className="w-full py-2.5 rounded-lg font-medium text-white transition disabled:opacity-30"
              style={{ background: accentColor }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 1: Customer Info + Date/Time */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-1">Your Information</h2>
            <p className="text-gray-400 text-sm mb-6">Tell us about yourself and pick a date</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                <input type="text" required value={customerInfo.name} onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })} placeholder="John Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                <input type="email" required value={customerInfo.email} onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })} placeholder="john@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                <input type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} placeholder="(555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Preferred Date *</label>
                <input type="date" required value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Preferred Time *</label>
              <select required value={time} onChange={e => setTime(e.target.value)}>
                <option value="">Select a time</option>
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 py-2.5 rounded-lg font-medium border border-white/10 text-gray-300 hover:border-white/20 transition">Back</button>
              <button onClick={() => { if (customerInfo.name && customerInfo.email && date && time) setStep(2); else setError('Please fill all required fields.'); }} className="flex-1 py-2.5 rounded-lg font-medium text-white transition" style={{ background: accentColor }}>Continue</button>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle + Confirm */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-1">Vehicle Details & Confirm</h2>
            <p className="text-gray-400 text-sm mb-6">Almost done! Add your vehicle info and review</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Make</label>
                <input type="text" value={vehicle.make} onChange={e => setVehicle({ ...vehicle, make: e.target.value })} placeholder="Toyota" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                <input type="text" value={vehicle.model} onChange={e => setVehicle({ ...vehicle, model: e.target.value })} placeholder="Camry" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                <input type="text" value={vehicle.year} onChange={e => setVehicle({ ...vehicle, year: e.target.value })} placeholder="2024" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                <input type="text" value={vehicle.color} onChange={e => setVehicle({ ...vehicle, color: e.target.value })} placeholder="Silver" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special requests..." rows={3} />
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl border border-white/5" style={{ background: 'var(--color-card)' }}>
              <h3 className="font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Service</span><span>{selectedService?.name}</span></div>
                {selectedAddons.map(id => {
                  const a = selectedService?.addons.find(ad => ad.id === id);
                  return a ? <div key={id} className="flex justify-between"><span className="text-gray-400">+ {a.name}</span><span>${Number(a.price).toFixed(2)}</span></div> : null;
                })}
                <div className="flex justify-between"><span className="text-gray-400">Date</span><span>{date} at {time}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Customer</span><span>{customerInfo.name}</span></div>
                {vehicle.make && <div className="flex justify-between"><span className="text-gray-400">Vehicle</span><span>{vehicle.year} {vehicle.make} {vehicle.model}</span></div>}
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span style={{ color: accentColor }}>${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-lg font-medium border border-white/10 text-gray-300 hover:border-white/20 transition">Back</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-lg font-medium text-white transition disabled:opacity-50" style={{ background: accentColor }}>
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
