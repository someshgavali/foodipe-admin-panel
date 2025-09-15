import React, { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, MapPin, Phone } from "lucide-react";
import { Canteen } from "../data/mockData";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  getAllCanteens,
  getAllCanteensAlternative,
  getAllCanteensWithQuery,
  createCanteen,
} from "../api/adminApi/canteen";
import { toast } from "react-toastify";

const CanteenForm: React.FC<{
  onSubmit: (e: React.FormEvent) => void;
  isEdit?: boolean;
  formData: {
    name: string;
    location: string;
    manager: string;
    phone: string;
    password: string;
    slug: string;
    status: "active" | "inactive";
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      location: string;
      manager: string;
      phone: string;
      password: string;
      slug: string;
      status: "active" | "inactive";
    }>
  >;
  setIsAddModalOpen: (open: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;
  resetForm: () => void;
  setSelectedCanteen: (canteen: Canteen | null) => void;
  isSubmitting?: boolean;
}> = ({
  onSubmit,
  isEdit,
  formData,
  setFormData,
  setIsAddModalOpen,
  setIsEditModalOpen,
  resetForm,
  setSelectedCanteen,
  isSubmitting = false,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Canteen Name
      </label>
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Manager Email
        </label>
        <input
          type="email"
          required
          value={formData.manager}
          onChange={(e) =>
            setFormData({ ...formData, manager: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="manager@company.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter password"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug
        </label>
        <input
          type="text"
          required
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="canteen-slug"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Status
      </label>
      <select
        value={formData.status}
        onChange={(e) =>
          setFormData({
            ...formData,
            status: e.target.value as "active" | "inactive",
          })
        }
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
        disabled={isSubmitting}
        className={`px-4 py-2 rounded-lg transition-colors ${
          isSubmitting
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{isEdit ? "Updating..." : "Creating..."}</span>
          </div>
        ) : (
          `${isEdit ? "Update" : "Add"} Canteen`
        )}
      </button>
    </div>
  </form>
);

const Canteens: React.FC = () => {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    manager: "",
    phone: "",
    password: "",
    slug: "",
    status: "active" as "active" | "inactive",
  });

  // Helper function to map API response to component format
  const mapApiCanteenToComponent = (apiCanteen: any) => ({
    id: apiCanteen.canteenid?.toString() || Date.now().toString(),
    name: apiCanteen.canteen_name || "Unnamed Canteen",
    location: apiCanteen.address || "No location",
    manager: apiCanteen.email || "No manager",
    phone: "No phone", // API doesn't have phone field
    status: "active" as "active" | "inactive", // Default to active
    createdAt: apiCanteen.createddate
      ? new Date(apiCanteen.createddate).toISOString().split("T")[0]
      : "Unknown",
  });

  const filteredCanteens = canteens.filter((canteen) => {
    // First check if canteen has required properties
    if (!canteen || typeof canteen !== "object") {
      return false;
    }

    // Then apply search filter
    return (
      (canteen.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (canteen.location?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (canteen.manager?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  });

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      manager: "",
      phone: "",
      password: "",
      slug: "",
      status: "active",
    });
  };

  const handleAddCanteen = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        canteen_name: formData.name,
        email: formData.manager,
        password: formData.password,
        address: formData.location,
        slug: formData.slug,
        roleid: "4",
      };
      const response = await createCanteen(payload);
      const newCanteen: Canteen = {
        id: response.canteenid?.toString() || Date.now().toString(),
        name: formData.name,
        location: formData.location,
        manager: formData.manager,
        phone: formData.phone,
        status: formData.status,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setCanteens([...canteens, newCanteen]);
      setIsAddModalOpen(false);
      resetForm();

      toast.success("Canteen created successfully!");
    } catch (error) {
      console.error("Error creating canteen:", error);
      toast.error("Failed to create canteen. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCanteen = (canteen: Canteen) => {
    setSelectedCanteen(canteen);
    setFormData({
      name: canteen.name,
      location: canteen.location,
      manager: canteen.manager,
      phone: canteen.phone,
      password: "",
      slug: "",
      status: canteen.status,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCanteen = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCanteen) {
      setCanteens(
        canteens.map((canteen) =>
          canteen.id === selectedCanteen.id
            ? { ...canteen, ...formData }
            : canteen
        )
      );
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
      setCanteens(
        canteens.filter((canteen) => canteen.id !== selectedCanteen.id)
      );
      setSelectedCanteen(null);
    }
  };

  useEffect(() => {
    const fetchCanteens = async () => {
      setIsLoading(true);
      try {
        const response = await getAllCanteens({
          start: "0",
          limit: "10",
          search: "",
        });

        if (response && response.data && Array.isArray(response.data)) {
          const mappedCanteens = response.data.map(mapApiCanteenToComponent);
          setCanteens(mappedCanteens);
        } else if (response && Array.isArray(response)) {
          const mappedCanteens = response.map(mapApiCanteenToComponent);
          setCanteens(mappedCanteens);
        } else {
          setCanteens([]);
        }
      } catch (error) {
        try {
          const altResponse = await getAllCanteensAlternative();
          if (
            altResponse &&
            altResponse.data &&
            Array.isArray(altResponse.data)
          ) {
            const mappedCanteens = altResponse.data.map(
              mapApiCanteenToComponent
            );
            setCanteens(mappedCanteens);
          } else if (altResponse && Array.isArray(altResponse)) {
            const mappedCanteens = altResponse.map(mapApiCanteenToComponent);
            setCanteens(mappedCanteens);
          } else {
            console.log("No valid canteen data in alternative response");
          }
        } catch (altError) {
          console.error("Alternative endpoint also failed:", altError);
          try {
            console.log("Trying with query parameters...");
            const queryResponse = await getAllCanteensWithQuery({
              start: "0",
              limit: "10",
              search: "",
            });
            console.log("Query API response:", queryResponse);
            if (
              queryResponse &&
              queryResponse.data &&
              Array.isArray(queryResponse.data)
            ) {
              console.log(
                "Setting canteens from query response.data:",
                queryResponse.data
              );
              const mappedCanteens = queryResponse.data.map(
                mapApiCanteenToComponent
              );
              setCanteens(mappedCanteens);
            } else if (queryResponse && Array.isArray(queryResponse)) {
              console.log(
                "Setting canteens from direct query response:",
                queryResponse
              );
              const mappedCanteens = queryResponse.map(
                mapApiCanteenToComponent
              );
              setCanteens(mappedCanteens);
            } else {
              console.log("No valid canteen data in query response");
            }
          } catch (queryError) {
            console.error("All endpoints failed:", queryError);
            // Set empty array if all endpoints fail
            setCanteens([]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Canteens</h1>
          <p className="text-gray-600 mt-1">
            Manage canteen locations and details
          </p>
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
            placeholder="Search canteens by name, location, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading canteens...</span>
        </div>
      )}

      {/* Canteens Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCanteens.map((canteen, index) => (
            <div
              key={canteen.id || `canteen-${index}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {canteen.name || "Unnamed Canteen"}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {canteen.location || "No location"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">
                        {canteen.phone || "No phone"}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    (canteen.status || "active") === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {canteen.status || "active"}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span>{" "}
                  {canteen.manager || "No email"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {canteen.createdAt || "Unknown"}
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
      )}

      {!isLoading && filteredCanteens.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm
              ? "No canteens found matching your search."
              : "No canteens available. Add your first canteen to get started."}
          </p>
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
        <CanteenForm
          onSubmit={handleAddCanteen}
          formData={formData}
          setFormData={setFormData}
          setIsAddModalOpen={setIsAddModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          resetForm={resetForm}
          setSelectedCanteen={setSelectedCanteen}
          isSubmitting={isSubmitting}
        />
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
        <CanteenForm
          onSubmit={handleUpdateCanteen}
          isEdit={true}
          formData={formData}
          setFormData={setFormData}
          setIsAddModalOpen={setIsAddModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          resetForm={resetForm}
          setSelectedCanteen={setSelectedCanteen}
        />
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
