var express = require('express');
var router = express.Router();

const User = require('../models/users'); 
const Order = require('../models/orders');
const Medicament = require('../models/medicament')


router.post('/add',  (req, res) => {
    const newOrder = new Order({
        date: req.body.date,
        total: req.body.total, 
        status: req.body.status,
        isPaid: req.body.isPaid, 
        product:[]
    })
    const productId = req.body.productId
    newOrder.save().then((newDoc) => {
        console.log(newDoc._id)
        Medicament.find({}).then(allMed => {
            const orderedMed = allMed.filter(e => productId.includes(e.name)).map(e => e._id)
        console.log(orderedMed)
        Order.findByIdAndUpdate(newDoc._id, {$push:{product:{$each :orderedMed}}})
        .then(() => {
            User.findByIdAndUpdate(req.body.userId,
                { $push: {orders: newOrder._id}})
                .then(() => {
                    Order.findOne({product:req.body.productId}) 
                    .populate('product')
                    .then(data => {
                        console.log(data)
                        res.json({result:true,newOrder:data})
            })
        })
        
            })
        })
        
    })
   /* try {

    const userId = req.body.userId
    const productId = req.body.productId;
    const orderDate = req.body.date
    

    const newOrder = new Order({

        date: orderDate,
        total: req.body.total, 
        status: req.body.status,
        isPaid: req.body.isPaid, 
        product:req.body.productId
    })

    await newOrder.save()/*.then(()=> {
        Order.findOne({product:productId})
        .populate('product')
        .then(data => {console.log(data)})
        
       })


    await User.findByIdAndUpdate( userId,
        
        { $push: {orders: newOrder._id}},
        { new : true }

    )
     res.json({ result: true , message : 'Order registered by ID'})
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: 'Une erreur est survenue lors de l\'enregistrement de la commande.' });
      }*/
    })


module.exports = router;