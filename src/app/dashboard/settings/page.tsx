'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Building2,
  Palette,
  Link2,
  Users,
  CreditCard,
  Copy,
  Check,
  Upload,
  X,
  Plus,
  UserMinus,
  Crown,
  Zap,
  QrCode,
  ExternalLink,
  Eye,
  ArrowRight,
  Shield,
  BarChart3,
  CalendarCheck,
  Loader2,
} from 'lucide-react';

/* ================================================================== */
/*  Types                                                               */
/* ================================================================== */
interface OrgData {
  id?: string;
  name: string;
  slug: string;
  email?: string | null;
  phone: string | null;
  address: string | null;
  brandColor: string;
  logo: string | null;
  plan: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

type TabKey = 'profile' | 'branding' | 'booking' | 'team' | 'billing';

/* ================================================================== */
/*  Constants                                                           */
/* ================================================================== */
const PRESET_COLORS = [
  '#2563eb', '#0d1117', '#059669', '#d97706', '#e11d48',
  '#7c3aed', '#0891b2', '#4f46e5', '#be123c', '#65a30d',
];

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'profile', label: 'Business Profile', icon: Building2 },
  { key: 'branding', label: 'Branding', icon: Palette },
  { key: 'booking', label: 'Booking Page', icon: Link2 },
  { key: 'team', label: 'Team', icon: Users },
  { key: 'billing', label: 'Billing', icon: CreditCard },
];

/* ================================================================== */
/*  Helpers                                                             */
/* ================================================================== */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const ROLE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  owner: { bg: 'var(--accent-muted)', text: 'var(--accent)', label: 'Owner' },
  admin: { bg: 'var(--violet-muted)', text: 'var(--violet)', label: 'Admin' },
  employee: { bg: 'var(--border-subtle)', text: 'var(--text-tertiary)', label: 'Employee' },
};

/* ================================================================== */
/*  Skeleton                                                            */
/* ================================================================== */
function TabSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl p-6"
          style={{
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            className="rounded-md mb-4"
            style={{
              width: `${40 + i * 15}%`,
              height: 14,
              background: 'var(--bg-hover)',
              animation: 'pulse-soft 1.5s ease-in-out infinite',
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((j) => (
              <div key={j}>
                <div
                  className="rounded-md mb-2"
                  style={{
                    width: '30%',
                    height: 10,
                    background: 'var(--bg-hover)',
                    animation: `pulse-soft 1.5s ease-in-out infinite ${j * 0.1}s`,
                  }}
                />
                <div
                  className="rounded-md"
                  style={{
                    height: 40,
                    background: 'var(--bg-secondary)',
                    animation: `pulse-soft 1.5s ease-in-out infinite ${j * 0.15}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  Tab: Business Profile                                               */
/* ================================================================== */
function BusinessProfileTab({
  form,
  setForm,
  saving,
  onSave,
  msg,
}: {
  form: { name: string; email: string; phone: string; address: string };
  setForm: (f: typeof form) => void;
  saving: boolean;
  onSave: () => void;
  msg: string;
}) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Message banner */}
      {msg && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in"
          style={{
            background: msg.includes('saved') || msg.includes('Success')
              ? 'var(--emerald-muted)'
              : 'var(--rose-muted)',
            color: msg.includes('saved') || msg.includes('Success')
              ? 'var(--emerald)'
              : 'var(--rose)',
            border: `1px solid ${msg.includes('saved') || msg.includes('Success') ? 'rgba(5,150,105,0.15)' : 'rgba(225,29,72,0.15)'}`,
          }}
        >
          {msg.includes('saved') || msg.includes('Success') ? <Check size={16} strokeWidth={2} /> : <X size={16} strokeWidth={2} />}
          {msg}
        </div>
      )}

      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, background: 'var(--accent-muted)' }}
          >
            <Building2 size={18} strokeWidth={2} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              Business Information
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Update your business details visible to customers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
              Business Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Premium Auto Spa"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="hello@yourbusiness.com"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="123 Main St, City, State ZIP"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'var(--accent)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.background = 'var(--accent-hover)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {saving && <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Tab: Branding                                                       */
/* ================================================================== */
function BrandingTab({
  brandColor,
  onColorChange,
  onSave,
  saving,
  msg,
}: {
  brandColor: string;
  onColorChange: (c: string) => void;
  onSave: () => void;
  saving: boolean;
  msg: string;
}) {
  const [customHex, setCustomHex] = useState(brandColor);
  const [uploadHover, setUploadHover] = useState(false);

  useEffect(() => {
    setCustomHex(brandColor);
  }, [brandColor]);

  const handleHexChange = (val: string) => {
    const hex = val.startsWith('#') ? val : `#${val}`;
    if (/^#[0-9a-fA-F]{0,6}$/.test(hex)) {
      setCustomHex(hex);
      if (hex.length === 7) onColorChange(hex);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {msg && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in"
          style={{
            background: msg.includes('saved') || msg.includes('Success')
              ? 'var(--emerald-muted)'
              : 'var(--rose-muted)',
            color: msg.includes('saved') || msg.includes('Success')
              ? 'var(--emerald)'
              : 'var(--rose)',
          }}
        >
          {msg.includes('saved') || msg.includes('Success') ? <Check size={16} strokeWidth={2} /> : <X size={16} strokeWidth={2} />}
          {msg}
        </div>
      )}

      {/* Brand Color */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, background: 'var(--accent-muted)' }}
          >
            <Palette size={18} strokeWidth={2} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              Brand Color
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Choose the accent color for your booking page
            </p>
          </div>
        </div>

        {/* Preset swatches */}
        <div className="mb-5">
          <p className="text-[12px] font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Preset Colors
          </p>
          <div className="flex flex-wrap gap-3">
            {PRESET_COLORS.map((color) => {
              const active = brandColor.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  onClick={() => {
                    onColorChange(color);
                    setCustomHex(color);
                  }}
                  className="relative cursor-pointer"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: color,
                    border: active ? '3px solid var(--white)' : '3px solid transparent',
                    boxShadow: active
                      ? `0 0 0 2px ${color}, var(--shadow-md)`
                      : 'var(--shadow-sm)',
                    transition: 'all 0.15s ease',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.transform = 'scale(1.15)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label={`Select color ${color}`}
                />
              );
            })}
          </div>
        </div>

        {/* Custom hex input */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <p className="text-[12px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Custom Color
            </p>
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 rounded-xl"
                style={{
                  width: 44,
                  height: 44,
                  background: brandColor,
                  border: '2px solid var(--border)',
                  transition: 'background 0.15s ease',
                }}
              />
              <input
                type="text"
                value={customHex}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#2563eb"
                className="font-mono text-sm"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* Preview bar */}
        <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-[12px] font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Preview
          </p>
          <div
            className="rounded-xl p-4 flex items-center gap-4"
            style={{
              background: brandColor,
              transition: 'background 0.3s ease',
            }}
          >
            <div
              className="flex items-center justify-center rounded-lg text-white font-bold text-sm"
              style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)' }}
            >
              M
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Booking Page Preview</p>
              <p className="text-white/70 text-xs">Your customers will see this color theme</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'var(--accent)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.background = 'var(--accent-hover)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {saving && <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Logo Upload */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, background: 'var(--bg-hover)' }}
          >
            <Upload size={18} strokeWidth={2} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              Logo Upload
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              PNG or SVG, max 2MB. Recommended 512×512px.
            </p>
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center rounded-2xl py-12 px-8 text-center cursor-pointer"
          style={{
            background: uploadHover ? 'var(--accent-muted)' : 'var(--bg-secondary)',
            border: `2px dashed ${uploadHover ? 'var(--accent)' : 'var(--text-muted)'}`,
            transition: 'all 0.2s ease',
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setUploadHover(true);
          }}
          onDragLeave={() => setUploadHover(false)}
          onDrop={(e) => {
            e.preventDefault();
            setUploadHover(false);
          }}
          onClick={() => {}}
          role="button"
          tabIndex={0}
          aria-label="Upload logo"
        >
          <div
            className="flex items-center justify-center rounded-full mb-4"
            style={{
              width: 56,
              height: 56,
              background: uploadHover ? 'rgba(37,99,235,0.1)' : 'var(--border-subtle)',
              transition: 'background 0.2s ease',
            }}
          >
            <Upload
              size={24}
              strokeWidth={1.5}
              style={{ color: uploadHover ? 'var(--accent)' : 'var(--text-muted)' }}
            />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            Drop your logo here, or <span style={{ color: 'var(--accent)' }}>browse</span>
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            PNG, SVG, or JPG up to 2MB
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Tab: Booking Page                                                   */
/* ================================================================== */
function BookingPageTab({ org }: { org: OrgData }) {
  const [copied, setCopied] = useState(false);
  const bookingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${org.slug}`
    : `/${org.slug}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API not available */
    }
  }, [bookingUrl]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Booking URL Card */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, background: 'var(--accent-muted)' }}
          >
            <Link2 size={18} strokeWidth={2} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              Your Booking Page
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Share this link with your customers to accept online bookings
            </p>
          </div>
        </div>

        {/* URL display */}
        <div
          className="flex items-center gap-3 rounded-xl p-4"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          <Link2 size={16} strokeWidth={1.8} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <code
            className="flex-1 text-sm font-mono truncate"
            style={{ color: 'var(--text-secondary)' }}
          >
            {bookingUrl}
          </code>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer shrink-0"
            style={{
              background: copied ? 'var(--emerald-muted)' : 'var(--bg-secondary)',
              color: copied ? 'var(--emerald)' : 'var(--text-secondary)',
              border: `1px solid ${copied ? 'rgba(5,150,105,0.2)' : 'var(--border)'}`,
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? (
              <Check size={13} strokeWidth={2.5} />
            ) : (
              <Copy size={13} strokeWidth={2} />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <a
            href={`/${org.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white no-underline"
            style={{
              background: 'var(--accent)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
            }}
          >
            <Eye size={15} strokeWidth={2} />
            Preview Booking Page
            <ExternalLink size={13} strokeWidth={2} />
          </a>
        </div>
      </div>

      {/* QR Code placeholder */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, background: 'var(--bg-hover)' }}
          >
            <QrCode size={18} strokeWidth={2} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              QR Code
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Print this QR code for in-store display
            </p>
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center rounded-2xl py-10"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            className="flex items-center justify-center rounded-2xl mb-4"
            style={{
              width: 160,
              height: 160,
              background: 'var(--bg-secondary)',
              border: '2px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <QrCode size={80} strokeWidth={1} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            QR code will be generated for {bookingUrl}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Tab: Team                                                           */
/* ================================================================== */
function TeamTab({ team, loading, onRefresh }: { team: TeamMember[]; loading: boolean; onRefresh: () => void }) {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'employee' });
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);

  const handleInvite = async () => {
    if (!inviteForm.name || !inviteForm.email) return;
    setInviting(true);
    setInviteMsg('');
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inviteForm, password: 'changeme123' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to invite');
      setInviteMsg('Member added successfully!');
      setInviteForm({ name: '', email: '', role: 'employee' });
      setShowInvite(false);
      onRefresh();
    } catch (err: unknown) {
      setInviteMsg(err instanceof Error ? err.message : 'Failed to add member');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemoving(id);
    try {
      const res = await fetch('/api/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      onRefresh();
    } catch {
      /* silent fail */
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Message */}
      {inviteMsg && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in"
          style={{
            background: inviteMsg.includes('success') || inviteMsg.includes('Success')
              ? 'var(--emerald-muted)' : 'var(--rose-muted)',
            color: inviteMsg.includes('success') || inviteMsg.includes('Success')
              ? 'var(--emerald)' : 'var(--rose)',
          }}
        >
          {inviteMsg.includes('success') || inviteMsg.includes('Success')
            ? <Check size={16} strokeWidth={2} />
            : <X size={16} strokeWidth={2} />}
          {inviteMsg}
        </div>
      )}

      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 40, height: 40, background: 'var(--accent-muted)' }}
            >
              <Users size={18} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                Team Members
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {team.length} {team.length === 1 ? 'member' : 'members'}
              </p>
            </div>
          </div>
          {!showInvite && (
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer"
              style={{
                background: 'var(--accent)',
                color: 'var(--white)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span className="hidden sm:inline">Invite Member</span>
            </button>
          )}
        </div>

        {/* Invite form */}
        {showInvite && (
          <div
            className="rounded-xl p-5 mb-6 animate-fade-in"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Add New Team Member
              </p>
              <button
                onClick={() => setShowInvite(false)}
                className="p-1.5 rounded-lg cursor-pointer"
                style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                placeholder="Full name"
              />
              <input
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                placeholder="Email address"
              />
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowInvite(false)}
                className="px-4 py-2 rounded-lg text-[13px] font-medium cursor-pointer"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-tertiary)',
                  border: '1px solid var(--border)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteForm.name || !inviteForm.email}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--accent)',
                  transition: 'all 0.15s ease',
                }}
              >
                {inviting && <Loader2 size={13} strokeWidth={2.5} className="animate-spin" />}
                {inviting ? 'Adding…' : 'Add Member'}
              </button>
            </div>
          </div>
        )}

        {/* Team list */}
        <div className="flex flex-col">
          {team.length === 0 && !loading && (
            <div className="flex flex-col items-center py-10 text-center">
              <div
                className="flex items-center justify-center rounded-full mb-3"
                style={{ width: 56, height: 56, background: 'var(--bg-hover)' }}
              >
                <Users size={24} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                No team members yet
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Invite your first team member to get started
              </p>
            </div>
          )}

          {team.map((member, idx) => {
            const roleStyle = ROLE_STYLES[member.role] || ROLE_STYLES.employee;
            return (
              <div
                key={member.id}
                className="flex items-center gap-4 py-4 animate-slide-in"
                style={{
                  borderBottom: idx < team.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  animationDelay: `${idx * 0.05}s`,
                }}
              >
                {/* Avatar */}
                <div
                  className="shrink-0 flex items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ width: 40, height: 40, background: 'var(--accent)' }}
                >
                  {getInitials(member.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {member.name}
                  </p>
                  <p className="text-[12.5px] truncate" style={{ color: 'var(--text-muted)' }}>
                    {member.email}
                  </p>
                </div>

                {/* Role badge */}
                <span
                  className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-[11.5px] font-semibold shrink-0"
                  style={{ background: roleStyle.bg, color: roleStyle.text }}
                >
                  {roleStyle.label}
                </span>

                {/* Remove button */}
                {member.role !== 'owner' && (
                  <button
                    onClick={() => handleRemove(member.id)}
                    disabled={removing === member.id}
                    className="p-2 rounded-lg cursor-pointer shrink-0 disabled:opacity-50"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--rose-muted)';
                      e.currentTarget.style.color = 'var(--rose)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                    aria-label={`Remove ${member.name}`}
                  >
                    {removing === member.id ? (
                      <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                    ) : (
                      <UserMinus size={16} strokeWidth={1.8} />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Tab: Billing                                                        */
/* ================================================================== */
function BillingTab({ org }: { org: OrgData }) {
  const planName = org.plan || 'free';
  const isPro = planName === 'pro' || planName === 'premium';

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Current Plan */}
      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{
          background: isPro
            ? 'linear-gradient(135deg, #0d1117 0%, #1a1f2e 100%)'
            : 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-md)',
          border: isPro ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 44,
                height: 44,
                background: isPro ? 'rgba(255,255,255,0.1)' : 'var(--accent-muted)',
              }}
            >
              <Crown
                size={20}
                strokeWidth={2}
                style={{ color: isPro ? '#fbbf24' : 'var(--accent)' }}
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: isPro ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}>
                Current Plan
              </p>
              <h3
                className="text-xl font-bold capitalize"
                style={{ color: isPro ? 'var(--white)' : 'var(--text-primary)' }}
              >
                {planName === 'pro' ? 'Professional' : planName === 'premium' ? 'Premium' : 'Free'}
              </h3>
            </div>
          </div>

          {!isPro && (
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
              style={{
                background: 'var(--accent)',
                color: 'var(--white)',
                boxShadow: 'var(--shadow-glow)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Zap size={15} strokeWidth={2.5} />
              Upgrade to Pro
              <ArrowRight size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {isPro && (
          <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            You have access to all premium features. Your plan renews automatically.
          </p>
        )}
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 36, height: 36, background: 'var(--accent-muted)' }}
            >
              <CalendarCheck size={16} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Bookings This Month
            </p>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            24
          </p>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: '48%', background: 'var(--accent)', transition: 'width 0.5s ease' }}
            />
          </div>
          <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>24 of 50 limit</p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 36, height: 36, background: 'var(--emerald-muted)' }}
            >
              <BarChart3 size={16} strokeWidth={2} style={{ color: 'var(--emerald)' }} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Total Revenue
            </p>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            $4,820
          </p>
          <p className="text-[11px] mt-2" style={{ color: 'var(--emerald)' }}>
            +12.5% from last month
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 36, height: 36, background: 'var(--violet-muted)' }}
            >
              <Shield size={16} strokeWidth={2} style={{ color: 'var(--violet)' }} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Team Seats
            </p>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            3 / 5
          </p>
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
            2 seats available
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Settings Page (Main)                                                */
/* ================================================================== */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [org, setOrg] = useState<OrgData | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  /* --- Fetch data --- */
  const fetchData = useCallback(() => {
    fetch('/api/org')
      .then((r) => r.json())
      .then((data: OrgData) => {
        setOrg(data);
        setProfileForm({
          name: data.name || '',
          email: (data as any).email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      });

    fetch('/api/team')
      .then((r) => r.json())
      .then((data: TeamMember[]) => {
        setTeam(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* --- Save profile --- */
  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/org', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      if (!res.ok) throw new Error();
      setMsg('Changes saved successfully!');
    } catch {
      setMsg('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (color: string) => {
    setOrg((prev) => prev ? { ...prev, brandColor: color } : prev);
  };

  /* --- Tab content renderer --- */
  const renderTabContent = () => {
    if (loading) return <TabSkeleton />;

    switch (activeTab) {
      case 'profile':
        return (
          <BusinessProfileTab
            form={profileForm}
            setForm={setProfileForm}
            saving={saving}
            onSave={handleSave}
            msg={msg}
          />
        );
      case 'branding':
        return (
          <BrandingTab
            brandColor={org?.brandColor || '#2563eb'}
            onColorChange={handleColorChange}
            onSave={handleSave}
            saving={saving}
            msg={msg}
          />
        );
      case 'booking':
        return org ? <BookingPageTab org={org} /> : null;
      case 'team':
        return <TeamTab team={team} loading={loading} onRefresh={fetchData} />;
      case 'billing':
        return org ? <BillingTab org={org} /> : null;
      default:
        return null;
    }
  };

  if (!org && !loading) return null;

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className="flex flex-col gap-6">
      {/* Page title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          Manage your business preferences and configuration
        </p>
      </div>

      {/* Tab navigation */}
      <div
        className="rounded-2xl p-1.5 overflow-x-auto"
        style={{
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex gap-1 min-w-max">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setMsg('');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer whitespace-nowrap"
                style={{
                  background: active ? 'var(--accent)' : 'transparent',
                  color: active ? 'var(--white)' : 'var(--text-tertiary)',
                  transition: 'all 0.15s ease',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-tertiary)';
                  }
                }}
              >
                <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {renderTabContent()}
    </div>
  );
}
