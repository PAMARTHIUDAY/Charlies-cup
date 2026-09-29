import { useEffect, useState } from 'react';
import { couponAPI } from '../api';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    couponAPI
      .list()
      .then((r) => setCoupons(r.data))
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display">Coupons</h1>
        <div className="text-sm text-cream/60">{coupons.length} active</div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-cream/40">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-card p-6 rounded-2xl border-2 border-dashed border-coral/40"
            >
              <div className="text-2xl font-bold text-coral tracking-wider">
                {c.code}
              </div>
              <div className="text-3xl font-script text-cream mt-2">
                {Number(c.discount_value).toFixed(0)}
                {c.discount_type === 'percent' ? '%' : '₹'} OFF
              </div>
              <div className="text-xs text-cream/60 mt-3">
                Min order ₹{c.min_order}
              </div>
              <div
                className={`mt-4 text-xs px-3 py-1 rounded-full inline-block ${
                  c.is_active
                    ? 'bg-mint/20 text-mint'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {c.is_active ? 'Active' : 'Expired'}
              </div>
            </div>
          ))}
          {coupons.length === 0 && (
            <div className="col-span-3 text-center py-12 text-cream/40">
              No coupons yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
