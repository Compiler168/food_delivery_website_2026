# Majid's Kitchen - Food Delivery Website

A complete full-stack food delivery website built with HTML5, CSS3, JavaScript (frontend) and Node.js, Express.js, MongoDB (backend).

## 🌟 Features

### Customer Features
- Browse menu with category filtering and search
- Add items to cart and manage quantities
- User authentication (signup/login)
- Place orders with delivery details
- View order history and track status
- Update profile information
- Responsive design for all devices

### Admin Features
- Admin dashboard with statistics
- Manage menu items (add, edit, delete)
- View and manage all orders
- Update order status
- User-friendly admin interface

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3 (with custom design system and animations)
- Vanilla JavaScript (ES6+)
- Font Awesome icons
- Google Fonts (Inter)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone or Extract the Project

Extract the project files to your desired location or clone if using version control.

### 2. Install Dependencies

```bash
cd "d:\Active Works\Food Delivery Website"
npm install
```

### 3. Configure Environment Variables

The `.env` file is already created with default values. Update it if needed:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/majids-kitchen
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/majids-kitchen

# JWT Secret (change this in production!)
JWT_SECRET=majids_kitchen_secret_key_2024_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Default Admin Credentials
ADMIN_EMAIL=admin@majidskitchen.com
ADMIN_PASSWORD=Admin123!
```

### 4. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# Windows (if installed as service): MongoDB should start automatically
# Or run: mongod
```

**Option B: MongoDB Atlas**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Get your connection string
- Update `MONGODB_URI` in `.env` file

### 5. Start the Server

```bash
npm start
```

For development with auto-restart:
```bash

```

The server will start on `http://localhost:5000`

## 📱 Accessing the Application

### Customer Interface
- **Home Page**: `http://localhost:5000/`
- **Menu**: `http://localhost:5000/menu`
- **About Us**: `http://localhost:5000/about`
- **Contact**: `http://localhost:5000/contact`
- **Login/Signup**: `http://localhost:5000/auth`
- **Profile**: `http://localhost:5000/profile` (after login)

### Admin Panel
- **Admin Dashboard**: `http://localhost:5000/admin/index.html`
- **Menu Management**: `http://localhost:5000/admin/menu-management.html`
- **Order Management**: `http://localhost:5000/admin/order-management.html`

**Default Admin Credentials**:
- Email: `admin@majidskitchen.com`
- Password: `Admin123!`

## 🎯 Usage Guide

### For Customers

1. **Browse Menu**
   - Visit the menu page to see all available dishes
   - Use category filters to narrow down options
   - Use the search bar to find specific items

2. **Place an Order**
   - Add items to your cart
   - Click the cart icon to review your order
   - Click "Proceed to Checkout"
   - Fill in delivery details
   - Confirm your order

3. **Track Orders**
   - Login to your account
   - Visit your profile page
   - View order history and status

### For Admins

1. **Login to Admin Panel**
   - Go to `/auth` and login with admin credentials
   - You'll be redirected to the admin dashboard

2. **Manage Menu Items**
   - Navigate to "Menu Management"
   - Add new items with image URL, name, description, price, and category
   - Edit or delete existing items

3. **Process Orders**
   - Navigate to "Orders"
   - View all customer orders
   - Update order status (Pending → Confirmed → Preparing → Out for Delivery → Delivered)

## 📁 Project Structure

```
Food Delivery Website/
├── models/               # MongoDB schemas
│   ├── User.js
│   ├── MenuItem.js
│   └── Order.js
├── routes/               # API routes
│   ├── auth.js
│   ├── menu.js
│   └── orders.js
├── middleware/           # Custom middleware
│   └── auth.js
├── public/               # Frontend files
│   ├── css/
│   │   ├── style.css
│   │   └── admin.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── main.js
│   │   └── profile.js
│   ├── admin/
│   │   ├── index.html
│   │   ├── menu-management.html
│   │   ├── order-management.html
│   │   └── js/
│   ├── index.html
│   ├── menu.html
│   ├── about.html
│   ├── contact.html
│   ├── auth.html
│   └── profile.html
├── server.js             # Main server file
├── package.json
├── .env                  # Environment variables
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Add menu item (admin only)
- `PUT /api/menu/:id` - Update menu item (admin only)
- `DELETE /api/menu/:id` - Delete menu item (admin only)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/all/admin` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## 🎨 Features Highlights

### Modern UI/UX
- Vibrant, food-themed color palette
- Smooth animations and transitions
- Responsive grid layouts
- Interactive hover effects
- Mobile-first design approach

### Security
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes and API endpoints
- Role-based access control (admin/user)
- Input validation

### User Experience
- Real-time cart updates
- Local storage for cart persistence
- Order history tracking
- Profile management
- FAQ accordion
- Customer reviews section

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- For MongoDB Atlas, ensure IP whitelist is configured

### Port Already in Use
```bash
# Change PORT in .env file or kill the process using port 5000
```

### Sample Data Not Loading
- Check MongoDB connection
- Server logs will show if data seeding was successful
- Sample menu items and admin user are created automatically on first run

## 📝 Default Sample Data

The application comes with:
- 18 sample menu items across 5 categories
- 1 admin user (credentials in `.env`)
- Categories: Appetizers, Main Courses, Desserts, Beverages, Specials

## 🔐 Security Notes

**IMPORTANT**: Before deploying to production:
1. Change `JWT_SECRET` to a strong, random string
2. Update admin credentials
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Implement rate limiting
6. Add API input sanitization

## 👨‍💻 Developer

Developed by **Majid Iqbal**

## 📄 License

This project is created for educational and personal use.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs in the terminal
3. Ensure all dependencies are installed
4. Verify MongoDB is running and accessible

---

**Enjoy using Majid's Kitchen! 🍽️**
