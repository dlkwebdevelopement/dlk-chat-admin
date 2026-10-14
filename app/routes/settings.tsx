import { useEffect, useState } from 'react';
import type { Route } from './+types/settings';
import { apiGet } from '../utils/api';

type StatusResponse = {
  status: string;
  message: string;
  timestamp: string;
};

export function meta({}: Route.MetaArgs) {
  return [{ title: 'TeamConnect | Settings' }];
}

export default function Settings() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      try {
        const data = await apiGet<StatusResponse>('/status');
        if (active) {
          setStatus(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load settings status');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStatus();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-2xl font-semibold text-slate-100">Settings</h2>
        <p className="mt-2 text-slate-400">Configure TeamConnect enterprise controls, security, and platform settings.</p>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-400">Loading backend status…</div>
        ) : status ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Backend status</p>
            <p className="mt-4 text-3xl font-semibold text-slate-100">{status.status}</p>
            <p className="mt-2 text-sm text-slate-400">{status.message}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">Updated {new Date(status.timestamp).toLocaleString()}</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-400">No backend status available.</div>
        )}
      </div>
    </section>
  );
}
