# StockSync: Containerized Inventory & Order Management System

A production-ready full-stack application for managing products, customers, and orders with automated inventory tracking.

## Technical Stack

- **Frontend**: React (Vite), Lucide-React, Axios, Vanilla CSS (Glassmorphism)
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose

## Features

- **Dashboard**: Real-time summary of products, customers, orders, and low-stock alerts.
- **Product Management**: CRUD operations with unique SKU validation and quantity tracking.
- **Customer Management**: CRUD operations with unique email validation.
- **Order Management**: 
    - Transaction-safe order placement.
    - Automated stock reduction.
    - Automated total amount calculation.
    - Stock restoration on order cancellation.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Getting Started (Docker)

Ensure you have Docker and Docker Compose installed.

1. Clone the repository.
2. Run the system:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: `http://localhost` (Port 80)
   - Backend API: `http://localhost:5000/api`
   - Database: `localhost:5432`

## Deployment

### Backend
Deploy the `backend` directory to platforms like Render or Railway.
- Ensure environment variables (`DB_HOST`, `DB_USER`, etc.) are configured.

### Frontend
Deploy the `frontend` directory to Vercel or Netlify.
- Set `VITE_API_URL` to your deployed backend URL.

## Business Logic
- Product SKU/code must be unique.
- Customer email must be unique.
- Product quantity cannot be negative.
- Orders cannot be placed if inventory is insufficient.
- Creating an order automatically reduces available stock.
- The total order amount is calculated automatically.
