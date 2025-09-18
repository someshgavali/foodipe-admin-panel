import React, { useEffect, useRef, useState } from "react";
import Modal from "../components/Modal";
import { Pencil } from "lucide-react";
import { getAllcategoriesSubTypesByCanteenId , updateSubTypesBySubCategoryTypeId, createCategoriesSubTypeItem, getCategoriesByCanteenId} from "../api/adminApi/canteen";

type JwtPayload = {
  userid?: number | string;
  [key: string]: unknown;
};

type SubType = {
  id: number;
  canteencategoriesid: number;
  itemName: string;
  subCatTypeImg: string | null;
  is_available: boolean;
  createddate: string;
  updateddate: string;
  CanteenCategory?: {
    id: number;
    canteenid: number;
    itemName: string;
    catImg?: string | null;
    type?: string | null;
  };
};

type SubCategory = {
  id: number;
  itemName: string;
};

function decodeJwtUserid(token: string | null): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadJson = JSON.parse(atob(parts[1])) as JwtPayload;
    const userid = payloadJson.userid;
    return userid != null ? String(userid) : null;
  } catch (_e) {
    return null;
  }
}

const SubcategoryTypes: React.FC = () => {
  const [subTypes, setSubTypes] = useState<SubType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [form, setForm] = useState<{ id?: number; canteencategoriesid: string; itemName: string; subCatTypeImg: string; is_available: boolean }>({ canteencategoriesid: "", itemName: "", subCatTypeImg: "", is_available: true });
  const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([]);
  const didFetchRef = useRef<boolean>(false);

  useEffect(() => {
    if (didFetchRef.current) return; // prevent double-call in StrictMode
    didFetchRef.current = true;

    const token = localStorage.getItem("admin_token");
    const canteenId = decodeJwtUserid(token);

    if (!canteenId) {
      setError("Missing or invalid token. Unable to determine canteenId.");
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError("");
      const [subTypesRes, subCatsRes] = await Promise.allSettled([
        getAllcategoriesSubTypesByCanteenId(canteenId),
        getCategoriesByCanteenId(canteenId)
      ]);

      if (subTypesRes.status === "fulfilled") {
        const items = (subTypesRes.value?.subTypes ?? []) as SubType[];
        setSubTypes(items);
      } else {
        // keep showing any available data, but surface a soft error
        setError((prev) => prev || "Some data failed to load (sub types).");
      }

      if (subCatsRes.status === "fulfilled") {
        const subsItems = (subCatsRes.value?.subCategories ?? subCatsRes.value?.data ?? []) as SubCategory[];
        setAllSubCategories(subsItems);
      } else {
        setError((prev) => prev || "Some data failed to load (categories).");
      }

      setLoading(false);
    })();
  }, []);

  function resetForm() {
    setForm({ canteencategoriesid: "", itemName: "", subCatTypeImg: "", is_available: true });
  }

  function openEdit(st: SubType) {
    setForm({ id: st.id, canteencategoriesid: String(st.canteencategoriesid), itemName: st.itemName ?? "", subCatTypeImg: st.subCatTypeImg ?? "", is_available: !!st.is_available });
    setIsEditOpen(true);
  }

  function openCreate() {
    resetForm();
    setIsCreateOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function refreshList() {
    const token = localStorage.getItem("admin_token");
    const canteenId = decodeJwtUserid(token);
    if (!canteenId) return;
    const data = await getAllcategoriesSubTypesByCanteenId(canteenId);
    const items = (data?.subTypes ?? []) as SubType[];
    setSubTypes(items);
  }

  async function submitEdit() {
    if (!form.id) return;
    const payload = { canteencategoriesid: form.canteencategoriesid, itemName: form.itemName, subCatTypeImg: form.subCatTypeImg, is_available: form.is_available } as any;
    try {
      await updateSubTypesBySubCategoryTypeId(form.id, payload);
      await refreshList();
      setIsEditOpen(false);
    } catch (_e) {
      // silent
    }
  }

  async function submitCreate() {
    const payload = { canteencategoriesid: form.canteencategoriesid, itemName: form.itemName, subCatTypeImg: form.subCatTypeImg, is_available: form.is_available } as any;
    try {
      await createCategoriesSubTypeItem(payload);
      await refreshList();
      setIsCreateOpen(false);
    } catch (_e) {
      // silent
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Subcategories Types</h1>
        <p className="text-sm text-gray-500">Manage subcategory type definitions for canteens.</p>
      </div>

      <div className="flex items-center justify-end mb-4">
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 text-sm">Create sub category type</button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && error && (
          <div className="mb-3 text-red-600 text-sm">{error}</div>
        )}
        {!loading && subTypes.length === 0 && (
          <p className="text-gray-500">No subcategory types found.</p>
        )}

        {!loading && subTypes.length > 0 && (
          <>
            <div className="mb-4 text-sm text-gray-600">Total: {subTypes.length}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subTypes.map((st) => (
                <div key={st.id} className="border rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{st.itemName}</h3>
                      <p className="text-xs text-gray-500">Category: {st.CanteenCategory?.itemName ?? "-"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(st)} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <span className={`text-xs px-2 py-1 rounded ${st.is_available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {st.is_available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-700">
                    <div className="flex gap-2">
                      <span className="text-gray-500">Type Image:</span>
                      <span>{st.subCatTypeImg ?? "-"}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500">Created:</span>
                      <span>{new Date(st.createddate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Sub Category Type" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Canteen Category</label>
            <select name="canteencategoriesid" value={form.canteencategoriesid} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select category</option>
              {allSubCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.itemName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Item name</label>
            <input name="itemName" value={form.itemName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Chinese" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Type image</label>
            <input name="subCatTypeImg" value={form.subCatTypeImg} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="Image URL or text" />
          </div>
          <div className="flex items-center gap-2">
            <input id="is_available_edit" name="is_available" type="checkbox" checked={form.is_available} onChange={handleChange} />
            <label htmlFor="is_available_edit" className="text-sm text-gray-700">Available</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
            <button onClick={submitEdit} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Update</button>
          </div>
        </div>
      </Modal>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Sub Category Type" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Canteen Category</label>
            <select name="canteencategoriesid" value={form.canteencategoriesid} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select category</option>
              {allSubCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.itemName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Item name</label>
            <input name="itemName" value={form.itemName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Chinese" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Type image</label>
            <input name="subCatTypeImg" value={form.subCatTypeImg} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="Image URL or text" />
          </div>
          <div className="flex items-center gap-2">
            <input id="is_available_create" name="is_available" type="checkbox" checked={form.is_available} onChange={handleChange} />
            <label htmlFor="is_available_create" className="text-sm text-gray-700">Available</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
            <button onClick={submitCreate} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Create</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubcategoryTypes;


