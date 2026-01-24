import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MedicineService from '../services/MedicineService';

const MedicineForm = ({ editingMedicine, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    arrivalDate: '',
    expiryDate: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingMedicine) {
      setFormData({
        name: editingMedicine.name || '',
        arrivalDate: editingMedicine.arrivalDate || '',
        expiryDate: editingMedicine.expiryDate || '',
        quantity: editingMedicine.quantity ?? '',
      });
    } else {
      resetForm();
    }
    setError(null);
  }, [editingMedicine]);

  const resetForm = () => {
    setFormData({ name: '', arrivalDate: '', expiryDate: '', quantity: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.arrivalDate || !formData.expiryDate || formData.quantity === '') {
      setError('All fields are required.');
      return;
    }
    if (Number(formData.quantity) < 0) {
      setError('Quantity cannot be negative.');
      return;
    }

    try {
      setLoading(true);
      if (editingMedicine) {
        await MedicineService.updateMedicine(editingMedicine.id, formData);
        toast.success('✅ Medicine updated successfully!');
      } else {
        await MedicineService.createMedicine(formData);
        toast.success('✅ Medicine added successfully!');
      }
      onSuccess();
      resetForm();
    } catch (err) {
      setError('Failed to save medicine: ' + err.message);
      toast.error('❌ Failed to save medicine');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glassmorphism rounded-2xl p-8 shadow-xl sticky top-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-poppins font-bold text-indigo-900">
          {editingMedicine ? '📝 Edit Medicine' : '➕ Add Medicine'}
        </h3>
        <p className="text-sm text-slate-600 mt-1 font-inter">Fill in the details below</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Medicine Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
            Medicine Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Paracetamol"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>

        {/* Arrival Date */}
        <div>
          <label htmlFor="arrivalDate" className="block text-sm font-semibold text-slate-700 mb-2">
            Arrival Date
          </label>
          <input
            type="date"
            id="arrivalDate"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-semibold text-slate-700 mb-2">
            Expiry Date
          </label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-semibold text-slate-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g., 100"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          {editingMedicine ? (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-4 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Adding...' : '➕ Add Medicine'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MedicineForm;
