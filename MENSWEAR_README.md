# 👔 MENSWEAR | Casual & Formal Premium Apparel
**Full-Stack Development Capstone Project**  
**Organization:** Developers Hub  
**Intern:** Farhan Mehmood  

---

## Tech Stack
**MERN** (MongoDB, Express, React, Node)  
**Database Tool:** MongoDB Compass  

---

## 🏛️ Project Overview
This project is a premium eCommerce solution designed for a modern Men's Apparel Brand, featuring a versatile collection of Casual and Formal wear (T-shirts, Jackets, Office Shirts, Pants, and Hoodies). Developed during the Developers Hub Internship, it demonstrates a complete production-grade workflow from database management to automated customer engagement.

---

## 🛠️ Technical Implementation

### Database Management (MongoDB Atlas & Compass)

-**Hybrid Integration:** Project connects to MongoDB Atlas for cloud deployment and MongoDB Compass for local schema visualization.

-**Schema Design:** Structured NoSQL collections for Users, Products, Orders, and Subscribers with optimized indexing for fast category filtering.
- **Local Development:** Managed via MongoDB Compass for real-time data visualization and CRUD testing during development.  
- **Scalability:** Optimized indexing for fast product searches and category filtering.  

### Backend & Business Logic
-**Secure Payments:** Integrated Stripe API for encrypted transaction processing.

-**Automated Mailer:** Nodemailer handles order receipts and Admin alerts for new sales or cancellations.

-**Resilience:** Implemented a Fallback Contact Route via Formspree to ensure 100% availability for customer inquiries.
- **Dynamic Pricing:** Custom logic in `server.js` handles currency detection (USD for international prices, PKR for local prices).  
- **Automated Mailer:**  
  - Order Success: Automated receipts sent to customers.  
  - Sales Alerts: Instant notifications to Admin for new orders.  
  - Order Termination: Alert to Admin when a user cancels an order.  

### Frontend & UI/UX
- **Apparel Gallery:** High-contrast, sporty yet formal UI built with Tailwind CSS.  
- **Responsive Layout:** Pixel-perfect views for Mobile and Desktop.  
- **Persistence:** Cart persistence using LocalStorage synced with MongoDB for seamless user sessions.  

---

## 📂 Project Structure

```
ecommerce-fullstack-design/
├── client/                 # React.js Frontend
│   ├── public/             # Brand Assets & Static Data
│   └── src/
│       ├── components/     # UI Elements (Navbar, Product Cards)
│       ├── context/        # Cart & Auth State
│       └── pages/          # Home, Shop, Product Details, Cart
├── server/                 # Node.js & Express.js Backend
│   ├── config/             # DB Connection Logic
│   ├── controllers/        # Logic for Orders, Auth, & Products
│   ├── middleware/         # JWT Protection & Route Guards
│   ├── models/             # Mongoose Schemas (Order, Product, User)
│   ├── routes/             # Express API Endpoints
│   ├── Products-Data/      # Apparel Image Repository
│   └── server.js           # Main Server & Nodemailer Logic
└── README.md
```

---

## 🚀 Key Features
- **Premium Apparel Filtering:** Search and filter by Casual (Hoodies/T-shirts) or Formal (Office Shirts/Pants).  
- **Secure Authentication:** JWT-based login/signup with encrypted passwords via Bcrypt.  
- **Stripe Integration:** Secure checkout flow for digital payments.  
- **Admin Control:** Protected routes for managing inventory (CRUD operations).  

### Admin Access (For Evaluation):

Email: administrator@menswear.com

Password: admin123
---

## 🚦 Getting Started

### Clone & Install
```bash
git clone https://github.com/yourusername/ecommerce-fullstack-design.git
cd server && npm install
cd ../client && npm install
```

### Database Setup
Ensure MongoDB Compass is running and connect via your `MONGO_URI` in the `.env` file.

### Run Locally
```bash
# Start Backend
npm run start (from server folder)

# Start Frontend
npm start (from client folder)
```

---

## 👨‍💻 Developed By
**Farhan Mehmood**  
Full-Stack Intern at Developers Hub
