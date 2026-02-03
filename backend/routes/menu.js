const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/menu
// @desc    Get all menu items (with optional category filter)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, featured } = req.query;
        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by featured
        if (featured === 'true') {
            query.featured = true;
        }

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const menuItems = await MenuItem.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (error) {
        console.error('Menu fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching menu items'
        });
    }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        console.error('Menu item fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching menu item'
        });
    }
});

// @route   POST /api/menu
// @desc    Add new menu item
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { name, description, price, category, image, featured, preparationTime } = req.body;

        const menuItem = await MenuItem.create({
            name,
            description,
            price,
            category,
            image,
            featured: featured || false,
            preparationTime
        });

        res.status(201).json({
            success: true,
            message: 'Menu item added successfully',
            data: menuItem
        });
    } catch (error) {
        console.error('Menu item creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding menu item'
        });
    }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item updated successfully',
            data: menuItem
        });
    } catch (error) {
        console.error('Menu item update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating menu item'
        });
    }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        console.error('Menu item deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting menu item'
        });
    }
});

module.exports = router;
