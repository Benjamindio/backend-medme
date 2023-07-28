const mongoose = require('mongoose');

const medicamentSchema = mongoose.Schema({
    name: String,
    description: String,
    price:Number,
    type:String,
    categorie:String,
    need_prescription: Boolean,
    
})


const Medicament = mongoose.model('medicaments', medicamentSchema)

module.exports = Medicament;