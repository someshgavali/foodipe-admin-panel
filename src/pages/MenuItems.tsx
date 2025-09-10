import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Upload, X } from 'lucide-react';
import { MenuItem, mockMenuItems, mockCategories, mockSubcategories, mockCanteens } from '../data/mockData';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const MenuItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: '',
    subcategoryId: '',
    canteenId: '',
    status: 'active' as 'active' | 'inactive'
  });

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      categoryId: '',
      subcategoryId: '',
      canteenId: '',
      status: 'active'
    });
    setImagePreview('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const category = mockCategories.find(c => c.id === formData.categoryId);
    const subcategory = mockSubcategories.find(s => s.id === formData.subcategoryId);
    const canteen = mockCanteens.find(c => c.id === formData.canteenId);

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
      categoryId: formData.categoryId,
      categoryName: category?.name || '',
      subcategoryId: formData.subcategoryId,
      subcategoryName: subcategory?.name || '',
      canteenId: formData.canteenId,
      canteenName: canteen?.name || '',
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMenuItems([...menuItems, newItem]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image,
      categoryId: item.categoryId,
      subcategoryId: item.subcategoryId,
      canteenId: item.canteenId,
      status: item.status
    });
    setImagePreview(item.image);
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      const category = mockCategories.find(c => c.id === formData.categoryId);
      const subcategory = mockSubcategories.find(s => s.id === formData.subcategoryId);
      const canteen = mockCanteens.find(c => c.id === formData.canteenId);

      setMenuItems(menuItems.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              name: formData.name,
              description: formData.description,
              price: parseFloat(formData.price),
              image: formData.image,
              categoryId: formData.categoryId,
              categoryName: category?.name || '',
              subcategoryId: formData.subcategoryId,
              subcategoryName: subcategory?.name || '',
              canteenId: formData.canteenId,
              canteenName: canteen?.name || '',
              status: formData.status
            }
          : item
      ));
      setIsEditModalOpen(false);
      resetForm();
      setSelectedItem(null);
    }
  };

  const handleDeleteItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteItem = () => {
    if (selectedItem) {
      setMenuItems(menuItems.filter(item => item.id !== selectedItem.id));
      setSelectedItem(null);
    }
  };

  const MenuForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            required
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {mockCategories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
          <select
            required
            value={formData.subcategoryId}
            onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Subcategory</option>
            {mockSubcategories
              .filter(sub => sub.categoryId === formData.categoryId)
              .map(subcategory => (
                <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Canteen</label>
          <select
            required
            value={formData.canteenId}
            onChange={(e) => setFormData({ ...formData, canteenId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Canteen</option>
            {mockCanteens.map(canteen => (
              <option key={canteen.id} value={canteen.id}>{canteen.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview('');
                  setFormData({ ...formData, image: '' });
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
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
            setSelectedItem(null);
          }}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEdit ? 'Update' : 'Add'} Menu Item
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Items</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <span className="text-lg font-bold text-blue-600">${item.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {item.categoryName}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    {item.subcategoryName}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{item.canteenName}</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  item.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEditItem(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No menu items found matching your search.</p>
        </div>
      )}

      {/* Add Menu Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Menu Item"
        size="lg"
      >
        <MenuForm onSubmit={handleAddItem} />
      </Modal>

      {/* Edit Menu Item Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
          setSelectedItem(null);
        }}
        title="Edit Menu Item"
        size="lg"
      >
        <MenuForm onSubmit={handleUpdateItem} isEdit={true} />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteItem}
        title="Delete Menu Item"
        message={`Are you sure you want to delete ${selectedItem?.name}? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default MenuItems;