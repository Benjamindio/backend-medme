var express = require('express');
var router = express.Router();


const { checkBody } = require('../modules/checkBody'); 
const User = require('../models/users'); 
const uid2 = require('uid2'); 
const bcrypt = require('bcrypt'); 

const verificationCodes = {}; // code stocker ici
const phoneNumberRegex = /^(06|07)\d{8}$/; 

function generateVerificationCode() {
  return Math.floor(10000 + Math.random() * 90000).toString() // créer un code aléatoire de 5 chiffres compris entre 10000 et 99999.
}

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['phoneNumber'])) { 
    res.json({ result: false, error: 'Missing or empty fields' })
    return;
  } 

  if (!phoneNumberRegex.test(req.body.phoneNumber)) {
    res.json({ result: false, error: 'Numéro de téléphone invalide' })
    return;
  }

  User.findOne({ phoneNumber: req.body.phoneNumber  }).then(data => { 
    if (data === null) { 
      
      const generatedCode = generateVerificationCode();

      verificationCodes[req.body.phoneNumber] = generatedCode; 

      res.json({ result: true, generatedCode });
    } else {
      res.json({ result: false, error: 'User already exists' })
    }
    //Le code de vérification est généré et stocké temporairement pour que l'utilisateur puisse le recevoir et le saisir lors de la vérification ultérieure
    console.log(verificationCodes)
  });
});

router.post('/verify', (req, res) => {
  const { phoneNumber, generatedCode } = req.body

  const storedVerificationCode = verificationCodes[phoneNumber] //stockage du code et du numéro de tel associé
  console.log(verificationCodes)

  if (!storedVerificationCode) { // si code et tel associé différent
    res.json({ result: false, error: 'Code de vérification expiré ou non généré.' })
    return;
  }

  if (storedVerificationCode === generatedCode) {

    const hash = bcrypt.hashSync(req.body.generatedCode, 10)
      
    const newUser = new User({
       generatedCode: hash,
       token: uid2(32),
       phoneNumber: req.body.phoneNumber,
       firstname: req.body.firstname,
       lastname: req.body.lastname,
       email: req.body.email
   });

   newUser.save().then(newDoc => {
    res.json({ result: true, token: newDoc.token , message: 'Connexion réussie !' })
  });

 // Supprimer le code de vérification après l'enregistrement de l'utilisateur
    delete verificationCodes[phoneNumber];
    
  } else {
    res.json({ result: false, error: 'Code de vérification incorrect.' })
  }
});


router.post('/updateUserInfo', (req, res) => {

  const { phoneNumber, firstname, lastname, email} = req.body

  if ( !phoneNumber ) {
    res.json ({ result: false, error: 'Missing or empty fields'})
    return
  }

  User.updateOne(
    { phoneNumber: phoneNumber },
    {
      $set: {
        firstname: firstname,
        lastname: lastname,
        email: email,
      },
    }
  )

    .then(data => {
      if (data) {
        res.json({ result: true , message : 'Informations mises à jour'})
      } else {
        res.json({ result: false })
      }
    })
  })
  










module.exports = router;