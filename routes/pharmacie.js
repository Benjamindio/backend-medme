var express = require('express');
var router = express.Router();
const Pharmacie = require('../models/pharmacie')
const geolib = require('geolib');
const { list } = require('postcss');

router.post('/inArea', (req,res) => {
    let listOfPharmacie = []
    Pharmacie.find({"Nom Officiel Commune":req.body.city})
    .then(
        data => {
            
            for(let pharmacie of data) {
                const coord = pharmacie.coord.split(', ')
                const pharmacieLatitude = Number(coord[0])
                const pharmacieLongitude = Number(coord[1])
                if(geolib.isPointWithinRadius(
                    {latitude:req.body.latitude, longitude:req.body.longitude}, 
                    {latitude:pharmacieLatitude, longitude:pharmacieLongitude},5000)) {

                        const adresse = `${pharmacie.Adresse},${pharmacie['Code Commune']} ${pharmacie['Libellé département']} `
                        const coordinates = {longitude: pharmacieLongitude, latitude:pharmacieLatitude}
                        let isAvailable = Math.random() <0.75;

                        listOfPharmacie.push({pharmacieName:pharmacie['Raison sociale'], adresse,coordinates, isAvailable, pharmacieNumber:pharmacie['Téléphone']})
                        
                    } 
              
            }
            

           
            
        }
    ).then(()=> {
        if(listOfPharmacie.length > 100){
            
            listOfPharmacie = listOfPharmacie.slice(0,100)
            console.log(listOfPharmacie.length)
            
        }
            }).then(() => {
                res.json({result:true,listOfPharmacie})
            })
            
        
        
        if(!listOfPharmacie){
            res.json({result:false, message:'Aucune pharmacie'})
        }
   
})



module.exports = router;