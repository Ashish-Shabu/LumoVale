const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    deliveryDetails: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        zipcode: { type: String, required: true },
        phoneNumber: { type: String, required: true }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: { type: Number, default: 1 }
        }
    ],
    paymentMethod: { type: String, required: true },
    status: { type: String },
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);