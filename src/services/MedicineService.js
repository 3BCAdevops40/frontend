import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/medicines';

const MedicineService = {
  // Get all medicines
  getAllMedicines: () => {
    return axios.get(API_BASE_URL);
  },

  // Get medicine by ID
  getMedicineById: (id) => {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  // Create new medicine
  createMedicine: (medicine) => {
    return axios.post(API_BASE_URL, medicine);
  },

  // Update medicine
  updateMedicine: (id, medicine) => {
    return axios.put(`${API_BASE_URL}/${id}`, medicine);
  },

  // Delete medicine
  deleteMedicine: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  },
};

export default MedicineService;
