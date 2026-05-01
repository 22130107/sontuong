"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

type OrderStatus = "pending" | "confirmed" | "processing" | "completed" | "cancelled";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price_note: string;
}

interface Order {
  id: number;
  order_code: string;
  gender: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  note: string | null;
  total_items: number;
  status: OrderStatus;
  source: string;
  created_at: string;
  items?: OrderItem[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending:    { label: "Chờ xử lý",  color: "#b45309", bg: "#fef3c7" },
  confirmed:  { label: "Đã xác nhận", color: "#1d4ed8", bg: "#dbeafe" },
  processing: { label: "Đang xử lý", color: "#7c3aed", bg: "#ede9fe" },
  completed:  { label: "Hoàn thành", color: "#15803d", bg: "#dcfce7" },
  cancelled:  { label: "Đã hủy",     color: "#dc2626", bg: "#fee2e2" },
};

const SOURCE_LABELS: Record<string, string> = {
  website: "Website", phone: "Điện thoại", zalo: "Zalo", facebook: "Facebook",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const token = () => typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch(`/api/orders?limit=100${filterStatus ? `&status=${filterStatus}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`, {
          headers: { Authorization: `Bearer ${token()}` },
        }),
        fetch("/api/orders?stats=true", { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      const ordersData = await ordersRes.json();
      const statsData = await statsRes.json();
      if (ordersData.success) setOrders(ordersData.data.items);
      if (statsData.success) setStats(statsData.data);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: number, status: OrderStatus) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (result.success) {
      showToast("Cập nhật trạng thái thành công");
      load();
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
    } else showToast(result.message || "Lỗi cập nhật", "error");
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });
    const result = await res.json();
    if (result.success) { showToast("Đã xóa đơn hàng"); load(); setSelectedOrder(null); }
    else showToast(result.message || "Lỗi xóa", "error");
    setDeleteId(null);
  };

  const openDetail = async (order: Order) => {
    const res = await fetch(`/api/orders/${order.id}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    const result = await res.json();
    if (result.success) setSelectedOrder(result.data);
    else setSelectedOrder(order);
  };

  const formatDate = (d: string) => new Date(d).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-800">Quản lý đơn hàng</h1>
                <p className="text-sm text-gray-500 mt-0.5">{stats.total ?? 0} đơn hàng</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-wrap">
              {(["", "pending", "confirmed", "processing", "completed", "cancelled"] as const).map((s) => {
                const cfg = s ? STATUS_CONFIG[s] : null;
                const count = s ? (stats[s] ?? 0) : (stats.total ?? 0);
                const active = filterStatus === s;
                return (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${active ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                    <span className="font-bold">{count}</span>
                    <span>{cfg ? cfg.label : "Tất cả"}</span>
                  </button>
                );
              })}
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6">
            {/* Search */}
            <div className="mb-4 relative max-w-sm">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên, SĐT, mã đơn..."
                className="w-full h-10 border border-gray-300 rounded-lg pl-9 pr-3 text-sm focus:outline-none focus:border-blue-500" />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-3">📋</div>
                <p>Chưa có đơn hàng nào</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200" style={{ backgroundColor: "#f8faff" }}>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Mã đơn</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Khách hàng</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">SĐT</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Sản phẩm</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Thời gian</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => {
                      const cfg = STATUS_CONFIG[order.status];
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-bold text-blue-700">{order.order_code}</span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-800">{order.gender === "chi" ? "Chị" : "Anh"} {order.customer_name}</p>
                            {order.address && <p className="text-xs text-gray-400 truncate max-w-[150px]">{order.address}</p>}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline font-medium">{order.phone}</a>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                            {order.total_items} sản phẩm
                            {order.source !== "website" && <span className="ml-1 text-gray-400">({SOURCE_LABELS[order.source] ?? order.source})</span>}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              className="text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400"
                              style={{ backgroundColor: cfg.bg, color: cfg.color }}
                            >
                              {Object.entries(STATUS_CONFIG).map(([val, c]) => (
                                <option key={val} value={val}>{c.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openDetail(order)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button onClick={() => setDeleteId(order.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">{selectedOrder.order_code}</h2>
                <p className="text-xs text-gray-400">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Thông tin khách */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-gray-700 text-sm mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-400">Họ tên:</span> <span className="font-medium">{selectedOrder.gender === "chi" ? "Chị" : "Anh"} {selectedOrder.customer_name}</span></div>
                  <div><span className="text-gray-400">SĐT:</span> <a href={`tel:${selectedOrder.phone}`} className="font-medium text-blue-600">{selectedOrder.phone}</a></div>
                  {selectedOrder.email && <div className="col-span-2"><span className="text-gray-400">Email:</span> <span className="font-medium">{selectedOrder.email}</span></div>}
                  {selectedOrder.address && <div className="col-span-2"><span className="text-gray-400">Địa chỉ:</span> <span className="font-medium">{selectedOrder.address}</span></div>}
                  {selectedOrder.note && <div className="col-span-2"><span className="text-gray-400">Ghi chú:</span> <span className="font-medium italic">{selectedOrder.note}</span></div>}
                </div>
              </div>

              {/* Sản phẩm */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm mb-3">Sản phẩm đặt mua</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{item.product_name}</p>
                          <p className="text-xs text-gray-400">Giá: {item.price_note}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-600">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cập nhật trạng thái */}
              <div>
                <h3 className="font-semibold text-gray-700 text-sm mb-2">Trạng thái đơn hàng</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                    <button key={val}
                      onClick={() => handleStatusChange(selectedOrder.id, val as OrderStatus)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${selectedOrder.status === val ? "border-current shadow-sm scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t">
              <a href={`tel:${selectedOrder.phone}`}
                className="flex-1 h-10 flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Gọi ngay
              </a>
              <button onClick={() => setSelectedOrder(null)}
                className="flex-1 h-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm xóa */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Xóa đơn hàng?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 h-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 h-10 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}
    </AdminGuard>
  );
}
