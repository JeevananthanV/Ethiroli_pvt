import React, { useEffect, useState } from 'react';
import { getMarketplaceProducts } from '../../../../services/api/marketplaceApi.js';

export default function SalesDashboard() {
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

  if (loading) return <div className="loading">Loading sales dashboard...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Sales Dashboard</h2>
          <p className="pageSubtitle">Marketplace products and sales overview</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px', marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Total Products</p>
          <p className="statValue">{products.length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Active Listings</p>
          <p className="statValue">{products.filter((p) => p.is_active).length}</p>
        </div>
      </div>
      <div className="card">
        <div className="cardBody">
          {products.length === 0 ? (
            <div className="emptyState"><h3>No Products</h3><p>No marketplace products found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Price</th><th>Status</th></tr></thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.title || product.name}</td>
                    <td>${(product.price || 0).toLocaleString()}</td>
                    <td><span className={`statusTag ${product.is_active ? 'active' : 'inactive'}`}>{product.is_active ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
