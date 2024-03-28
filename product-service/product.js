const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: String, 
    description: String,
    price: Number,
    createdAt: {  
        type: Date,
        defaule: Date.now()
    }
})   

module.exports = mongoose.model('product', productSchema)