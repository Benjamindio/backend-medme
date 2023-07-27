var express = require('express');
var router = express.Router();

//require('../models/connection'); // creer la base de donnee et connection string

//const { checkBody } = require('../modules/checkBody'); //module à rajouter
//const User = require('../models/users'); // schema a faire
const uid2 = require('uid2'); // installer module
const bcrypt = require('bcrypt'); // installer module

const verificationCodes = {};

function generateVerificationCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'password', 'firstname', 'phoneNumber'])) { //modifier le parametre
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ username: req.body.username }).then(data => { //modifier le parametre
    if (data === null) { 
      
      const generatedCode = generateVerificationCode();

      verificationCodes[req.body.phoneNumber] = generatedCode;
      console.log(verificationCodes)

      res.json({ result: true, generatedCode });
    } else {
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

router.post('/verify', (req, res) => {
  const { phoneNumber, generatedCode } = req.body;

  const storedVerificationCode = verificationCodes[phoneNumber];
  console.log(verificationCodes)

  if (!storedVerificationCode) {
    res.json({ result: false, error: 'Code de vérification expiré ou non généré.' });
    return;
  }

  if (storedVerificationCode === generatedCode) {

    const hash = bcrypt.hashSync(req.body.password, 10);
      
    const newUser = new User({
       username: req.body.username,
       password: hash,
       firstname: req.body.firstname,
       token: uid2(32),
       phoneNumber: req.body.phoneNumber,
   });

   newUser.save().then(newDoc => {
    res.json({ result: true, token: newDoc.token , message: 'Connexion réussie !' });
  });

 // Supprimer le code de vérification après l'enregistrement de l'utilisateur
    delete verificationCodes[phoneNumber];
    
  } else {
    res.json({ result: false, error: 'Code de vérification incorrect.' });
  }
});

module.exports = router;