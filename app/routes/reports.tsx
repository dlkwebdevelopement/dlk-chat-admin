import { useEffect, useState } from 'react';
import type { Route } from './+types/reports';
import { apiGet } from '../utils/api';

type ReportMetrics = {
  title: string;
  value: string;
};

type Employee = { _id: string };
type Customer = { _id: string };
type Group = { _id: string };
type Meeting = { _id: string; status?: string };

export function meta({}: Route.MetaArgs) {
  return [{ title: 'TeamConnect | Reports' }];
}

export default function Reports() {
  const [reports, setReports] = useState<ReportMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadReports() {
      try {
        const [employeesRes, customersRes, groupsRes, meetingsRes] = await Promise.all([
          apiGet<{ employees: Employee[] }>('/employees'),
          apiGet<{ customers: Customer[] }>('/customers'),
          apiGet<{ groups: Group[] }>('/groups'),
          apiGet<{ meetings: Meeting[] }>('/meetings'),
        ]);

        if (!active) return;

        const liveMeetings = meetingsRes.meetings.filter((meeting) => meeting.status === 'live').length;
        const reportItems: ReportMetrics[] = [
          { title: 'Total customers', value: `${customersRes.customers.length}` },
          { title: 'Total employees', value: `${employeesRes.employees.length}` },
          { title: 'Active groups', value: `${groupsRes.groups.length}` },
          { title: 'Live meetings', value: `${liveMeetings}` },
        ];

        setReports(reportItems);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load reports');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReports();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-2xl font-semibold text-slate-100">Reports</h2>
        <p className="mt-2 text-slate-400">Review backend-driven analytics for customers, employees, meetings, and groups.</p>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-400">Loading reports…</div>
        ) : reports.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-400">No report data available.</div>
        ) : (
          reports.map((report) => (
            <div key={report.title} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">{report.title}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-100">{report.value}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
