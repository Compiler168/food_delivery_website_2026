const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
        // Seed initial data if needed
        seedInitialData();
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: "Majid's Kitchen API is running",
        timestamp: new Date().toISOString()
    });
});

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'menu.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'contact.html'));
});

app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'auth.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'profile.html'));
});

// Catch-all route for 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Function to seed initial data
async function seedInitialData() {
    try {
        const User = require('./models/User');
        const MenuItem = require('./models/MenuItem');

        // Create admin user if not exists
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: 'admin'
            });
            console.log('✅ Admin user created');
        }

        // Add sample menu items if collection is empty
        const menuCount = await MenuItem.countDocuments();
        if (menuCount === 0) {
            const sampleMenu = [
                // Appetizers
                {
                    name: 'Chicken Wings',
                    description: 'Crispy chicken wings tossed in your choice of buffalo, BBQ, or garlic parmesan sauce',
                    price: 8.99,
                    category: 'Appetizers',
                    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
                    featured: true
                },
                {
                    name: 'Mozzarella Sticks',
                    description: 'Golden fried mozzarella cheese sticks served with marinara sauce',
                    price: 6.99,
                    category: 'Appetizers',
                    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400'
                },
                {
                    name: 'Spring Rolls',
                    description: 'Crispy vegetable spring rolls with sweet chili dipping sauce',
                    price: 5.99,
                    category: 'Appetizers',
                    image: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=400'
                },

                // Main Courses
                {
                    name: 'Grilled Chicken Platter',
                    description: 'Marinated grilled chicken breast with rice, salad, and garlic sauce',
                    price: 14.99,
                    category: 'Main Courses',
                    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
                    featured: true
                },
                {
                    name: 'Beef Burger Deluxe',
                    description: 'Juicy beef patty with cheese, lettuce, tomato, onions, and special sauce',
                    price: 12.99,
                    category: 'Main Courses',
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
                    featured: true
                },
                {
                    name: 'Margherita Pizza',
                    description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
                    price: 13.99,
                    category: 'Main Courses',
                    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
                },
                {
                    name: 'Pasta Alfredo',
                    description: 'Creamy fettuccine pasta with grilled chicken and parmesan cheese',
                    price: 11.99,
                    category: 'Main Courses',
                    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400'
                },
                {
                    name: 'Fish & Chips',
                    description: 'Beer-battered fish fillet with crispy fries and tartar sauce',
                    price: 13.99,
                    category: 'Main Courses',
                    image: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=400'
                },
                {
                    name: 'Vegetable Stir Fry',
                    description: 'Fresh vegetables stir-fried in teriyaki sauce, served with rice',
                    price: 10.99,
                    category: 'Main Courses',
                    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400'
                },

                // Desserts
                {
                    name: 'Chocolate Lava Cake',
                    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
                    price: 6.99,
                    category: 'Desserts',
                    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
                    featured: true
                },
                {
                    name: 'Cheesecake',
                    description: 'New York style cheesecake with strawberry topping',
                    price: 5.99,
                    category: 'Desserts',
                    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400'
                },
                {
                    name: 'Ice Cream Sundae',
                    description: 'Three scoops of ice cream with chocolate syrup, whipped cream, and cherry',
                    price: 4.99,
                    category: 'Desserts',
                    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'
                },

                // Beverages
                {
                    name: 'Fresh Orange Juice',
                    description: 'Freshly squeezed orange juice',
                    price: 3.99,
                    category: 'Beverages',
                    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'
                },
                {
                    name: 'Iced Coffee',
                    description: 'Cold brew coffee with ice and milk',
                    price: 4.49,
                    category: 'Beverages',
                    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'
                },
                {
                    name: 'Mango Smoothie',
                    description: 'Creamy mango smoothie made with fresh fruit',
                    price: 5.49,
                    category: 'Beverages',
                    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400'
                },
                {
                    name: 'Soft Drinks',
                    description: 'Coca-Cola, Sprite, Fanta, or Pepsi',
                    price: 1.99,
                    category: 'Beverages',
                    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400'
                },

                // Specials
                {
                    name: "Chef's Special Platter",
                    description: 'A combination of our best dishes: grilled chicken, kebab, rice, and salad',
                    price: 18.99,
                    category: 'Specials',
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
                    featured: true
                },
                {
                    name: 'Family Feast',
                    description: 'Large pizza, chicken wings, mozzarella sticks, and 1L soft drink',
                    price: 34.99,
                    category: 'Specials',
                    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
                }
            ];

            await MenuItem.insertMany(sampleMenu);
            console.log('✅ Sample menu items added');
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

// Start server (for local development)
const PORT = process.env.PORT || 5000;

// Only start server if not running on Vercel
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📱 Frontend: http://localhost:${PORT}`);
        console.log(`🔌 API: http://localhost:${PORT}/api`);
    });
}

// Export for Vercel serverless functions
module.exports = app;
