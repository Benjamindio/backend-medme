const mongoose = require('mongoose');

const healthCardSchema = mongoose.Schema({

    dateOfBirth: {type: Date, default: null},
    bloodGroup: {type: String, default: ''},
    size: {type: Number, default: 0},
    weight: {type: Number, default: 0},
    allergies: {type: Array, default: []},
    treatment: {type: Array, default: []},
    hasHealthCard: {type: Boolean, default: false},

})




const userSchema = mongoose.Schema({

	firstname: {type: String, default: ''},
    lastname:  {type: String, default: ''},
    email:  {type: String, default: ''},
    adress : {type: String, default: ''},
    phoneNumber : Number,
    generatedCode: String,
    token : String,
    healthCard : healthCardSchema,

});    

const User = mongoose.model('users', userSchema);

module.exports = User;