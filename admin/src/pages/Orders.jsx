import { useEffect, useState } from 'react';
import { orderAPI } from '../api';

const statusColors = {
  placed: 'bg-yellow-500/20 text-yellow-400',
  preparing: 'bg-blue-500/20 text-blue-400',
  out: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-mint/20 text-mint',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    orderAPI
      .list()
      .then((r) => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      load();
    } catch (e) {
      alert('Failed to update');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-display mb-8">Orders</h1>
      <div className="bg-card rounded-2xl border border-coral/20 overflow-hidden">
        <table className="w-full">
          <thead className="bg-coral/10 text-coral">
            <tr>
              <th className="text-left p-4">Order</th>
              <th className="text-left p-4">Address</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-coral/10">
                <td className="p-4 font-mono text-sm">#{o.id}</td>
                <td className="p-4 text-sm">{o.address || 'N/A'}</td>
                <td className="p-4 font-bold text-coral">₹{o.total}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[o.status] || 'bg-white/10'
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="bg-ink border border-coral/30 rounded-lg px-3 py-1 outline-none text-sm"
                  >
                    <option value="placed">Placed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-8 text-cream/40">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
