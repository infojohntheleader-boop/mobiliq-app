'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Clock,
  Pencil,
  Trash2,
  X,
  Save,
  Sparkles,
  PackagePlus,
  CircleDollarSign,
  Tag,
  XCircle,
} from 'lucide-react';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */
interface ServiceAddon {
  id: string;
  name: string;
  price: number;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  isActive: boolean;
  addons: ServiceAddon[];
}

interface FormData {
  name: string;
  description: string;
  price: string;
  duration: string;
}

interface AddonFormData {
  name: string;
  price: string;
}

/* ================================================================== */
/*  Skeleton Grid Card                                                  */
/* ================================================================== */
function SkeletonGridCard() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'var(--white)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Top row skeleton */}
      <div className="flex items-start justify-between mb-5">
        <div
          className="h-5 rounded-md w-32"
          style={{ background: 'var(--gray-100)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}
        />
        <div className="flex gap-1.5">
          <div
            className="h-8 w-8 rounded-lg"
            style={{ background: 'var(--gray-100)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}
          />
          <div
            className="h-8 w-8 rounded-lg"
            style={{ background: 'var(--gray-100)', animation: 'pulse-soft 1.2s ease-in-out 0.1s infinite' }}
          />
        </div>
      </div>
      {/* Description skeleton */}
      <div className="space-y-2 mb-5">
        <div
          className="h-3 rounded-md w-full"
          style={{ background: 'var(--gray-100)', animation: 'pulse-soft 1.2s ease-in-out 0.15s infinite' }}
        />
        <div
          className="h-3 rounded-md w-3/4"
          style={{ background: 'var(--gray-100)', animation: 'pulse-soft 1.2s ease-in-out 0.2s infinite' }}
        />
      </div>
      {/* Price skeleton */}
      <div
        className="h-8 rounded-lg w-24 mb-4"
        style={{ background: 'var(--gray-100)', animation: 'pulse-soft 1.2s ease-in-out 0.25s infinite' }}
      />
      {/* Duration + toggle skeleton */}
      <div className="flex items-center justify-between">
        <div
          className="h-5 rounded-full w-20"
          style={{ background: 'var(--gray-100)', animation: 'pulse-soft 1.2s ease-in-out 0.3s infinite' }}
        />
        <div
          className="h-6 rounded-full w-16"
          style={{ background: 'var(--gray-100)', animation: 'pulse-soft 1.2s ease-in-out 0.35s infinite' }}
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Empty State                                                        */
/* ================================================================== */
function EmptyServicesState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center py-20"
      style={{ animation: 'fadeIn 0.4s ease-out both' }}
    >
      <div
        className="flex items-center justify-center rounded-full mb-6"
        style={{
          width: 80,
          height: 80,
          background: 'var(--gray-100)',
        }}
      >
        <Sparkles size={36} strokeWidth={1.5} style={{ color: 'var(--gray-400)' }} />
      </div>
      <h3
        className="text-[17px] font-semibold mb-2"
        style={{ color: 'var(--gray-700)' }}
      >
        No services yet
      </h3>
      <p
        className="text-[14px] max-w-xs text-center mb-6"
        style={{ color: 'var(--gray-400)' }}
      >
        Create your first service to start accepting bookings.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold text-white transition-all duration-150"
        style={{
          background: 'var(--electric-blue)',
          boxShadow: 'var(--shadow-glow-blue)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--electric-blue-hover)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--electric-blue)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <Plus size={16} strokeWidth={2} />
        Add Service
      </button>
    </div>
  );
}

/* ================================================================== */
/*  Service Grid Card                                                  */
/* ================================================================== */
function ServiceGridCard({
  service,
  onEdit,
  onDelete,
  onToggle,
}: {
  service: Service;
  onEdit: (s: Service) => void;
  onDelete: (id: string) => void;
  onToggle: (s: Service) => void;
}) {
  return (
    <div
      className="rounded-2xl p-6 transition-all duration-200 relative group"
      style={{
        background: 'var(--white)',
        boxShadow: 'var(--shadow-sm)',
        animation: 'fadeIn 0.35s ease-out both',
        opacity: service.isActive ? 1 : 0.6,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top: Name + Action Buttons (hover reveal) */}
      <div className="flex items-start justify-between mb-3">
        <h3
          className="text-[17px] font-bold tracking-tight pr-4"
          style={{ color: 'var(--gray-900)' }}
        >
          {service.name}
        </h3>
        <div
          className="flex items-center gap-1 shrink-0 transition-opacity duration-150"
          style={{ opacity: 0 }}
        >
          <button
            onClick={() => onEdit(service)}
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150"
            style={{
              color: 'var(--gray-400)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gray-100)';
              e.currentTarget.style.color = 'var(--gray-700)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--gray-400)';
            }}
            title="Edit service"
            aria-label="Edit service"
          >
            <Pencil size={14} strokeWidth={1.8} />
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this service? This cannot be undone.')) onDelete(service.id);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150"
            style={{
              color: 'var(--gray-400)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--rose-light)';
              e.currentTarget.style.color = 'var(--rose)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--gray-400)';
            }}
            title="Delete service"
            aria-label="Delete service"
          >
            <Trash2 size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-[13px] leading-relaxed mb-5 line-clamp-2"
        style={{ color: 'var(--gray-500)' }}
      >
        {service.description || 'No description provided'}
      </p>

      {/* Price */}
      <div className="mb-5">
        <span
          className="text-[26px] font-bold tabular-nums"
          style={{ color: 'var(--electric-blue)' }}
        >
          ${Number(service.price).toFixed(2)}
        </span>
      </div>

      {/* Duration + Active/Inactive Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <Clock size={13} strokeWidth={1.8} style={{ color: 'var(--gray-400)' }} />
          <span className="text-[12.5px] font-medium" style={{ color: 'var(--gray-500)' }}>
            {service.duration} min
          </span>
        </div>
        <button
          onClick={() => onToggle(service)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-semibold transition-all duration-150"
          style={{
            background: service.isActive ? 'var(--emerald-light)' : 'var(--gray-100)',
            color: service.isActive ? 'var(--emerald)' : 'var(--gray-400)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'brightness(1)';
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: service.isActive ? 'var(--emerald)' : 'var(--gray-400)',
            }}
          />
          {service.isActive ? 'Active' : 'Inactive'}
        </button>
      </div>

      {/* Add-ons */}
      {service.addons && service.addons.length > 0 && (
        <div
          className="pt-4"
          style={{ borderTop: '1px solid var(--gray-100)' }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-wider mb-2.5"
            style={{ color: 'var(--gray-400)' }}
          >
            Add-ons
          </p>
          <div className="flex flex-wrap gap-1.5">
            {service.addons.map((addon) => (
              <span
                key={addon.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-medium"
                style={{
                  background: 'var(--gray-50)',
                  color: 'var(--gray-600)',
                  border: '1px solid var(--gray-200)',
                }}
              >
                <Tag size={10} strokeWidth={1.8} />
                {addon.name}
                <span style={{ color: 'var(--electric-blue)' }}>
                  +${Number(addon.price).toFixed(2)}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Modal Form                                                         */
/* ================================================================== */
function ServiceModal({
  mode,
  initialForm,
  services,
  onClose,
  onSave,
  onAddAddon,
  onDeleteAddon,
}: {
  mode: 'create' | 'edit';
  initialForm: FormData;
  services: Service[];
  onClose: () => void;
  onSave: (data: FormData) => Promise<boolean>;
  onAddAddon: (serviceId: string, data: AddonFormData) => Promise<boolean>;
  onDeleteAddon: (addonId: string) => Promise<boolean>;
}) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAddonSection, setShowAddonSection] = useState(false);
  const [addonForm, setAddonForm] = useState<AddonFormData>({ name: '', price: '' });
  const [addonSaving, setAddonSaving] = useState(false);
  const [selectedAddonService, setSelectedAddonService] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const ok = await onSave(form);
    setSaving(false);
    if (!ok) setError('Something went wrong. Please try again.');
  }

  async function handleAddAddon(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAddonService) return;
    setAddonSaving(true);
    const ok = await onAddAddon(selectedAddonService, addonForm);
    setAddonSaving(false);
    if (ok) {
      setAddonForm({ name: '', price: '' });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.2s ease-out both' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(13, 17, 23, 0.4)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: 'var(--white)',
          boxShadow: 'var(--shadow-xl)',
          animation: 'fadeIn 0.25s ease-out 0.05s both',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--gray-100)' }}
        >
          <h3
            className="text-[16px] font-semibold"
            style={{ color: 'var(--gray-900)' }}
          >
            {mode === 'create' ? 'New Service' : 'Edit Service'}
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-100"
            style={{ color: 'var(--gray-400)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gray-100)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div
                className="px-3.5 py-2.5 rounded-xl text-[13px] font-medium"
                style={{
                  background: 'var(--rose-light)',
                  color: 'var(--rose)',
                  border: '1px solid rgba(225,29,72,0.15)',
                }}
              >
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label
                className="block text-[12.5px] font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: 'var(--gray-500)' }}
              >
                Service Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Full Detail, Ceramic Coating"
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-[12.5px] font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: 'var(--gray-500)' }}
              >
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the service..."
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Price + Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="flex items-center gap-1.5 text-[12.5px] font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: 'var(--gray-500)' }}
                >
                  <CircleDollarSign size={12} strokeWidth={2} />
                  Price ($) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="149.99"
                />
              </div>
              <div>
                <label
                  className="flex items-center gap-1.5 text-[12.5px] font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: 'var(--gray-500)' }}
                >
                  <Clock size={12} strokeWidth={2} />
                  Duration (min) *
                </label>
                <input
                  type="number"
                  required
                  min="15"
                  step="5"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="60"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-2.5 px-6 py-4"
            style={{ borderTop: '1px solid var(--gray-100)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-150"
              style={{
                color: 'var(--gray-600)',
                background: 'transparent',
                border: '1.5px solid var(--gray-200)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--gray-50)';
                e.currentTarget.style.borderColor = 'var(--gray-300)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'var(--gray-200)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-semibold text-white transition-all duration-150"
              style={{
                background: saving ? 'var(--gray-300)' : 'var(--electric-blue)',
                boxShadow: saving ? 'none' : 'var(--shadow-glow-blue)',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              <Save size={14.5} strokeWidth={2} />
              {saving ? 'Saving...' : mode === 'create' ? 'Create Service' : 'Update Service'}
            </button>
          </div>
        </form>

        {/* ============================================================== */}
        {/*  ADD-ON MANAGEMENT SECTION (inside modal)                       */}
        {/* ============================================================== */}
        <div
          className="px-6 py-4"
          style={{
            borderTop: '1px solid var(--gray-100)',
            background: 'var(--gray-25)',
          }}
        >
          <button
            type="button"
            onClick={() => setShowAddonSection(!showAddonSection)}
            className="flex items-center gap-2 text-[13px] font-semibold w-full transition-colors duration-100"
            style={{ color: 'var(--electric-blue)' }}
          >
            <PackagePlus size={15} strokeWidth={2} />
            {showAddonSection ? 'Hide Add-on Management' : 'Manage Add-ons'}
          </button>

          {showAddonSection && (
            <div className="mt-4" style={{ animation: 'fadeIn 0.2s ease-out both' }}>
              {/* Add-on form */}
              <form
                onSubmit={handleAddAddon}
                className="mb-4 p-4 rounded-xl"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--gray-200)',
                }}
              >
                <p
                  className="text-[12px] font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--gray-500)' }}
                >
                  Add New Add-on
                </p>
                {mode === 'edit' && (
                  <div className="mb-3">
                    <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--gray-500)' }}>
                      Service
                    </label>
                    <select
                      value={selectedAddonService}
                      onChange={(e) => setSelectedAddonService(e.target.value)}
                      required
                      style={{ background: 'var(--white)' }}
                    >
                      <option value="">Select a service...</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--gray-500)' }}>
                      Add-on Name
                    </label>
                    <input
                      type="text"
                      required
                      value={addonForm.name}
                      onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
                      placeholder="Ceramic coat"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--gray-500)' }}>
                      Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={addonForm.price}
                      onChange={(e) => setAddonForm({ ...addonForm, price: e.target.value })}
                      placeholder="49.99"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={addonSaving || (mode === 'edit' && !selectedAddonService)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold text-white transition-all duration-150"
                  style={{
                    background: addonSaving ? 'var(--gray-300)' : 'var(--electric-blue)',
                    cursor: addonSaving || (mode === 'edit' && !selectedAddonService) ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Plus size={13} strokeWidth={2.5} />
                  {addonSaving ? 'Adding...' : 'Add Add-on'}
                </button>
              </form>

              {/* Existing add-ons list */}
              {services.some((s) => s.addons && s.addons.length > 0) && (
                <div>
                  <p
                    className="text-[12px] font-semibold uppercase tracking-wider mb-2.5"
                    style={{ color: 'var(--gray-500)' }}
                  >
                    Existing Add-ons
                  </p>
                  <div className="space-y-2">
                    {services.map((s) =>
                      s.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                          style={{
                            background: 'var(--white)',
                            border: '1px solid var(--gray-100)',
                          }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Tag size={11} strokeWidth={1.8} style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
                            <span className="text-[12.5px] font-medium truncate" style={{ color: 'var(--gray-700)' }}>
                              {s.name} &mdash; {addon.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className="text-[12.5px] font-bold tabular-nums" style={{ color: 'var(--electric-blue)' }}>
                              ${Number(addon.price).toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => onDeleteAddon(addon.id)}
                              className="flex items-center justify-center w-6 h-6 rounded-md transition-colors duration-100"
                              style={{ color: 'var(--gray-400)' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--rose-light)';
                                e.currentTarget.style.color = 'var(--rose)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--gray-400)';
                              }}
                              aria-label="Delete add-on"
                            >
                              <XCircle size={13} strokeWidth={1.8} />
                            </button>
                          </div>
                        </div>
                      )),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                */
/* ================================================================== */
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    duration: '',
  });

  /* --- Fetch services ----------------------------------------------- */
  const loadServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch {
      // Silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  /* --- Open modal for create ---------------------------------------- */
  function openCreateModal() {
    setModalMode('create');
    setEditingId(null);
    setForm({ name: '', description: '', price: '', duration: '' });
    setShowModal(true);
  }

  /* --- Open modal for edit ------------------------------------------ */
  function openEditModal(s: Service) {
    setModalMode('edit');
    setEditingId(s.id);
    setForm({
      name: s.name,
      description: s.description || '',
      price: String(s.price),
      duration: String(s.duration),
    });
    setShowModal(true);
  }

  /* --- Save (create or update) -------------------------------------- */
  async function handleSave(data: FormData): Promise<boolean> {
    const body = {
      name: data.name,
      description: data.description || null,
      price: parseFloat(data.price),
      duration: parseInt(data.duration, 10),
    };

    try {
      let url: string;
      let method: string;

      if (modalMode === 'edit' && editingId) {
        url = `/api/services/${editingId}`;
        method = 'PUT';
      } else {
        url = '/api/services';
        method = 'POST';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) return false;

      setShowModal(false);
      loadServices();
      return true;
    } catch {
      return false;
    }
  }

  /* --- Toggle active ------------------------------------------------ */
  async function handleToggle(s: Service) {
    try {
      await fetch(`/api/services/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !s.isActive }),
      });
      setServices((prev) =>
        prev.map((svc) =>
          svc.id === s.id ? { ...svc, isActive: !svc.isActive } : svc,
        ),
      );
    } catch {
      // Silently handle
    }
  }

  /* --- Delete -------------------------------------------------------- */
  async function handleDelete(id: string) {
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // Silently handle
    }
  }

  /* --- Add add-on --------------------------------------------------- */
  async function handleAddAddon(
    serviceId: string,
    data: AddonFormData,
  ): Promise<boolean> {
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addAddon',
          serviceId,
          name: data.name,
          price: parseFloat(data.price),
        }),
      });
      if (!res.ok) return false;
      loadServices();
      return true;
    } catch {
      return false;
    }
  }

  /* --- Delete add-on ------------------------------------------------- */
  async function handleDeleteAddon(addonId: string): Promise<boolean> {
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteAddon', addonId }),
      });
      loadServices();
      return true;
    } catch {
      return false;
    }
  }

  /* ================================================================== */
  /*  RENDER                                                            */
  /* ================================================================== */
  return (
    <div className="max-w-[1200px] mx-auto">
      {/* ============================================================== */}
      {/*  PAGE HEADER                                                    */}
      {/* ============================================================== */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        style={{ animation: 'fadeIn 0.3s ease-out both' }}
      >
        <div>
          <h2
            className="text-[22px] md:text-[26px] font-bold tracking-tight"
            style={{ color: 'var(--gray-900)' }}
          >
            Services
          </h2>
          <p
            className="text-[13.5px] mt-1"
            style={{ color: 'var(--gray-500)' }}
          >
            {services.length} service{services.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold text-white shrink-0 transition-all duration-150"
          style={{
            background: 'var(--electric-blue)',
            boxShadow: 'var(--shadow-glow-blue)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--electric-blue-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(37,99,235,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--electric-blue)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow-blue)';
          }}
        >
          <Plus size={16} strokeWidth={2} />
          Add Service
        </button>
      </div>

      {/* ============================================================== */}
      {/*  SERVICES GRID                                                  */}
      {/* ============================================================== */}
      {loading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          style={{ animation: 'fadeIn 0.3s ease-out both' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonGridCard key={i} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyServicesState onAdd={openCreateModal} />
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {services.map((service, i) => (
            <ServiceGridCard
              key={service.id}
              service={service}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/*  MODAL                                                          */}
      {/* ============================================================== */}
      {showModal && (
        <ServiceModal
          mode={modalMode}
          initialForm={form}
          services={services}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          onAddAddon={handleAddAddon}
          onDeleteAddon={handleDeleteAddon}
        />
      )}

      {/* ============================================================== */}
      {/*  HOVER REVEAL STYLE FOR ACTION BUTTONS                          */}
      {/* ============================================================== */}
      <style>{`
        .group:hover > div > div.flex.items-center.gap-1.shrink-0 {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
