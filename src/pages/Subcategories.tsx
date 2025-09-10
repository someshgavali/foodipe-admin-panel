import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, FolderOpen, Folder } from 'lucide-react';
import { Subcategory, mockSubcategories, mockCategories } from '../data/mockData';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const Subcategories: React.FC = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>(mockSubcategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    status: 'active' as 'active' | 'inactive'
  });

  const filteredSubcategories = subcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      status: 'active'
    });
  };

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    const category = mockCategories.find(c => c.id === formData.categoryId);
    
    const newSubcategory: Subcategory = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      categoryName: category?.name || '',
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSubcategories([...subcategories, newSubcategory]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      description: subcategory.description,
      categoryId: subcategory.categoryId,
      status: subcategory.status
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubcategory) {
      const category = mockCategories.find(c => c.id === formData.categoryId);
      
      setSubcategories(subcategories.map(subcategory => 
        subcategory.id === selectedSubcategory.id 
          ? { 
              ...subcategory, 
              name: formData.name,
              description: formData.description,
              categoryId: formData.categoryId,
              categoryName: category?.name || '',
              status: formData.status
            }
          : subcategory
      ));
      setIsEditModalOpen(false);
      resetForm();
      setSelectedSubcategory(null);
    }
  };

  const handleDeleteSubcategory = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSubcategory = () => {
    if (selectedSubcategory) {
      setSubcategories(subcategories.filter(subcategory => subcategory.id !== selectedSubcategory.id));
      setSelectedSubcategory(null);
    }
  };

  const SubcategoryForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter subcategory name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter subcategory description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
        <select
          required
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {mockCategories
            .filter(category => category.status === 'active')
            .map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          }
        </select>
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
            setSelectedSubcategory(null);
          }}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEdit ? 'Update' : 'Add'} Subcategory
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subcategories</h1>
          <p className="text-gray-600 mt-1">Organize menu items with detailed subcategories</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Subcategory</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubcategories.map((subcategory) => (
          <div key={subcategory.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subcategory.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    subcategory.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subcategory.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{subcategory.description}</p>

            <div className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Folder className="w-4 h-4" />
                <span>Parent: {subcategory.categoryName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Created: {subcategory.createdAt}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditSubcategory(subcategory)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSubcategory(subcategory)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSubcategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No subcategories found matching your search.</p>
        </div>
      )}

      {/* Add Subcategory Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Subcategory"
      >
        <SubcategoryForm onSubmit={handleAddSubcategory} />
      </Modal>

      {/* Edit Subcategory Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
          setSelectedSubcategory(null);
        }}
        title="Edit Subcategory"
      >
        <SubcategoryForm onSubmit={handleUpdateSubcategory} isEdit={true} />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteSubcategory}
        title="Delete Subcategory"
        message={`Are you sure you want to delete ${selectedSubcategory?.name}? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default Subcategories;