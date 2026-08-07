// @ts-nocheck
'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  Users,
  Car,
  Sparkles,
  UserCog,
  Receipt,
  BarChart3,
  Cog,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
} from 'lucide-react';

interface OrgUser {
  name: string;
  email?: string;
  orgName: string;
  orgSlug: string;
  role: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
      { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarCheck },
    ],
  },
  {
    title: 'BUSINESS',
    items: [
      { href: '/dashboard/customers', label: 'Customers', icon: Users },
      { href: '/dashboard/vehicles', label: 'Vehicles', icon: Car },
      { href: '/dashboard/services', label: 'Services', icon: Sparkles },
      { href: '/dashboard/team', label: 'Employees', icon: UserCog },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
      { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
];

const settingsItem: NavItem = {
  href: '/dashboard/settings',
  label: 'Settings',
  icon: Cog,
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getPageTitle(pathname: string): string {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (pathname === item.href) return item.label;
    }
  }
  if (pathname === settingsItem.href) return settingsItem.label;
  return 'Dashboard';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<OrgUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => {
        if (!r.ok) {
          router.push('/login');
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setUser(data);
      });
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = useCallback(() => {
    fetch('/api/auth/logout', { method: 'POST' });
    document.cookie = 'session=; path=/; max-age=0';
    router.push('/login');
  }, [router]);

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg"
            style={{
              background: 'var(--accent)',
              animation: 'pulse-soft 1.2s ease-in-out infinite',
            }}
          />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="mobiliq-shell" style={{ background: 'var(--bg-primary)' }}>
      <aside
        className={
          'mobiliq-sidebar' + (sidebarOpen ? ' mobiliq-sidebar-open' : '')
        }
      >
        <div
          className="flex items-center gap-3 px-5 shrink-0"
          style={{
            height: 'var(--header-height)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            className="flex items-center justify-center text-white font-bold text-sm"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'var(--accent)',
            }}
          >
            M
          </div>
          <span
            className="text-[15px] font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Mobiliq
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden p-1.5 rounded-lg transition-colors duration-100"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-5">
              <p
                className="px-3 mb-1.5 text-[11px] font-semibold tracking-widest uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={
                          'nav-link' + (active ? ' nav-link-active' : '')
                        }
                      >
                        <Icon
                          size={18}
                          strokeWidth={active ? 2.2 : 1.8}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div
            className="pt-2"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <ul className="space-y-0.5">
              <li>
                <Link
                  href={settingsItem.href}
                  onClick={() => setSidebarOpen(false)}
                  className={
                    'nav-link' +
                    (pathname === settingsItem.href
                      ? ' nav-link-active'
                      : '')
                  }
                >
                  <Cog
                    size={18}
                    strokeWidth={
                      pathname === settingsItem.href ? 2.2 : 1.8
                    }
                  />
                  <span>{settingsItem.label}</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div
          className="shrink-0 px-4 py-3"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-tertiary)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-full text-white text-xs font-semibold shrink-0"
              style={{
                width: 36,
                height: 36,
                background: 'var(--accent-gradient)',
              }}
            >
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] font-medium truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {user.name}
              </p>
              <p
                className="text-[11.5px] truncate"
                style={{ color: 'var(--text-muted)' }}
              >
                {user.email || user.orgName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg transition-colors duration-100"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.color = 'var(--rose)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
              aria-label="Log out"
            >
              <LogOut size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="mobiliq-main">
        <header
          className="sticky top-0 z-30 glass flex items-center gap-4 px-4 md:px-8 shrink-0"
          style={{
            height: 'var(--header-height)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-lg transition-colors duration-100"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label="Open sidebar"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>

          <h1
            className="text-[15px] font-semibold tracking-tight hidden sm:block"
            style={{ color: 'var(--text-primary)' }}
          >
            {pageTitle}
          </h1>

          <div className="flex-1" />

          <div className="relative hidden md:block">
            <Search
              size={15}
              strokeWidth={1.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-[7px] text-[13px] rounded-lg w-56 focus:w-72 transition-all duration-200"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1.5px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <button
            className="relative p-2 rounded-lg transition-colors duration-100"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-tertiary)';
            }}
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.8} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
