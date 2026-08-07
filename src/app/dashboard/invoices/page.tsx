'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  DollarSign,
  Clock,
  TrendingUp,
  Receipt,
  Car,
  CheckCircle2,
  BellRing,
  Inbox,
} from 'lucide-react';

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

type FilterTab = 'All' | 'Paid' | 'Pending' | 'Overdue';

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  vehicle: string;
  service: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
}

const demoInvoices: Invoice[] = [
  {
    id: 'inv-1', number: 'INV-001', customerName: 'Marcus Chen',
    vehicle: '2024 BMW M4 Competition', service: 'Full Detail + Ceramic Coat',
    amount: 2850, status: 'Paid', date: '2025-01-13',
  },
  {
    id: 'inv-2', number: 'INV-002', customerName: 'Sarah Williams',
    vehicle: '2023 Mercedes-AMG C63 S', service: 'Brake Pad Replacement',
    amount: 980, status: 'Paid', date: '2025-01-12',
  },
  {
    id: 'inv-3', number: 'INV-003', customerName: 'David Park',
    vehicle: '2024 Porsche 911 Carrera S', service: 'Annual Inspection + Oil Change',
    amount: 620, status: 'Pending', date: '2025-01-11',
  },
  {
    id: 'inv-4', number: 'INV-004', customerName: 'Emily Rodriguez',
    vehicle: '2023 Audi RS6 Avant', service: 'Transmission Fluid Service',
    amount: 1450, status: 'Overdue', date: '2025-01-03',
  },
  {
    id: 'inv-5', number: 'INV-005', customerName: 'James Okafor',
    vehicle: '2025 Tesla Model S Plaid', service: 'Paint Correction + PPF',
    amount: 4200, status: 'Paid', date: '2025-01-10',
  },
  {
    id: 'inv-6', number: 'INV-006', customerName: 'Ava Thompson',
    vehicle: '2022 Lexus LC 500', service: 'Wheel Refinishing (Set)',
    amount: 1200, status: 'Pending', date: '2025-01-09',
  },
  {
    id: 'inv-7', number: 'INV-007', customerName: 'Robert Kim',
    vehicle: '2024 BMW X5 M60i', service: 'Suspension Overhaul',
    amount: 3100, status: 'Overdue', date: '2024-12-28',
  },
  {
    id: 'inv-8', number: 'INV-008', customerName: 'Lisa Nguyen',
    vehicle: '2023 Mercedes-Benz GLE 63 S', service: 'Exterior Detail',
    amount: 450, status: 'Paid', date: '2025-01-08',
  },
  {
    id: 'inv-9', number: 'INV-009', customerName: 'Michael Foster',
    vehicle: '2024 Porsche Cayenne Turbo GT', service: 'Performance Exhaust Install',
    amount: 5800, status: 'Pending', date: '2025-01-07',
  },
  {
    id: 'inv-10', number: 'INV-010', customerName: 'Rachel Adams',
    vehicle: '2025 Audi e-tron GT RS', service: 'Window Tinting',
    amount: 650, status: 'Paid', date: '2025-01-06',
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusStyle(status: InvoiceStatus) {
  switch (status) {
    case 'Paid':
      return {
        bg: 'var(--emerald-muted)',
        color: 'var(--emerald)',
      };
    case 'Pending':
      return {
        bg: 'var(--amber-muted)',
        color: 'var(--amber)',
      };
    case 'Overdue':
      return {
        bg: 'var(--rose-muted)',
        color: 'var(--rose)',
      };
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'var(--bg-secondary)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 36, height: 36, background: iconBg }}
        >
          <Icon size={16} strokeWidth={2} style={{ color: iconColor }} />
        </div>
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  );
}

function InvoiceCard({
  invoice,
  index,
  onMarkPaid,
  onSendReminder,
}: {
  invoice: Invoice;
  index: number;
  onMarkPaid: (id: string) => void;
  onSendReminder: (id: string) => void;
}) {
  const statusStyle = getStatusStyle(invoice.status);
  const isPaid = invoice.status === 'Paid';

  return (
    <div
      className="rounded-2xl p-5 group"
      style={{
        background: 'var(--bg-secondary)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.2s ease',
        animation: 'fadeIn 0.35s ease-out both',
        animationDelay: `${index * 0.04}s`,
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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[13px] font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              {invoice.number}
            </span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {invoice.status}
            </span>
          </div>
          <p
            className="text-[15px] font-semibold truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {invoice.customerName}
          </p>
        </div>
        <p
          className="text-xl font-bold shrink-0"
          style={{ color: 'var(--text-primary)' }}
        >
          {formatCurrency(invoice.amount)}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <Car
          size={12.5}
          strokeWidth={1.8}
          style={{ color: 'var(--text-muted)', flexShrink: 0 }}
        />
        <span
          className="text-[12.5px] truncate"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {invoice.vehicle}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mb-4">
        <Receipt
          size={12.5}
          strokeWidth={1.8}
          style={{ color: 'var(--text-muted)', flexShrink: 0 }}
        />
        <span className="text-[12.5px]" style={{ color: 'var(--text-tertiary)' }}>
          {invoice.service}
        </span>
      </div>

      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-1.5">
          <Clock
            size={11}
            strokeWidth={1.8}
            style={{ color: 'var(--text-muted)', flexShrink: 0 }}
          />
          <span className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>
            {formatDate(invoice.date)}
          </span>
        </div>

        {!isPaid && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onMarkPaid(invoice.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer"
              style={{
                background: 'var(--emerald-muted)',
                color: 'var(--emerald)',
                border: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--emerald)';
                e.currentTarget.style.color = 'var(--white)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--emerald-muted)';
                e.currentTarget.style.color = 'var(--emerald)';
              }}
            >
              <CheckCircle2 size={13} strokeWidth={2} />
              Mark Paid
            </button>
            <button
              onClick={() => onSendReminder(invoice.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer"
              style={{
                background: 'var(--amber-muted)',
                color: 'var(--amber)',
                border: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--amber)';
                e.currentTarget.style.color = 'var(--white)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--amber-muted)';
                e.currentTarget.style.color = 'var(--amber)';
              }}
            >
              <BellRing size={13} strokeWidth={2} />
              Send Reminder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl py-20 px-8 text-center"
      style={{
        background: 'var(--bg-secondary)',
        border: '1.5px dashed var(--border)',
      }}
    >
      <div
        className="flex items-center justify-center rounded-full mb-5"
        style={{
          width: 64,
          height: 64,
          background: 'var(--accent-muted)',
        }}
      >
        <Receipt
          size={28}
          strokeWidth={1.5}
          style={{ color: 'var(--accent)' }}
        />
      </div>
      <h3
        className="text-base font-semibold mb-1"
        style={{ color: 'var(--text-secondary)' }}
      >
        No invoices yet
      </h3>
      <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
        Invoices will appear here once services are completed and billed.
      </p>
    </div>
  );
}

const filterTabs: FilterTab[] = ['All', 'Paid', 'Pending', 'Overdue'];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(demoInvoices);
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const filteredInvoices = useMemo(() => {
    if (activeTab === 'All') return invoices;
    return invoices.filter((inv) => inv.status === activeTab);
  }, [invoices, activeTab]);

  const stats = useMemo(() => {
    const totalRevenue = invoices
      .filter((i) => i.status === 'Paid')
      .reduce((sum, i) => sum + i.amount, 0);
    const outstanding = invoices
      .filter((i) => i.status !== 'Paid')
      .reduce((sum, i) => sum + i.amount, 0);
    const now = new Date();
    const thisMonth = invoices
      .filter((i) => {
        const d = new Date(i.date + 'T00:00:00');
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, i) => sum + i.amount, 0);
    const avgValue = invoices.length > 0
      ? invoices.reduce((sum, i) => sum + i.amount, 0) / invoices.length
      : 0;
    return {
      totalRevenue: formatCurrency(totalRevenue),
      outstanding: formatCurrency(outstanding),
      thisMonth: formatCurrency(thisMonth),
      avgValue: formatCurrency(avgValue),
    };
  }, [invoices]);

  const handleMarkPaid = useCallback((id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: 'Paid' as InvoiceStatus } : inv
      )
    );
  }, []);

  const handleSendReminder = useCallback((id: string) => {
    alert(`Reminder sent for invoice ${id}`);
  }, []);

  const handleCreateInvoice = useCallback(() => {
    alert('Create Invoice dialog would open here');
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ animation: 'fadeIn 0.35s ease-out both' }}
      >
        <div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Invoices
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Track payments and manage billing
          </p>
        </div>
        <button
          onClick={handleCreateInvoice}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer shrink-0"
          style={{
            background: 'var(--accent)',
            boxShadow: 'var(--shadow-sm)',
            border: 'none',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-hover)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--accent)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Create Invoice
        </button>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        style={{ animation: 'fadeIn 0.35s ease-out 0.05s both' }}
      >
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={stats.totalRevenue}
          iconBg="var(--emerald-muted)"
          iconColor="var(--emerald)"
        />
        <StatCard
          icon={Clock}
          label="Outstanding"
          value={stats.outstanding}
          iconBg="var(--amber-muted)"
          iconColor="var(--amber)"
        />
        <StatCard
          icon={TrendingUp}
          label="This Month"
          value={stats.thisMonth}
          iconBg="var(--accent-muted)"
          iconColor="var(--accent)"
        />
        <StatCard
          icon={Receipt}
          label="Avg Invoice Value"
          value={stats.avgValue}
          iconBg="var(--violet-muted)"
          iconColor="var(--violet)"
        />
      </div>

      <div
        className="flex items-center gap-1.5 p-1.5 rounded-2xl w-fit"
        style={{
          background: 'var(--bg-hover)',
          animation: 'fadeIn 0.35s ease-out 0.1s both',
        }}
      >
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab;
          const count =
            tab === 'All'
              ? invoices.length
              : invoices.filter((i) => i.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer"
              style={{
                background: isActive ? 'var(--bg-secondary)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                border: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-tertiary)';
                }
              }}
            >
              {tab}
              <span
                className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: isActive ? 'var(--border-subtle)' : 'transparent',
                  color: isActive ? 'var(--text-tertiary)' : 'var(--text-muted)',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredInvoices.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredInvoices.map((invoice, idx) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              index={idx}
              onMarkPaid={handleMarkPaid}
              onSendReminder={handleSendReminder}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
