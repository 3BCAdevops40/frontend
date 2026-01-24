import React, { useMemo, useState } from 'react';
import { Pencil, Trash, Search, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import MedicineService from '../services/MedicineService';

const StockList = ({ medicines, loading, onEdit, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = useMemo(() => {
    if (!searchTerm) return medicines;
    return medicines.filter((med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [medicines, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await MedicineService.deleteMedicine(id);
        toast.success('🗑️ Medicine deleted');
        onRefresh();
      } catch (err) {
        toast.error('Failed to delete');
        console.error(err);
      }
    }
  };

  const isNearExpiry = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isLowStock = (quantity) => Number(quantity) < 10;

  const skeletonRows = Array(5)
    .fill(0)
    .map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-8"></div></td>
        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
      </tr>
    ));

  return (
    <div className="bg-white rounded-2xl shadow-2xl glow-shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-5 border-b border-indigo-100">
        <h3 className="text-2xl font-poppins font-bold text-indigo-900">📦 Current Inventory</h3>
        <p className="text-sm text-slate-600 mt-1 font-inter">Real-time stock monitoring</p>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          {searchTerm && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
              {filteredMedicines.length} result{filteredMedicines.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b-2 border-slate-200">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">ID</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Medicine</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Arrival</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Expiry</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && skeletonRows}
            
            {!loading && filteredMedicines.length === 0 && medicines.length > 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500 italic">
                  No matches for "{searchTerm}"
                </td>
              </tr>
            )}
            
            {!loading && filteredMedicines.length === 0 && medicines.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500 italic">
                  No medicines yet. Add one from the form.
                </td>
              </tr>
            )}
            
            {!loading && filteredMedicines.length > 0 &&
              filteredMedicines.map((medicine) => (
                <tr 
                  key={medicine.id} 
                  className="hover:bg-indigo-50 transition-colors"
                >
                  <td className="px-4 py-4 text-sm text-slate-600">{medicine.id}</td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-slate-900">{medicine.name}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{medicine.arrivalDate || '—'}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">{medicine.expiryDate || '—'}</span>
                      {isNearExpiry(medicine.expiryDate) && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                          <AlertCircle size={12} /> Near Expiry
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span 
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        isLowStock(medicine.quantity) 
                          ? 'bg-red-100 text-red-700 shadow-lg shadow-red-200' 
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {medicine.quantity}
                      {isLowStock(medicine.quantity) && ' ⚠️'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(medicine)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover-grow transition-all"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(medicine.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover-grow transition-all"
                        title="Delete"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockList;
