const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { items, deliveryAddress, contactPhone, orderNotes } = req.body;

        // Validate required fields
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item'
            });
        }

        if (!deliveryAddress || !contactPhone) {
            return res.status(400).json({
                success: false,
                message: 'Delivery address and contact phone are required'
            });
        }

        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Estimate delivery time (45 minutes from now)
        const estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000);

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            deliveryAddress,
            contactPhone,
            orderNotes,
            estimatedDeliveryTime
        });

        // Add order to user's orders array
        await User.findByIdAndUpdate(req.user._id, {
            $push: { orders: order._id }
        });

        // Populate order with item details
        await order.populate('items.menuItem');

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order'
        });
    }
});

// @route   GET /api/orders
// @desc    Get user's order history
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.menuItem')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Orders fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.menuItem')
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user owns this order or is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Order fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order'
        });
    }
});

// @route   GET /api/orders/all/admin
// @desc    Get all orders (admin only)
// @access  Private/Admin
router.get('/all/admin', protect, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email phone')
            .populate('items.menuItem')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Admin orders fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (req.body.paymentStatus) {
            if (['pending', 'paid'].includes(req.body.paymentStatus)) {
                updateData.paymentStatus = req.body.paymentStatus;
            }
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('items.menuItem');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Order update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order'
        });
    }
});

module.exports = router;
