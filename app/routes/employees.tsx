import { useEffect, useState } from 'react';
import type { Route } from './+types/employees';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

type Employee = {
  _id: string;
  fullName: string;
  email?: string;
  employeeId?: string;
  role?: string;
  company?: string;
  department?: string;
  isBlocked?: boolean;
};

export function meta({}: Route.MetaArgs) {
  return [{ title: 'TeamConnect | Employees' }];
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', company: '', department: '' });

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      setLoading(true);
      const data = await apiGet<{ employees: Employee[] }>('/employees');
      setEmployees(data.employees);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load employees');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        fullName: employee.fullName,
        email: employee.email || '',
        password: '', // Password is empty on edit
        company: employee.company || '',
        department: employee.department || ''
      });
    } else {
      setEditingEmployee(null);
      setFormData({ fullName: '', email: '', password: '', company: '', department: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await apiPut(`/employees/${editingEmployee._id}`, formData);
      } else {
        await apiPost('/employees/create', formData);
      }
      handleCloseModal();
      loadEmployees();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await apiDelete(`/employees/${id}`);
      loadEmployees();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleToggleBlock = async (id: string) => {
    try {
      await apiPut(`/employees/${id}/block`);
      loadEmployees();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">Employee Management</h2>
          <p className="mt-2 text-slate-400">Create, edit, block, and manage enterprise employees with role-based access.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
        >
          Add Employee
        </button>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 overflow-x-auto">
        {loading ? (
          <p className="text-slate-300">Loading employees...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead>
              <tr>
                <th className="px-4 py-3 text-slate-400">Name</th>
                <th className="px-4 py-3 text-slate-400">Employee ID</th>
                <th className="px-4 py-3 text-slate-400">Company</th>
                <th className="px-4 py-3 text-slate-400">Status</th>
                <th className="px-4 py-3 text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-slate-400 text-center">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee._id} className="border-t border-slate-800/60">
                    <td className="px-4 py-4 text-slate-100">{employee.fullName}</td>
                    <td className="px-4 py-4">{employee.employeeId || employee._id}</td>
                    <td className="px-4 py-4">{employee.company || '—'}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${employee.isBlocked ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {employee.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-3">
                      <button onClick={() => handleOpenModal(employee)} className="text-cyan-400 hover:text-cyan-300">Edit</button>
                      <button onClick={() => handleToggleBlock(employee._id)} className="text-amber-400 hover:text-amber-300">
                        {employee.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      <button onClick={() => handleDelete(employee._id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{editingEmployee ? 'New Password (optional)' : 'Password'}</label>
                <input required={!editingEmployee} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Company</label>
                <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none" />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleCloseModal} className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200">Cancel</button>
                <button type="submit" className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400">{editingEmployee ? 'Save Changes' : 'Create Employee'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
