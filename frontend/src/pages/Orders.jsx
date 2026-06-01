import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, Eye } from 'lucide-react';
import api from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ CustomerId: '', ProductId: '', quantity: 1 });
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchData = async () => {
        try {
            const [oRes, cRes, pRes] = await Promise.all([
                api.get('/orders'),
                api.get('/customers'),
                api.get('/products')
            ]);
            setOrders(oRes.data);
            setCustomers(cRes.data);
            setProducts(pRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/orders', formData);
            showMessage('Order placed successfully');
            setFormData({ CustomerId: '', ProductId: '', quantity: 1 });
            fetchData();
        } catch (err) {
            showMessage(err.response?.data?.message || 'Error creating order', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) {
            try {
                await api.delete(`/orders/${id}`);
                showMessage('Order cancelled and stock restored');
                fetchData();
            } catch (err) {
                showMessage(err.response?.data?.message || 'Error deleting order', 'error');
            }
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Order Management</h1>
                <ShoppingCart size={40} color="var(--primary)" />
            </div>

            {message.text && (
                <div className={`card badge-${message.type}`} style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '0.5rem' }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card glass">
                <h3 style={{ marginBottom: '1rem' }}>Create New Order</h3>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 100px' }}>
                    <div>
                        <label style={{display:'block', marginBottom:'0.5rem', fontSize:'0.9rem', color:'var(--text-muted)'}}>Customer</label>
                        <select className="input" value={formData.CustomerId} onChange={e => setFormData({...formData, CustomerId: e.target.value})} required>
                            <option value="">Select Customer</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{display:'block', marginBottom:'0.5rem', fontSize:'0.9rem', color:'var(--text-muted)'}}>Product</label>
                        <select className="input" value={formData.ProductId} onChange={e => setFormData({...formData, ProductId: e.target.value})} required>
                            <option value="">Select Product</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                    {p.name} (₹{parseFloat(p.price).toFixed(2)}) - {p.quantity} in stock
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{display:'block', marginBottom:'0.5rem', fontSize:'0.9rem', color:'var(--text-muted)'}}>Qty</label>
                        <input className="input" type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} required />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    <Plus size={18}/> Place Order
                </button>
            </form>

            <div className="card glass">
                <table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Total Amount</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td>
                                    <div style={{fontWeight:600}}>{o.Customer?.name}</div>
                                    <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>{o.Customer?.email}</div>
                                </td>
                                <td>
                                    <div>{o.Product?.name}</div>
                                    <div style={{fontSize:'0.8rem'}}><code>{o.Product?.sku}</code></div>
                                </td>
                                <td>{o.quantity}</td>
                                <td style={{fontWeight:700, color:'var(--success)'}}>₹{parseFloat(o.totalAmount).toFixed(2)}</td>
                                <td style={{fontSize:'0.9rem'}}>{new Date(o.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleDelete(o.id)} className="btn glass" style={{ padding: '0.4rem' }}><Trash2 size={16} color="var(--error)"/></button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{textAlign:'center', padding:'2rem', color:'var(--text-muted)'}}>No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
