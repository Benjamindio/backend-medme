const mongoose = require('mongoose'); 

const pharmacieSchema = mongoose.Schema({
    "Raison sociale":String,
    "Libellé département":String,
    "Nom Officiel Commune":String,
    "Code Commune": Number,
    Téléphone:Number,
    Adresse:String,
    coord:String,


})

const Pharmacie = mongoose.model('pharmacies', pharmacieSchema)

module.exports = Pharmacie