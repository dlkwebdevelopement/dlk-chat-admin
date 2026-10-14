import { useEffect, useState } from 'react';
import type { Route } from './+types/customers';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

type Customer = {
  _id: string;
  fullName: string;
  email?: string;
  company?: string;
  customerId?: string;
  isBlocked?: boolean;
};

export function meta({}: Route.MetaArgs) {
  return [{ title: 'TeamConnect | Customers' }];
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', company: '' });

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      const data = await apiGet<{ customers: Customer[] }>('/customers');
      setCustomers(data.customers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load customers');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        fullName: customer.fullName,
        email: customer.email || '',
        password: '', // Password empty on edit
        company: customer.company || '',
      });
    } else {
      setEditingCustomer(null);
      setFormData({ fullName: '', email: '', password: '', company: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await apiPut(`/customers/${editingCustomer._id}`, formData);
      } else {
        await apiPost('/customers/create', formData);
      }
      handleCloseModal();
      loadCustomers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await apiDelete(`/customers/${id}`);
      loadCustomers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleToggleBlock = async (id: string) => {
    try {
      await apiPut(`/customers/${id}/block`);
      loadCustomers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">Customer Management</h2>
          <p className="mt-2 text-slate-400">Manage customer accounts, onboarding, support histories, and communication access.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-slate-50 hover:bg-indigo-400 transition-colors"
        >
          Add Customer
        </button>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 overflow-x-auto">
        {loading ? (
          <p className="text-slate-300">Loading customers...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead>
              <tr>
                <th className="px-4 py-3 text-slate-400">Name</th>
                <th className="px-4 py-3 text-slate-400">Company</th>
                <th className="px-4 py-3 text-slate-400">Customer ID</th>
                <th className="px-4 py-3 text-slate-400">Status</th>
                <th className="px-4 py-3 text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-slate-400 text-center">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="border-t border-slate-800/60">
                    <td className="px-4 py-4 text-slate-100">{customer.fullName}</td>
                    <td className="px-4 py-4">{customer.company || '—'}</td>
                    <td className="px-4 py-4">{customer.customerId || customer._id}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${customer.isBlocked ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {customer.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-3">
                      <button onClick={() => handleOpenModal(customer)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                      <button onClick={() => handleToggleBlock(customer._id)} className="text-amber-400 hover:text-amber-300">
                        {customer.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      <button onClick={() => handleDelete(customer._id)} className="text-red-400 hover:text-red-300">Delete</button>
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
            <h3 className="text-xl font-semibold text-slate-100 mb-4">{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{editingCustomer ? 'New Password (optional)' : 'Password'}</label>
                <input required={!editingCustomer} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Company</label>
                <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleCloseModal} className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200">Cancel</button>
                <button type="submit" className="rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-slate-50 hover:bg-indigo-400">{editingCustomer ? 'Save Changes' : 'Create Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
