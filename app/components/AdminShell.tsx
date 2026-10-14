import { Link, useLocation } from 'react-router';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Branding', path: '/branding' },
  { label: 'Employees', path: '/employees' },
  { label: 'Customers', path: '/customers' },
  { label: 'Groups', path: '/groups' },
  { label: 'Meetings', path: '/meetings' },
  { label: 'Reports', path: '/reports' },
  { label: 'Notifications', path: '/notifications' },
  { label: 'Settings', path: '/settings' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <header className="sticky top-0 z-20 border-b border-[#334155] bg-[#0F172A]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#06B6D4]">TeamConnect</p>
            <h1 className="text-2xl font-semibold tracking-tight">Enterprise Admin Console</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#94A3B8]">Secure collaboration, intelligent analytics, and realtime presence for global teams.</p>
          </div>
          <div className="grid gap-2 rounded-3xl border border-[#334155] bg-[#1E293B]/90 p-4 text-sm text-[#CBD5E1] shadow-xl shadow-[#06B6D4]/10 lg:items-end">
            <span className="font-medium text-[#F8FAFC]">Enterprise</span>
            <span>Uptime 99.99%</span>
            <span>Secure SSO · Role-based access</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row lg:px-6">
        <nav className="hidden w-72 shrink-0 flex-col gap-2 rounded-3xl border border-[#334155] bg-[#1E293B]/80 p-4 lg:flex">
          <p className="text-xs uppercase tracking-[0.32em] text-[#94A3B8]">Navigation</p>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-2xl px-4 py-3 text-sm transition duration-200 ${
                  active
                    ? 'bg-[#06B6D4] text-[#0F172A] shadow-lg shadow-[#06B6D4]/15'
                    : 'text-[#CBD5E1] hover:bg-[#111827] hover:text-[#F8FAFC]'
                }`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
