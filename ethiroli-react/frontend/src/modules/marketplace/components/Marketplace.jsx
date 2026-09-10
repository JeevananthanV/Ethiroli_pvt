import React, { useEffect, useState } from 'react';
import { getMarketplaceProducts } from '../../../../services/api/marketplaceApi.js';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getMarketplaceProducts().catch(() => []);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading marketplace...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Marketplace</h2>
          <p className="pageSubtitle">Browse courses and products</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {products.length === 0 ? (
          <div className="emptyState" style={{ gridColumn: '1 / -1' }}><h3>No Products</h3><p>No marketplace products found.</p></div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '140px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '48px' }}>
                {product.icon || '📚'}
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px' }}>{product.title || product.name}</h4>
                <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px', margin: 0 }}>{product.description || 'No description'}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span className="statusTag active">{product.level || 'All Levels'}</span>
                <span style={{ fontWeight: '600', color: 'var(--admin-primary)' }}>{product.price ? `$${product.price}` : 'Free'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
