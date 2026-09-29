import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { orderAPI } from '../api';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.list()
      .then((r) => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.created_at).toDateString() === today
  );

  const stats = [
    { label: 'Today Orders', value: todayOrders.length, emoji: '📦' },
    {
      label: 'Revenue Today',
      value: `₹${todayOrders.reduce((s, o) => s + Number(o.total || 0), 0)}`,
      emoji: '💰',
    },
    {
      label: 'Pending Delivery',
      value: orders.filter((o) => o.status === 'placed').length,
      emoji: '🚚',
    },
    { label: 'Total Orders', value: orders.length, emoji: '📊' },
  ];

  const chartData = orders
    .slice(0, 7)
    .reverse()
    .map((o) => ({
      day: new Date(o.created_at).toLocaleDateString('en', { weekday: 'short' }),
      total: Number(o.total),
    }));

  return (
    <div>
      <h1 className="text-3xl font-display mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card p-6 rounded-2xl border border-coral/20"
          >
            <div className="text-3xl mb-2">{s.emoji}</div>
            <div className="text-2xl font-bold text-coral">{s.value}</div>
            <div className="text-sm text-cream/60 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-card p-6 rounded-2xl border border-coral/20">
        <h2 className="text-xl font-display mb-6">Recent Orders</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="#FFF3D6" />
              <YAxis stroke="#FFF3D6" />
              <Tooltip
                contentStyle={{
                  background: '#1E1611',
                  border: '1px solid #FF6B6B',
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#FF6B6B"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-cream/40">
            {loading ? 'Loading...' : 'No orders yet'}
          </div>
        )}
      </div>
    </div>
  );
}
