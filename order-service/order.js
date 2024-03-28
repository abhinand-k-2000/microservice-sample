const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    products: [
        {
            productId: String
        }
    ],
    user: String,
    total_price: Number,    
    createdAt: {
        type: Date,
        default: Date.now()
    }
})   

module.exports = mongoose.model('order', orderSchema)