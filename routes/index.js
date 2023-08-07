var express = require('express');
var router = express.Router();
const {medFinder} = require('../modules/MedsFinder')
const app = express();
const stripe = require('stripe')('sk_test_VePHdqKTYQjKNInc7u56JBrQ');

const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');
app.use(express.json());
router.post('/upload', async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }

  fs.unlinkSync(photoPath);
});
app.use(express.json());

// Route pour créer un PaymentIntent
router.post("/create-payment-intent", async (req, res) => {
    const { currency } = req.body;
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: currency || 'usd',
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Erreur lors de la création du PaymentIntent :", error.message);
      res.status(500).json({ error: "Une erreur est survenue lors de la création du PaymentIntent" });
    }
  }); 

module.exports = router;
