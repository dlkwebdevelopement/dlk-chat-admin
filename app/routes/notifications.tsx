import { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

export default function NotificationsRoute() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      try {
        const data = await apiGet<{ notifications: NotificationItem[] }>('/notifications');
        if (active) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load notifications');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadNotifications();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-[#334155] bg-[#0B1120]/80 p-10 shadow-[0_40px_120px_rgba(6,182,212,0.08)]">
        <p className="text-sm uppercase tracking-[0.32em] text-[#94A3B8]">System alerts</p>
        <h2 className="mt-4 text-4xl font-semibold text-[#F8FAFC]">Notifications</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#CBD5E1]/90">Stay on top of important platform events, security alerts, and collaboration insights.</p>
        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="rounded-3xl border border-[#334155] bg-[#111827]/90 p-6 text-slate-400">Loading notifications…</div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl border border-[#334155] bg-[#111827]/90 p-6 text-slate-400">No notifications available.</div>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className="rounded-3xl border border-[#334155] bg-[#111827]/90 p-6 transition duration-200 hover:border-[#06B6D4] hover:bg-[#1E293B]/90">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#F8FAFC]">{notification.title}</h3>
                  <p className="mt-2 text-sm text-[#CBD5E1]">{notification.message}</p>
                </div>
                <span className="rounded-full bg-[#0F172A] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#38BDF8]">{new Date(notification.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
