const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    date: Date,
    total: Number,
    product: [{type:mongoose.Schema.Types.ObjectId, ref:'médicaments'}]
    
})


const Order = mongoose.model('orders', orderSchema)

module.exports = Order;