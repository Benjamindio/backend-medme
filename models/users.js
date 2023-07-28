const mongoose = require('mongoose');

const healthCardSchema = mongoose.Schema({

    dateOfBirth: Number,
    bloodGroup: String,
    size: Number,
    weight: Number,
    allergies: Array,
    treatment: Array,
    hasHealthCard: Boolean

})




const userSchema = mongoose.Schema({

	firstname: {type: String, default: ''},
    lastname:  {type: String, default: ''},
    email:  {type: String, default: ''},
    phoneNumber : Number,
    generatedCode: String,
    token : String,

});

const User = mongoose.model('users', userSchema);

module.exports = User;