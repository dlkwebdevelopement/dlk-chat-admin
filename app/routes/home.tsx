import { useEffect, useMemo, useState } from 'react';
import type { Route } from './+types/home';
import { apiGet } from '../utils/api';

type Employee = {
  _id: string;
  isOnline?: boolean;
  activeCallId?: string;
};

type Meeting = {
  _id: string;
  status?: string;
};

type Group = {
  _id: string;
};

type Customer = {
  _id: string;
};

export function meta({}: Route.MetaArgs) {
  return [{ title: 'TeamConnect | Dashboard' }];
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMetrics() {
      try {
        const [employeesRes, customersRes, groupsRes, meetingsRes] = await Promise.all([
          apiGet<{ employees: Employee[] }>('/employees'),
          apiGet<{ customers: Customer[] }>('/customers'),
          apiGet<{ groups: Group[] }>('/groups'),
          apiGet<{ meetings: Meeting[] }>('/meetings'),
        ]);

        if (!active) return;

        setEmployees(employeesRes.employees);
        setCustomers(customersRes.customers);
        setGroups(groupsRes.groups);
        setMeetings(meetingsRes.meetings);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load dashboard metrics');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMetrics();
    return () => {
      active = false;
    };
  }, []);

  const onlineEmployees = useMemo(
    () => employees.filter((employee) => employee.isOnline).length,
    [employees],
  );
  const activeCalls = useMemo(
    () => employees.filter((employee) => Boolean(employee.activeCallId)).length,
    [employees],
  );
  const liveMeetings = useMemo(
    () => meetings.filter((meeting) => meeting.status === 'live').length,
    [meetings],
  );

  const stats = [
    { title: 'Total Employees', value: loading ? 'Loading…' : employees.length.toString(), accent: 'text-[#06B6D4]' },
    { title: 'Total Customers', value: loading ? 'Loading…' : customers.length.toString(), accent: 'text-[#4F46E5]' },
    { title: 'Live Meetings', value: loading ? 'Loading…' : liveMeetings.toString(), accent: 'text-[#2563EB]' },
    { title: 'Active Groups', value: loading ? 'Loading…' : groups.length.toString(), accent: 'text-[#22C55E]' },
  ];

  const activity = [
    { label: 'Online employees', value: loading ? 'Loading…' : `${onlineEmployees}`, color: 'bg-[#2563EB]' },
    { label: 'Active calls', value: loading ? 'Loading…' : `${activeCalls}`, color: 'bg-[#4F46E5]' },
    { label: 'Live meetings', value: loading ? 'Loading…' : `${liveMeetings}`, color: 'bg-[#06B6D4]' },
    { label: 'Active groups', value: loading ? 'Loading…' : `${groups.length}`, color: 'bg-[#EF4444]' },
  ];

  const widgets = [
    { label: 'Active meetings', value: loading ? 'Loading…' : `${liveMeetings}`, icon: '📅', tone: '#4F46E5' },
    { label: 'Active calls', value: loading ? 'Loading…' : `${activeCalls}`, icon: '🎧', tone: '#2563EB' },
    { label: 'Online users', value: loading ? 'Loading…' : `${onlineEmployees}`, icon: '🟢', tone: '#22C55E' },
    { label: 'Active groups', value: loading ? 'Loading…' : `${groups.length}`, icon: '⚪', tone: '#64748B' },
  ];

  return (
    <section className="space-y-8">
      <header className="rounded-[24px] border border-[#334155] bg-[#1E293B]/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#06B6D4]">TeamConnect dashboard</p>
            <h2 className="mt-3 text-4xl font-semibold text-[#F8FAFC]">Premium enterprise collaboration suite</h2>
            <p className="mt-4 max-w-3xl text-sm text-[#94A3B8]">Monitor employees, customers, online status, meetings, and secure communication across every department with rich analytics and realtime controls.</p>
            {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
          </div>
          <div className="grid gap-3 rounded-[24px] border border-[#334155] bg-[#0F172A]/90 p-5 shadow-lg shadow-cyan-500/10">
            <span className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">Realtime score</span>
            <span className="text-3xl font-semibold text-[#F8FAFC]">8.9 / 10</span>
            <span className="text-sm text-[#94A3B8]">Secure voice, chat, meetings, and audit-ready reporting.</span>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-4">
        {stats.map((item) => (
          <article key={item.title} className="rounded-[24px] border border-[#334155] bg-[#1E293B]/90 p-6 shadow-sm shadow-[#0F172A]/50">
            <p className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">{item.title}</p>
            <p className={`mt-5 text-4xl font-semibold ${item.accent}`}>{item.value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[24px] border border-[#334155] bg-[#0F172A]/90 p-6 shadow-[#06B6D4]/10 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">Realtime analytics</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#F8FAFC]">Presence & communication</h3>
            </div>
            <span className="rounded-full bg-[#06B6D4]/15 px-4 py-2 text-sm font-semibold text-[#06B6D4]">Enterprise</span>
          </div>

          <div className="mt-8 grid gap-3">
            {activity.map((item) => (
              <div key={item.label} className="rounded-3xl border border-[#334155] bg-[#111827]/90 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-[#94A3B8]">{item.label}</p>
                    <p className="mt-2 text-xl font-semibold text-[#F8FAFC]">{item.value}</p>
                  </div>
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${item.color} text-[#0F172A]`}>•</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#334155] bg-[#1E293B]/90 p-6 shadow-[#2563EB]/10 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">Collaboration pulse</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#F8FAFC]">Team engagement</h3>
            </div>
            <div className="rounded-3xl bg-[#111827] px-4 py-2 text-sm text-[#94A3B8]">Live</div>
          </div>

          <div className="mt-7 grid gap-4">
            {widgets.map((item) => (
              <div key={item.label} className="rounded-3xl border border-[#334155] bg-[#0F172A]/90 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#94A3B8]">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-[#F8FAFC]">{item.value}</p>
                  </div>
                  <span className="text-3xl" style={{ color: item.tone }}>{item.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[24px] border border-[#334155] bg-[#111827]/90 p-6 shadow-xl shadow-slate-950/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-[#F8FAFC]">Enterprise status board</h3>
            <p className="mt-2 text-sm text-[#94A3B8]">Monitor active calls, meeting load, and platform health at a glance.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-3xl bg-[#0F172A]/80 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-[#94A3B8]">Online</p>
              <p className="mt-2 text-2xl font-semibold text-[#22C55E]">{loading ? '…' : onlineEmployees}</p>
            </div>
            <div className="rounded-3xl bg-[#0F172A]/80 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-[#94A3B8]">Busy</p>
              <p className="mt-2 text-2xl font-semibold text-[#EF4444]">{loading ? '…' : activeCalls}</p>
            </div>
            <div className="rounded-3xl bg-[#0F172A]/80 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-[#94A3B8]">Meeting</p>
              <p className="mt-2 text-2xl font-semibold text-[#8B5CF6]">{loading ? '…' : liveMeetings}</p>
            </div>
            <div className="rounded-3xl bg-[#0F172A]/80 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-[#94A3B8]">Groups</p>
              <p className="mt-2 text-2xl font-semibold text-[#2563EB]">{loading ? '…' : groups.length}</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
