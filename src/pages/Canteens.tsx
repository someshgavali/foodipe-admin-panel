import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Phone } from 'lucide-react';
import { Canteen, mockCanteens } from '../data/mockData';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const Canteens: React.FC = () => {
  const [canteens, setCanteens] = useState<Canteen[]>(mockCanteens);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    manager: '',
    phone: '',
    status: 'active' as 'active' | 'inactive'
  });

  const filteredCanteens = canteens.filter(canteen =>
    canteen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    canteen.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    canteen.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      manager: '',
      phone: '',
      status: 'active'
    });
  };

  const handleAddCanteen = (e: React.FormEvent) => {
    e.preventDefault();
    const newCanteen: Canteen = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCanteens([...canteens, newCanteen]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditCanteen = (canteen: Canteen) => {
    setSelectedCanteen(canteen);
    setFormData({
      name: canteen.name,
      location: canteen.location,
      manager: canteen.manager,
      phone: canteen.phone,
      status: canteen.status
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCanteen = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCanteen) {
      setCanteens(canteens.map(canteen => 
        canteen.id === selectedCanteen.id 
          ? { ...canteen, ...formData }
          : canteen
      ));
      setIsEditModalOpen(false);
      resetForm();
      setSelectedCanteen(null);
    }
  };

  const handleDeleteCanteen = (canteen: Canteen) => {
    setSelectedCanteen(canteen);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCanteen = () => {
    if (selectedCanteen) {
      setCanteens(canteens.filter(canteen => canteen.id !== selectedCanteen.id));
      setSelectedCanteen(null);
    }
  };

  const CanteenForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Canteen Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter canteen name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <input
          type="text"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter location"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Manager Name</label>
          <input
            type="text"
            required
            value={formData.manager}
            onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter manager name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1-234-567-8900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            if (isEdit) {
              setIsEditModalOpen(false);
            } else {
              setIsAddModalOpen(false);
            }
            resetForm();
            setSelectedCanteen(null);
          }}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEdit ? 'Update' : 'Add'} Canteen
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Canteens</h1>
          <p className="text-gray-600 mt-1">Manage canteen locations and details</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Canteen</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search canteens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Canteens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCanteens.map((canteen) => (
          <div key={canteen.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{canteen.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{canteen.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{canteen.phone}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                canteen.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {canteen.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Manager:</span> {canteen.manager}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Created: {canteen.createdAt}
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEditCanteen(canteen)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteCanteen(canteen)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCanteens.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No canteens found matching your search.</p>
        </div>
      )}

      {/* Add Canteen Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Canteen"
      >
        <CanteenForm onSubmit={handleAddCanteen} />
      </Modal>

      {/* Edit Canteen Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
          setSelectedCanteen(null);
        }}
        title="Edit Canteen"
      >
        <CanteenForm onSubmit={handleUpdateCanteen} isEdit={true} />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteCanteen}
        title="Delete Canteen"
        message={`Are you sure you want to delete ${selectedCanteen?.name}? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default Canteens;