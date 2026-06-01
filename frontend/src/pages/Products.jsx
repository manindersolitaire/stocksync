import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Edit } from 'lucide-react';
import api from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', sku: '', price: '', quantity: '' });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, formData);
                showMessage('Product updated successfully');
            } else {
                await api.post('/products', formData);
                showMessage('Product added successfully');
            }
            setFormData({ name: '', sku: '', price: '', quantity: '' });
            setEditingId(null);
            fetchProducts();
        } catch (err) {
            showMessage(err.response?.data?.message || 'Error processing request', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                showMessage('Product deleted successfully');
                fetchProducts();
            } catch (err) {
                showMessage(err.response?.data?.message || 'Error deleting product', 'error');
            }
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Product Management</h1>
                <Package size={40} color="var(--primary)" />
            </div>

            {message.text && (
                <div className={`card badge-${message.type}`} style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '0.5rem' }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card glass">
                <h3 style={{ marginBottom: '1rem' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                <div className="grid">
                    <div>
                        <label style={{display:'block', marginBottom:'0.5rem', fontSize:'0.9rem', color:'var(--text-muted)'}}>Product Name</label>
                        <input className="input" placeholder="e.g. Laptop Pro" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                        <label style={{display:'block', marginBottom:'0.5rem', fontSize:'0.9rem', color:'var(--text-muted)'}}>SKU Code</label>
                        <input className="input" placeholder="e.g. LAP-001" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required />
                    </div>
                    <div>
                        <label style={{display:'block', marginBottom:'0.5rem', fontSize:'0.9rem', color:'var(--text-muted)'}}>Price (₹)</label>
                        <input className="input" type="number" step="0.01" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    </div>
                    <div>
                        <label style={{display:'block', marginBottom:'0.5rem', fontSize:'0.9rem', color:'var(--text-muted)'}}>Stock Quantity</label>
                        <input className="input" type="number" placeholder="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary">
                        {editingId ? <><Edit size={18}/> Update Product</> : <><Plus size={18}/> Add Product</>}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => {setEditingId(null); setFormData({name:'', sku:'', price:'', quantity:''})}} className="btn glass">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="card glass">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td><code>{p.sku}</code></td>
                                <td>₹{parseFloat(p.price).toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${p.quantity < 10 ? 'badge-error' : 'badge-success'}`}>
                                        {p.quantity} in stock
                                    </span>
                                </td>
                                <td style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => {setEditingId(p.id); setFormData({name:p.name, sku:p.sku, price:p.price, quantity:p.quantity})}} className="btn glass" style={{ padding: '0.4rem' }}><Edit size={16} color="var(--primary)"/></button>
                                    <button onClick={() => handleDelete(p.id)} className="btn glass" style={{ padding: '0.4rem' }}><Trash2 size={16} color="var(--error)"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
