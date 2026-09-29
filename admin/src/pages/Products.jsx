import { useEffect, useState } from 'react';
import { productAPI } from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI
      .list()
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display">Products</h1>
        <div className="text-sm text-cream/60">
          {products.length} items
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-cream/40">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-card rounded-2xl border border-coral/20 overflow-hidden"
            >
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-cream/60 mt-1">{p.category}</div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-coral font-bold">
                    ₹{Number(p.price_small).toFixed(0)}+
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.is_active
                        ? 'bg-mint/20 text-mint'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
