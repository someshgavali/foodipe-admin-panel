import React, { useEffect, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Subcategory } from "../data/mockData";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  getSubCategoryByCanteenId,
  createSubCategory,
  getAllcategoriesSubTypesByCanteenId,
} from "../api/adminApi/canteen";

const Subcategories: React.FC = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // removed legacy add modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    status: "active" as "active" | "inactive",
  });
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [canteenIdState, setCanteenIdState] = useState<string>("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [subtypeOptions, setSubtypeOptions] = useState<
    Array<{ id: number; itemName: string }>
  >([]);
  // subtype options loading indicator
  const [subtypeLoading, setSubtypeLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    canteenTypeCategoriesid: "",
    itemName: "",
    price: "",
    is_available: true as boolean,
    discription: "",
    subCatImg: "",
    counter_number: "",
  });

  // Static image to display for each menu card (design-only)
  const STATIC_IMAGE_URL =
    "https://images.unsplash.com/photo-1604908554049-8e5f1d5d3f5a?q=80&w=1600&auto=format&fit=crop";

  type ApiSubcategory = {
    id: number;
    canteenTypeCategoriesid: number;
    itemName: string;
    subCatImg?: string | null;
    discription?: string | null;
    counter_number?: number | null;
    mealType?: string | null;
    is_available: boolean;
    price?: number | null;
    totalProtein?: number | null;
    dietaryFibre?: number | null;
    totalCarbohydrate?: number | null;
    totalFat?: number | null;
    totalCalories?: number | null;
    createddate: string;
    updateddate: string;
    CanteenCategoriesSubType?: {
      id: number;
      canteencategoriesid: number;
      itemName: string;
      subCatTypeImg?: string | null;
      is_available: boolean;
      createddate: string;
      updateddate: string;
      CanteenCategory?: {
        id: number;
        canteenid: number;
        itemName: string;
        catImg?: string | null;
        discription?: string | null;
        type?: string | null;
        slug?: string | null;
        is_available: boolean;
        createddate: string;
        updateddate: string;
        canteen?: {
          canteenid: number;
          canteen_name: string;
          roleid: number;
          email: string;
          password: string;
          slug: string;
          token: string;
          address: string;
          companyid: number;
          createddate: string;
          updateddate: string;
        };
      };
    };
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      categoryId: "",
      status: "active",
    });
  };

  const didFetchRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (didFetchRef.current) return; // Guard for StrictMode double-invoke in dev
      didFetchRef.current = true;
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("Token not found in localStorage (key: admin_token)");
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1] || ""));
        const canteenId =
          payload?.userid ||
          payload?.canteenid ||
          payload?.canteenId ||
          payload?.id;

        if (!canteenId) {
          setError("canteenId not found in token payload");
          return;
        }

        setCanteenIdState(String(canteenId));
        setLoading(true);
        const [subcatsRes, subtypesRes] = await Promise.all([
          getSubCategoryByCanteenId(String(canteenId)),
          getAllcategoriesSubTypesByCanteenId(String(canteenId)),
        ]);

        setApiResponse(subcatsRes);

        const subtypeList: Array<{ id: number; itemName: string }> =
          Array.isArray(subtypesRes?.data)
            ? subtypesRes.data
            : Array.isArray(subtypesRes)
            ? subtypesRes
            : [];
        setSubtypeOptions(
          subtypeList.map((x: any) => ({
            id: Number(x.id),
            itemName: String(x.itemName || x.name || x.slug || x.id),
          }))
        );
      } catch (err: any) {
        console.error("Initialization error:", err);
        setError(err?.message || "Initialization failed");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const refreshSubcategories = async () => {
    if (!canteenIdState) return;
    try {
      setLoading(true);
      const res = await getSubCategoryByCanteenId(canteenIdState);
      setApiResponse(res);
    } catch (err) {
      console.error("Refresh subcategories failed", err);
    } finally {
      setLoading(false);
    }
  };

  // legacy add handler removed; creation handled via API modal

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canteenIdState) return;
    try {
      setCreateSubmitting(true);
      const payload = {
        canteenTypeCategoriesid: Number(createForm.canteenTypeCategoriesid),
        itemName: createForm.itemName.trim(),
        price: createForm.price === "" ? null : Number(createForm.price),
        is_available: Boolean(createForm.is_available),
        discription: createForm.discription.trim(),
        subCatImg: createForm.subCatImg.trim(),
        counter_number:
          createForm.counter_number === ""
            ? null
            : Number(createForm.counter_number),
      };
      await createSubCategory(payload);
      setIsCreateModalOpen(false);
      setCreateForm({
        canteenTypeCategoriesid: "",
        itemName: "",
        price: "",
        is_available: true,
        discription: "",
        subCatImg: "",
        counter_number: "",
      });
      await refreshSubcategories();
    } catch (err) {
      console.error("Create subcategory failed", err);
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleUpdateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubcategory) {
      setSubcategories(
        subcategories.map((subcategory) =>
          subcategory.id === selectedSubcategory.id
            ? {
                ...subcategory,
                name: formData.name,
                description: formData.description,
                categoryId: formData.categoryId,
                categoryName: "",
                status: formData.status,
              }
            : subcategory
        )
      );
      setIsEditModalOpen(false);
      resetForm();
      setSelectedSubcategory(null);
    }
  };

  const confirmDeleteSubcategory = () => {
    if (selectedSubcategory) {
      setSubcategories(
        subcategories.filter(
          (subcategory) => subcategory.id !== selectedSubcategory.id
        )
      );
      setSelectedSubcategory(null);
    }
  };

  const SubcategoryForm = ({
    onSubmit,
    isEdit = false,
  }: {
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subcategory Name
        </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter subcategory description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parent Category
        </label>
        <select
          required
          value={formData.categoryId}
          onChange={(e) =>
            setFormData({ ...formData, categoryId: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          <option value="unassigned">Unassigned</option>
        </select>
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
          {isEdit ? "Update" : "Add"} Subcategory
        </button>
      </div>
    </form>
  );

  const apiSubcategories: ApiSubcategory[] = Array.isArray(
    apiResponse?.subCategories
  )
    ? apiResponse.subCategories
    : [];

  const filteredApiSubcategories: ApiSubcategory[] = apiSubcategories.filter(
    (s: ApiSubcategory) => {
      const term = searchTerm.toLowerCase();
      const categoryLabel =
        s.CanteenCategoriesSubType?.CanteenCategory?.itemName || "";
      const subTypeLabel = s.CanteenCategoriesSubType?.itemName || "";
      return (
        (s.itemName || "").toLowerCase().includes(term) ||
        (s.discription || "").toLowerCase().includes(term) ||
        categoryLabel.toLowerCase().includes(term) ||
        subTypeLabel.toLowerCase().includes(term)
      );
    }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menus</h1>
          <p className="text-gray-600 mt-1">
            Organize menu items with detailed subcategories
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Category</span>
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
      <div className="min-h-[120px]">
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">Loading subcategories...</p>
          </div>
        )}
        {!loading && error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <>
            {filteredApiSubcategories.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">
                No subcategories found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApiSubcategories.map((s) => {
                  const categoryLabel =
                    s.CanteenCategoriesSubType?.CanteenCategory?.itemName || "";
                  const subTypeLabel =
                    s.CanteenCategoriesSubType?.itemName || "";
                  const status = s.is_available ? "active" : "inactive";
                  const statusClass =
                    status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800";
                  return (
                    <div
                      key={s.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Image */}
                      <div className="w-full h-40 sm:h-44 md:h-48 bg-gray-100">
                        <img
                          src={STATIC_IMAGE_URL}
                          alt={s.itemName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                              {s.itemName}
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                                {categoryLabel || "No category"}
                              </span>
                              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                                {subTypeLabel || "No subtype"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div
                              className={`px-2 py-1 text-xs font-medium rounded-full inline-block mb-2 whitespace-nowrap ${statusClass}`}
                            >
                              {status}
                            </div>
                            <div className="text-sm sm:text-base font-semibold text-gray-900">
                              ₹{s.price ?? 0}
                            </div>
                          </div>
                        </div>

                        {s.discription && (
                          <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                            {s.discription}
                          </p>
                        )}

                        <div className="mt-4 flex items-center justify-between text-xs sm:text-sm text-gray-500">
                          <p>
                            Added {new Date(s.createddate).toISOString().split("T")[0]}
                          </p>
                          <p>Counter: {s.counter_number ?? "-"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Category Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        title="Create Category"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtype (canteenTypeCategoriesid)
            </label>
            <select
              required
              value={createForm.canteenTypeCategoriesid}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  canteenTypeCategoriesid: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select subtype</option>
              {subtypeLoading ? (
                <option value="" disabled>
                  Loading...
                </option>
              ) : (
                subtypeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.itemName}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item name
            </label>
            <input
              type="text"
              required
              value={createForm.itemName}
              onChange={(e) =>
                setCreateForm({ ...createForm, itemName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter item name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={createForm.price}
                onChange={(e) =>
                  setCreateForm({ ...createForm, price: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available
              </label>
              <select
                value={String(createForm.is_available)}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    is_available: e.target.value === "true",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={createForm.discription}
              onChange={(e) =>
                setCreateForm({ ...createForm, discription: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={createForm.subCatImg}
                onChange={(e) =>
                  setCreateForm({ ...createForm, subCatImg: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Counter number
              </label>
              <input
                type="number"
                value={createForm.counter_number}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    counter_number: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {createSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
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
