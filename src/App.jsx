import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import MedicineForm from './components/MedicineForm';
import StockList from './components/StockList';
import MedicineService from './services/MedicineService';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [medicines, setMedicines] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadMedicines();
  }, [refreshKey]);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const response = await MedicineService.getAllMedicines();
      setMedicines(response.data || []);
    } catch (err) {
      console.error('Failed to fetch medicines', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (medicine) => setEditingMedicine(medicine);

  const handleFormSuccess = () => {
    setEditingMedicine(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancel = () => setEditingMedicine(null);

  return (
    <div className="min-h-screen">
      {/* Premium Gradient Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 text-white py-8 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-poppins font-bold tracking-tight">Medical Stock Management</h1>
          <p className="text-indigo-100 mt-2 font-inter">Premium Dashboard for Inventory Control</p>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Left: Glassmorphism Entry Form (4 cols) */}
          <aside className="col-span-12 lg:col-span-4">
            <MedicineForm
              editingMedicine={editingMedicine}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </aside>

          {/* Right: Stock List (8 cols) */}
          <main className="col-span-12 lg:col-span-8">
            <StockList
              medicines={medicines}
              loading={loading}
              onEdit={handleEdit}
              onRefresh={() => setRefreshKey((prev) => prev + 1)}
            />
          </main>
        </div>
      </div>

      <ToastContainer position="top-right" theme="light" autoClose={2000} hideProgressBar />
    </div>
  );
}

export default App;
