const mongoose = require('mongoose');

const medicamentSchema = mongoose.Schema({
    name: String,
    description: String,
    price:Number,
    type:String,
    categorie:String,
    need_prescription: Boolean,
    image:String,
    product_id:String,
    
})


const Medicament = mongoose.model('medicaments', medicamentSchema)

module.exports = Medicament;