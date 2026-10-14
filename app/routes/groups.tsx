import { useEffect, useState } from 'react';
import type { Route } from './+types/groups';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

type Group = {
  _id: string;
  name: string;
  description?: string;
  department?: string;
  isPrivate?: boolean;
  members: Array<{ fullName: string; isOnline?: boolean }>;
};

export function meta({}: Route.MetaArgs) {
  return [{ title: 'TeamConnect | Groups' }];
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', department: '', isPrivate: false });

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    try {
      setLoading(true);
      const data = await apiGet<{ groups: Group[] }>('/groups');
      setGroups(data.groups);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load groups');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (group?: Group) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name,
        description: group.description || '',
        department: group.department || '',
        isPrivate: group.isPrivate || false,
      });
    } else {
      setEditingGroup(null);
      setFormData({ name: '', description: '', department: '', isPrivate: false });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        await apiPut(`/groups/${editingGroup._id}`, formData);
      } else {
        await apiPost('/groups/create', formData);
      }
      handleCloseModal();
      loadGroups();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    try {
      await apiDelete(`/groups/${id}`);
      loadGroups();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">Group Management</h2>
          <p className="mt-2 text-slate-400">Create and manage department groups, project teams, and customer collaboration channels.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
        >
          Add Group
        </button>
      </div>

      {loading ? (
        <p className="text-slate-300">Loading groups...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : groups.length === 0 ? (
        <p className="text-slate-400">No groups available.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {groups.map((group) => {
            const onlineCount = group.members.filter((member) => member.isOnline).length;
            return (
              <div key={group._id} className="relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950/80 p-6 transition-colors hover:border-slate-700">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-slate-100">{group.name}</h3>
                    <div className="flex space-x-2">
                      <button onClick={() => handleOpenModal(group)} className="text-slate-400 hover:text-emerald-400">Edit</button>
                      <button onClick={() => handleDelete(group._id)} className="text-slate-400 hover:text-red-400">Delete</button>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-400">{group.members.length} Members • {onlineCount} Online</p>
                  <p className="mt-3 text-sm leading-6 text-slate-500 line-clamp-3">{group.description || 'No description provided.'}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-300">
                  <span className="rounded-full bg-slate-900/70 px-3 py-1.5 border border-slate-800">
                    {group.isPrivate ? '🔒 Private' : '🌐 Public'}
                  </span>
                  {group.department && (
                    <span className="rounded-full bg-slate-900/70 px-3 py-1.5 border border-slate-800">
                      {group.department}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">{editingGroup ? 'Edit Group' : 'Add Group'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Group Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none" />
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <input type="checkbox" id="isPrivate" checked={formData.isPrivate} onChange={e => setFormData({...formData, isPrivate: e.target.checked})} className="h-5 w-5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900" />
                <label htmlFor="isPrivate" className="text-sm font-medium text-slate-400">Private Group</label>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleCloseModal} className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200">Cancel</button>
                <button type="submit" className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">{editingGroup ? 'Save Changes' : 'Create Group'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
