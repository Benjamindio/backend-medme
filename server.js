const express = require("express");
const app = express();
const stripe = require('stripe')('sk_test_VePHdqKTYQjKNInc7u56JBrQ');

// Middleware pour permettre à Express de traiter les données JSON
app.use(express.json());

// Route pour créer un PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
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