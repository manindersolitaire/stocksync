import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/customers', formData);
            showMessage('Customer added successfully');
            setFormData({ name: '', email: '', phone: '' });
            fetchCustomers();
        } catch (err) {
            showMessage(err.response?.data?.message || 'Error creating customer', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await api.delete(`/customers/${id}`);
                showMessage('Customer deleted successfully');
                fetchCustomers();
            } catch (err) {
                showMessage(err.response?.data?.message || 'Error deleting customer', 'error');
            }
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Customer Management</h1>
                <Users size={40} color="var(--primary)" />
            </div>

            {message.text && (
                <div className={`card badge-${message.type}`} style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '0.5rem' }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card glass">
                <h3 style={{ marginBottom: '1rem' }}>Add New Customer</h3>
                <div className="grid">
                    <div>
                        <label style={{display:'block', marginBottom:'0.5rem', fontSize:'0.9rem', color:'var(--text-muted)'}}>Full Name</label>
                        <input className="input" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                        <label style={{display:'block', marginBottom:'0.5rem', fontSize:'0.9rem', color:'var(--text-muted)'}}>Email Address</label>
                        <input className="input" type="email" placeholder="e.g. john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div>
                        <label style={{display:'block', marginBottom:'0.5rem', fontSize:'0.9rem', color:'var(--text-muted)'}}>Phone Number</label>
                        <input className="input" placeholder="e.g. +1 234 567 890" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    <Plus size={18}/> Add Customer
                </button>
            </form>

            <div className="card glass">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>{c.email}</td>
                                <td>{c.phone}</td>
                                <td>
                                    <button onClick={() => handleDelete(c.id)} className="btn glass" style={{ padding: '0.4rem' }}><Trash2 size={16} color="var(--error)"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;
