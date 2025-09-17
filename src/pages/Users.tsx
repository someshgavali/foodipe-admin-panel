import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { User, mockUsers } from '../data/mockData';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { getAllUsers } from '../api/adminApi/admin';
import { createUser, getAllUsersByCompanyId, updateUserProfile } from '../api/adminApi/user';

const Users: React.FC = () => {
  // const [users, setUsers] = useState<User[]>(mockUsers);
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   role: 'Customer',
  //   status: 'active' as 'active' | 'inactive'
  // });
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   phonenumber: "",
  //   empid: "",
  //   address: "",
  //   walletBalance: "",
  //   company_name: "" // read-only, coming from Company
  // });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phonenumber: "",
    empid: "",
    companyid: "",
    address: "",
  });

  const filteredUsers = users.filter(user =>
    (user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  // const filteredUsers = users.filter(user =>
  //   user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   user.email.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    start: "0",
    limit: "10",
    search: "",
  });




  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getAllUsersByCompanyId();
        setUsers(data); // assuming API returns an array of users
      } catch (err: any) {
        setError(err.message || "Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);



  // 3. Handle edit button click
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phonenumber: user.phonenumber,
      empid: user.empid,
      address: user.address,
      walletBalance: user.walletBalance,
      company_name: user.Company.company_name
    });
    setIsEditModalOpen(true);
  };

  // 4. Handle update (later we’ll plug in API)
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      try {
        await updateUserProfile(selectedUser.userId, {
          name: formData.name,
          phonenumber: formData.phonenumber,
          address: formData.address,
        });

        // update state locally so UI refreshes without reload
        setUsers(users.map(u =>
          u.userId === selectedUser.userId
            ? { ...u, ...formData }
            : u
        ));

        setIsEditModalOpen(false);
        setSelectedUser(null);
      } catch (err) {
        console.error("Update failed:", err);
      }
    }
  };


  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     setIsLoading(true);
  //     setError(null);

  //     try {
  //       const response = await getAllUsers({
  //         start: pagination.start,
  //         limit: pagination.limit,
  //         search: pagination.search,
  //         // Add other parameters as needed
  //       });

  //       if (response && response.data && Array.isArray(response.data)) {
  //         setUsers(response.data);
  //       } else if (Array.isArray(response)) {
  //         setUsers(response);
  //       } else {
  //         console.error("Unexpected API response structure:", response);
  //         setError("Unexpected response format from server");
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch users:", err);
  //       setError("Failed to load users. Please try again.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchUsers();
  // }, [pagination.start, pagination.limit, pagination.search]); // Re-run when pagination changes

  // Function to handle pagination changes
  const handlePageChange = (newStart: string) => {
    setPagination(prev => ({ ...prev, start: newStart }));
  };
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Customer',
      status: 'active'
    });
  };

  // const handleAddUser = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const newUser: User = {
  //     id: Date.now().toString(),
  //     ...formData,
  //     createdAt: new Date().toISOString().split('T')[0]
  //   };
  //   setUsers([...users, newUser]);
  //   setIsAddModalOpen(false);
  //   resetForm();
  // };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // submit form and call API
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      setMessage("✅ User created successfully!");
      console.log("Created user:", response);
    } catch (err) {
      setMessage("❌ Failed to create user");
      console.error(err);
    }
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">User</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Role</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Created At</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.createdAt}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New User"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const newUser = await createUser(formData); // call API
              setUsers([...users, newUser]); // update UI
              setIsAddModalOpen(false);
              resetForm();
            } catch (err) {
              console.error("Failed to add user:", err);
            }
          }}
          className="space-y-4"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              required
              value={formData.phonenumber}
              onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
            <input
              type="text"
              required
              value={formData.empid}
              onChange={(e) => setFormData({ ...formData, empid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Company ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company ID</label>
            <input
              type="text"
              required
              value={formData.companyid}
              onChange={(e) => setFormData({ ...formData, companyid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add User
            </button>
          </div>
        </form>
      </Modal>


      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg  cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              value={formData.phonenumber}
              onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
            <input
              type="text"
              value={formData.empid}
              onChange={(e) => setFormData({ ...formData, empid: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg  cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Balance</label>
            <input
              type="text"
              value={formData.walletBalance}
              onChange={(e) => setFormData({ ...formData, walletBalance: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg  cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={formData.company_name}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100  cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedUser(null);
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Update User
            </button>
          </div>
        </form>
      </Modal>


      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default Users;