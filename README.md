# 🍴 QuickGrab

### Order. Skip the Queue. Grab Your Food.

QuickGrab is a full-stack MERN-based college canteen pre-order and pickup queue management system.

Students can browse the canteen menu, add food to their cart, select a pickup slot, place orders, receive a queue number, and track their order status.

Admins can manage food items, monitor incoming orders, update order statuses, and view canteen analytics through a dedicated dashboard.

---

## 🚀 Live Demo

🔗 **Live Website:** [QuickGrab](https://canteen-preorder-ldva.vercel.app/)

> QuickGrab is a college canteen pre-order and pickup queue management system that helps students order food in advance and skip long queues.

## 🚀 Features

### 👨‍🎓 Student Features

- 🔐 Student Registration & Login
- 🔑 JWT Authentication
- 🍔 Browse Canteen Menu
- 🔎 Search Food Items
- 🏷️ Filter Food by Category
- ❤️ Add Food to Favorites
- 🛒 Add Items to Cart
- ➕ Increase / Decrease Quantity
- 🗑️ Remove Items from Cart
- 🧹 Clear Cart
- 💰 Automatic Cart Total Calculation
- 🕐 Select Pickup Slot
- 🎫 Automatic Queue Number
- 📦 Place Food Orders
- 📍 Track Order Status
- 🔄 Live Order Status Updates
- ❌ Cancel Pending Orders
- 📱 Responsive Interface

### 👨‍🍳 Admin Features

- 🔐 Admin Authentication
- 📊 Admin Dashboard
- 📋 View All Orders
- 🔎 Search Orders
- 🏷️ Filter Orders by Status
- 🔥 Start Preparing Orders
- ✅ Mark Orders as Ready
- 🎉 Complete Orders
- ❌ View Cancelled Orders
- 🍔 Add Food Items
- ✏️ Edit Food Items
- 🗑️ Delete Food Items
- 🟢 Toggle Food Availability
- 📈 Order Analytics
- 💰 Revenue Statistics
- 🏆 Popular Food Analysis
- 🔄 Automatic Order Refresh
- 🔔 New Order Notifications

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcryptjs

### Database

- MongoDB Atlas
- Mongoose

### Development Tools

- Git
- GitHub
- VS Code

---

## 🏗️ Project Structure

```text
QuickGrab
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── createAdmin.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
