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

router.post('/login', (req, res) => {
  if (!checkBody(req.body, ['phoneNumber'])) { 
    res.json({ result: false, error: 'Missing or empty fields' })
    return;
  } 

  if (!phoneNumberRegex.test(req.body.phoneNumber)) {
    res.json({ result: false, error: 'Numéro de téléphone invalide' })
    return;
  }

  User.findOne({ phoneNumber: req.body.phoneNumber  }).then(data => { console.log(data)
    if (data === null) { 
      console.log('User doesn t exist')
      const generatedCode = generateVerificationCode();
      verificationCodes[req.body.phoneNumber] = generatedCode; 

      res.json({ result: true,userStatus:'dontExist', generatedCode });
      
    } else if (data) {
      console.log('User exist')
      const generatedCode = generateVerificationCode()
      verificationCodes[req.body.phoneNumber] = generatedCode;

      res.json({ result: true,userStatus:'existing', generatedCode })
    } 
  })
    //Le code de vérification est généré et stocké temporairement pour que l'utilisateur puisse le recevoir et le saisir lors de la vérification ultérieure
    console.log(verificationCodes)
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

    User.findOne({ phoneNumber: req.body.phoneNumber  }).then(data => {

      if (data) {

        res.json ({ result: true, token: data.token, message: 'Bon retour'})

      } else {

      const hash = bcrypt.hashSync(req.body.generatedCode, 10)
      console.log(req.body.adress)
      const newUser = new User({
       generatedCode: hash,
       token: uid2(32),
       phoneNumber: req.body.phoneNumber,
       firstname: req.body.firstname,
       lastname: req.body.lastname,
       email: req.body.email,
       adress : '',
       healthCard: {
          dateOfBirth: null,
          bloodGroup: '',
          size: 0,
          weight: 0,
          allergies: [],
          treatment: [],
          hasHealthCard: false
       }
   });

   newUser.save().then(newDoc => {
    res.json({ result: true, token: newDoc.token , message: 'Connexion réussie !' })
  });
   }
    })

 // Supprimer le code de vérification après l'enregistrement de l'utilisateur
    delete verificationCodes[phoneNumber];
    console.log(verificationCodes)
  } else {
    res.json({ result: false, error: 'Code de vérification incorrect.' })
  }
});


router.put('/updateUserInfo', (req, res) => {

  const { phoneNumber, firstname, lastname, email, adress, dateOfBirth,
         bloodGroup, size, weight, allergies, treatment, hasHealthCard} = req.body
  console.log(req.body)
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
        adress: adress,
       'healthCard.dateOfBirth': dateOfBirth,
       'healthCard.bloodGroup': bloodGroup,  
       'healthCard.size': size,  
       'healthCard.weight': weight,  
       'healthCard.allergies': allergies,        
       'healthCard.treatment': treatment,  
       'healthCard.hasHealthCard': hasHealthCard,  
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
  //NE PAS UTILISER SAUF POUR DELETE TOUS LES USERS CREE
  /*router.delete('/delete',(req,res) => {
    User.deleteMany({})
    .then(() => {
      res.json({result:true})
    })
  })*/

module.exports = router;