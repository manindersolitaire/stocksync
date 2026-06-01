import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
            <Package color="white" size={24} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>StockSync</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} style={{display:'flex', alignItems:'center', gap:'0.4rem'}}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''} style={{display:'flex', alignItems:'center', gap:'0.4rem'}}>
            <Package size={18} /> Products
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => isActive ? 'active' : ''} style={{display:'flex', alignItems:'center', gap:'0.4rem'}}>
            <Users size={18} /> Customers
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''} style={{display:'flex', alignItems:'center', gap:'0.4rem'}}>
            <ShoppingCart size={18} /> Orders
          </NavLink>
        </div>
      </nav>

      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
        © 2026 StockSync Inventory Management. Built with React & Express.
      </footer>
    </Router>
  );
}

export default App;
