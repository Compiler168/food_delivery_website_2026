const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        }
    },
    contactPhone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderNotes: {
        type: String,
        trim: true
    },
    estimatedDeliveryTime: {
        type: Date
    },
    paymentMethod: {
        type: String,
        default: 'COD',
        enum: ['COD']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Add order number field
orderSchema.virtual('orderNumber').get(function () {
    return `MK${this._id.toString().slice(-8).toUpperCase()}`;
});

module.exports = mongoose.model('Order', orderSchema);
