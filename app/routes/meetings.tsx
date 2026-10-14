import { useEffect, useState } from 'react';
import type { Route } from './+types/meetings';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

type Meeting = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  host?: { fullName: string };
  participants?: string[];
  startTime: string;
  endTime: string;
  agenda?: string;
  meetingUrl?: string;
};

export function meta({}: Route.MetaArgs) {
  return [{ title: 'TeamConnect | Meetings' }];
}

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    agenda: '',
    meetingUrl: '',
    status: 'scheduled'
  });

  useEffect(() => {
    loadMeetings();
  }, []);

  async function loadMeetings() {
    try {
      setLoading(true);
      const data = await apiGet<{ meetings: Meeting[] }>('/meetings');
      setMeetings(data.meetings);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load meetings');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (meeting?: Meeting) => {
    if (meeting) {
      setEditingMeeting(meeting);
      // Format dates for datetime-local input
      const formatForInput = (isoString: string) => {
        try {
          return new Date(isoString).toISOString().slice(0, 16);
        } catch {
          return '';
        }
      };
      
      setFormData({
        title: meeting.title,
        description: meeting.description || '',
        startTime: meeting.startTime ? formatForInput(meeting.startTime) : '',
        endTime: meeting.endTime ? formatForInput(meeting.endTime) : '',
        agenda: meeting.agenda || '',
        meetingUrl: meeting.meetingUrl || '',
        status: meeting.status || 'scheduled'
      });
    } else {
      setEditingMeeting(null);
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        agenda: '',
        meetingUrl: '',
        status: 'scheduled'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMeeting(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMeeting) {
        await apiPut(`/meetings/${editingMeeting._id}`, formData);
      } else {
        await apiPost('/meetings/create', formData);
      }
      handleCloseModal();
      loadMeetings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel and delete this meeting?')) return;
    try {
      await apiDelete(`/meetings/${id}`);
      loadMeetings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">Meeting Management</h2>
          <p className="mt-2 text-slate-400">Schedule and review meetings, attendance, and enterprise call logs from a central workspace.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-full bg-violet-500 px-6 py-2.5 text-sm font-semibold text-slate-50 hover:bg-violet-400 transition-colors"
        >
          Schedule Meeting
        </button>
      </div>

      {loading ? (
        <p className="text-slate-300">Loading meetings...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : meetings.length === 0 ? (
        <p className="text-slate-400">No meetings scheduled.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <div key={meeting._id} className="relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950/80 p-6 transition-colors hover:border-slate-700">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-slate-100 pr-2">{meeting.title}</h3>
                  <div className="flex space-x-2 shrink-0">
                    <button onClick={() => handleOpenModal(meeting)} className="text-slate-400 hover:text-violet-400">Edit</button>
                    <button onClick={() => handleDelete(meeting._id)} className="text-slate-400 hover:text-red-400">Delete</button>
                  </div>
                </div>
                <p className="mt-3 text-slate-400">Hosted by {meeting.host?.fullName || 'Unknown host'}</p>
                <p className="mt-2 text-slate-300">{meeting.participants?.length ?? 0} attendees</p>
                <p className="mt-2 text-slate-300">{new Date(meeting.startTime).toLocaleString()}</p>
                {meeting.meetingUrl && (
                  <a href={meeting.meetingUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-violet-400 hover:text-violet-300 text-sm">Join Link</a>
                )}
              </div>
              <div className="mt-4 inline-flex rounded-full bg-slate-900/70 px-3 py-2 text-sm text-slate-300 uppercase tracking-[0.12em] border border-slate-800 self-start">
                {meeting.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl my-8">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">{editingMeeting ? 'Edit Meeting' : 'Schedule Meeting'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Meeting Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-violet-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Start Time</label>
                  <input required type="datetime-local" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-violet-500 focus:outline-none" style={{ colorScheme: 'dark' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">End Time</label>
                  <input required type="datetime-local" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-violet-500 focus:outline-none" style={{ colorScheme: 'dark' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Meeting URL</label>
                <input type="url" value={formData.meetingUrl} onChange={e => setFormData({...formData, meetingUrl: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-violet-500 focus:outline-none" placeholder="https://" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Agenda</label>
                <textarea rows={2} value={formData.agenda} onChange={e => setFormData({...formData, agenda: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-violet-500 focus:outline-none" />
              </div>
              {editingMeeting && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-violet-500 focus:outline-none">
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleCloseModal} className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200">Cancel</button>
                <button type="submit" className="rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-50 hover:bg-violet-400">{editingMeeting ? 'Save Changes' : 'Schedule Meeting'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
