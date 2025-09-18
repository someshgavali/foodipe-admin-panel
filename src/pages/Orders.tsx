import { useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
import {
  getAllOrdersByCompany,
  getOrderByOrderId,
} from "../api/adminApi/Order";
import { updateOrderStatus } from "../api/adminApi/canteen";

// Backend status enum values
type BackendOrderStatus = "ordered" | "completed" | "preparing" | "cancelled";

// UI display status values
type UIOrderStatus = "ORDERED" | "PREPARING" | "COMPLETED" | "CANCELLED";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: UIOrderStatus;
  placedAt: string; // ISO string
  items: OrderItem[];
  paymentStatus?: string;
  paymentMethod?: string;
}

// Mapping backend status to UI status
const mapBackendToUI = (backendStatus: string): UIOrderStatus => {
  const status = backendStatus.toLowerCase();
  switch (status) {
    case "ordered":
      return "ORDERED";
    case "preparing":
      return "PREPARING";
    case "completed":
      return "COMPLETED";
    case "cancelled":
      return "CANCELLED";
    default:
      return "ORDERED"; // default fallback
  }
};

// Mapping UI status to backend status
const mapUIToBackend = (uiStatus: UIOrderStatus): BackendOrderStatus => {
  switch (uiStatus) {
    case "ORDERED":
      return "ordered";
    case "PREPARING":
      return "preparing";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    default:
      return "ordered";
  }
};

const statusStyle: Record<UIOrderStatus, string> = {
  ORDERED: "bg-yellow-100 text-yellow-700",
  PREPARING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UIOrderStatus | "ALL">(
    "ALL"
  );
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<UIOrderStatus>("ORDERED");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const readTokenFromLocalStorage = (): string | null => {
      try {
        const stored = localStorage.getItem("admin_token");
        if (!stored) return null;
        if (stored.startsWith("{") || stored.startsWith("[")) {
          const parsed = JSON.parse(stored);
          return parsed?.token ?? null;
        }
        return stored;
      } catch (error) {
        console.error("Failed to read token from localStorage", error);
        return null;
      }
    };

    const decodeJwtPayload = (token: string): any | null => {
      try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Failed to decode JWT", error);
        return null;
      }
    };

    const fetchOrders = async () => {
      const token = readTokenFromLocalStorage();
      if (!token) {
        console.warn("admin_token not found in localStorage");
        return;
      }
      const payload = decodeJwtPayload(token);
      const derivedCanteenId: string | null =
        payload?.userId ??
        payload?.userid ??
        payload?.user_id ??
        payload?.sub ??
        payload?.id ??
        null;
      if (!derivedCanteenId) {
        console.warn("userId not found in token payload");
        return;
      }
      try {
        const response = await getAllOrdersByCompany(derivedCanteenId);
        const apiOrders: any[] = Array.isArray(response?.orders)
          ? response.orders
          : [];
        const mapped: OrderRow[] = apiOrders.map((o) => {
          const customerName = o?.User?.name ?? "-";
          const totalAmount = parseFloat(o?.totalAmount ?? 0);
          const placedAt = o?.createddate ?? new Date().toISOString();
          const backendStatus = String(o?.status ?? "ordered");
          const normalizedStatus: UIOrderStatus = mapBackendToUI(backendStatus);
          const items: OrderItem[] = Array.isArray(o?.items)
            ? o.items.map((it: any, idx: number) => ({
                id: String(idx),
                name: `Subcategory ${it?.subcategoryId ?? "-"}`,
                quantity: Number(it?.quantity ?? 0),
                price: Number(it?.price ?? 0),
              }))
            : [];
          return {
            id: String(o?.id ?? ""),
            orderNumber: String(o?.orderNumber ?? "-"),
            customerName,
            totalAmount: isNaN(totalAmount) ? 0 : totalAmount,
            status: normalizedStatus,
            placedAt: String(placedAt),
            items,
            paymentStatus: o?.paymentStatus ?? "-",
            paymentMethod: o?.paymentMethod ?? "-",
          };
        });
        setOrders(mapped);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchText = [o.orderNumber, o.customerName]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "ALL" ? true : o.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const backendStatus = mapUIToBackend(selectedStatus);
      await updateOrderStatus(selectedOrder.id, { status: backendStatus });

      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === selectedOrder.id ? { ...ord, status: selectedStatus } : ord
        )
      );

      setUpdateOpen(false);
    } catch (error) {
      console.error("Failed to update order status:", error);
      setUpdateError("Failed to update order status. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">
            Track and manage canteen orders.
          </p>
        </div>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or customer"
            className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as UIOrderStatus | "ALL")
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ORDERED">Ordered</option>
            <option value="PREPARING">Preparing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Placed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {o.orderNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                  {o.customerName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {o.items.map((it) => (
                      <span
                        key={it.id}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                      >
                        {it.name} × {it.quantity}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                  ₹{o.totalAmount.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(o.placedAt).toLocaleTimeString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      o.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : o.paymentStatus === "unpaid"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyle[o.status]
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-left text-sm">
                  <button
                    className="mr-2 rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                    onClick={async () => {
                      setSelectedOrder(o);
                      setOrderDetails(null);
                      setDetailsError(null);
                      setDetailsLoading(true);
                      setDetailsOpen(true);
                      try {
                        const res = await getOrderByOrderId(o.id);
                        setOrderDetails(res);
                      } catch (err) {
                        console.error("Failed to load order details", err);
                        setDetailsError("Failed to load order details");
                      } finally {
                        setDetailsLoading(false);
                      }
                    }}
                  >
                    Details
                  </button>
                  <button
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
                    onClick={() => {
                      setSelectedOrder(o);
                      setSelectedStatus(o.status);
                      setUpdateOpen(true);
                      setUpdateError(null);
                    }}
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">
            No orders found.
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Order Details"
        size="lg"
      >
        {!selectedOrder ? (
          <div className="text-gray-500">No order selected.</div>
        ) : detailsLoading ? (
          <div className="text-gray-500">Loading details...</div>
        ) : detailsError ? (
          <div className="text-red-600">{detailsError}</div>
        ) : orderDetails ? (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-500">Order #</div>
                <div className="font-medium text-gray-900">
                  {orderDetails.orderNumber ?? selectedOrder.orderNumber}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Customer</div>
                <div className="font-medium text-gray-900">
                  {orderDetails?.User?.name ?? selectedOrder.customerName}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Email</div>
                <div className="font-medium text-gray-900">
                  {orderDetails?.User?.email ?? "-"}
                </div>
              </div>
              <div>
                <div className="text-gray-500">User ID</div>
                <div className="font-medium text-gray-900">
                  {orderDetails?.User?.userId ?? orderDetails?.userId ?? "-"}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Placed</div>
                <div className="font-medium text-gray-900">
                  {new Date(
                    orderDetails?.createddate ?? selectedOrder.placedAt
                  ).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Updated</div>
                <div className="font-medium text-gray-900">
                  {orderDetails?.updateddate
                    ? new Date(orderDetails.updateddate).toLocaleString()
                    : "-"}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Payment</div>
                <div className="font-medium text-gray-900">
                  {orderDetails?.paymentStatus ?? selectedOrder.paymentStatus}{" "}
                  {orderDetails?.paymentMethod
                    ? `(${orderDetails.paymentMethod})`
                    : selectedOrder.paymentMethod
                    ? `(${selectedOrder.paymentMethod})`
                    : ""}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Status</div>
                <div className="font-medium text-gray-900">
                  {orderDetails?.status ?? selectedOrder.status}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Total</div>
                <div className="font-medium text-gray-900">
                  ₹
                  {parseFloat(
                    orderDetails?.totalAmount ?? selectedOrder.totalAmount
                  ).toFixed(2)}
                </div>
              </div>
            </div>

            {orderDetails?.qrCodeUrl ? (
              <div>
                <div className="mb-2 text-gray-500">QR Code</div>
                <img
                  src={orderDetails.qrCodeUrl}
                  alt="QR Code"
                  className="w-40 h-40 object-contain border border-gray-200 rounded"
                />
              </div>
            ) : null}

            <div>
              <div className="mb-2 text-gray-500">Items</div>
              <div className="space-y-2">
                {Array.isArray(orderDetails.items) &&
                orderDetails.items.length > 0 ? (
                  orderDetails.items.map((it: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-2"
                    >
                      <div className="text-gray-800">
                        Subcategory {it?.subcategoryId ?? "-"}
                      </div>
                      <div className="text-gray-600">
                        Qty: {it?.quantity ?? 0}
                      </div>
                      <div className="text-gray-900 font-medium">
                        ₹{Number(it?.price ?? 0).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No items</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No details available.</div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={updateOpen}
        onClose={() => setUpdateOpen(false)}
        title="Update Order Status"
      >
        {selectedOrder ? (
          <div className="space-y-4 text-sm">
            <div>
              <div className="mb-1 text-gray-600">Select new status</div>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as UIOrderStatus)
                }
                disabled={updateLoading}
              >
                <option value="ORDERED">Ordered</option>
                <option value="PREPARING">Preparing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {updateError && (
              <div className="text-red-600 text-sm">{updateError}</div>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setUpdateOpen(false)}
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={handleUpdateStatus}
                disabled={updateLoading}
              >
                {updateLoading ? "Updating..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No order selected.</div>
        )}
      </Modal>
    </div>
  );
}
