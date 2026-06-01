import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCustomers: 0,
        totalOrders: 0,
        lowStockProducts: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
            
            <div className="grid">
                <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: '0.75rem' }}>
                        <Package size={32} color="#6366f1" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)' }}>Total Products</p>
                        <h2 style={{ fontSize: '2rem' }}>{stats.totalProducts}</h2>
                    </div>
                </div>

                <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '1rem', borderRadius: '0.75rem' }}>
                        <Users size={32} color="#22c55e" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)' }}>Total Customers</p>
                        <h2 style={{ fontSize: '2rem' }}>{stats.totalCustomers}</h2>
                    </div>
                </div>

                <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '0.75rem' }}>
                        <ShoppingCart size={32} color="#ef4444" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)' }}>Total Orders</p>
                        <h2 style={{ fontSize: '2rem' }}>{stats.totalOrders}</h2>
                    </div>
                </div>
            </div>

            {stats.lowStockProducts.length > 0 && (
                <div className="card glass" style={{ marginTop: '2rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--warning)' }}>
                        <AlertTriangle size={24} />
                        <h3 style={{ margin: 0 }}>Low Stock Alert</h3>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>SKU</th>
                                <th>Current Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.lowStockProducts.map(p => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td><code>{p.sku}</code></td>
                                    <td style={{ color: 'var(--error)', fontWeight: 'bold' }}>{p.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
