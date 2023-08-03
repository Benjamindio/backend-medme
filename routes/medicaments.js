var express = require('express');
var router = express.Router();
const {checkBody} = require('../modules/checkBody')
const {medFinder} = require('../modules/MedsFinder')
const Medicament = require('../models/medicament')
const uid2 = require('uid2');


router.get('/:product_id', (req, res) => {
  
    if (!req.params.product_id) {
      res.json({ result: false, error: 'Not found' });
    }
  
    Medicament.findOne({ product_id: { $regex: new RegExp(req.params.product_id, 'gi') } })
      .then(data => {
         res.json({ result: true, medicaments: data });
      })
  });


// cherche en BDD les médicaments et si non existant va les récupérer 
router.post('/', async (req,res) => {
    if (!checkBody(req.body, ['name'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
      }
      
    try { //essaye de réaliser la requête sinon indique le message d'erreur
        let data = await Medicament.findOne({name:{$regex: new RegExp(req.body.name,'gi')}}) // va chercher en BDD si un titre de médicament existe avec le req.body.name
        if(!data) { 
            console.log('searching the Web')
            const listOfMedicament =[]
                 const searchForMed =  await medFinder(req.body.name) // si pas de similitude, lance le scrapper pour aller chercher les médicaments 
                 
                if(searchForMed) {
                    for (let med of searchForMed){ // boucle pour sauvegarder la donnée en BDD 
                        const searchForSimilarities = await Medicament.findOne({name:{$regex:new RegExp(med.title, 'gi')}}) // Vérifie si une des données récupérées est similaire à une des données présentes en BDD
                        if(!searchForSimilarities){  // si non Save la donnée dans la BDD
                    let categorie = "Médicaments"
                    if(med.type !== "Médicaments") { // si le type est médicament, ajoute la catégorie Médicaments en BDD et sinon Parapharmacie
                        categorie = "Parapharmacie"
                    }
                    const price = med.price
                    const numberPrice = Number(price.replace(',', '.').replace('€', '')) // reformatter le prix qui est récupérer du scrapper en string

                   const newMedicaments = new Medicament({
                        name: med.title,
                        description:med.description,
                        price: numberPrice,
                        type: med.type,
                        categorie: categorie,
                        need_prescription:med.need_prescription,
                        image:med.image,
                        product_id:uid2(10)
                    })
                    const savedMedicament = await newMedicaments.save()
                        console.log('Medicament saved')
                        listOfMedicament.push({medName:savedMedicament.name, medCategorie:savedMedicament.categorie, product_id:savedMedicament.product_id, medPrice:savedMedicament.price, medImage:savedMedicament.image})
                    
                } else { // si oui push la donnée présente en BDD dans le res.json
                    listOfMedicament.push({medName:searchForSimilarities.name, medCategorie:searchForSimilarities.categorie,product_id:searchForSimilarities.product_id, medPrice:searchForSimilarities.price, medImage:searchForSimilarities.image})
                }}
                res.json({result:true, medicaments:listOfMedicament})
        } else {
            res.json({result:false })
        }
    } else {
        Medicament.find({name:{$regex: new RegExp(req.body.name,'gi')}}) // si similitude en BDD , renvoie directement les données en BDD
        .then(medicaments => {
            const listOfMedicament = []
            for (let med of medicaments) {
                listOfMedicament.push({medName:med.name, medCategorie:med.categorie, product_id:med.product_id,medPrice:med.price, medImage:med.image})
            }
            res.json({result:true, medicaments:listOfMedicament})
        })
        
    }
    }catch (error) { // affiche l'erreur si la requête n'a pas pu être réalisé
        console.error(error);
        res.json({ result: false, error: 'An internal error occurred' });
    }    
})
    



router.post('/categorie', async (req,res) => {
    if (!checkBody(req.body, ['name'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
      }
      
    try { //essaye de réaliser la requête sinon indique le message d'erreur
        let data = await Medicament.findOne({name:{$regex: new RegExp(req.body.name,'gi')}}) // va chercher en BDD si un titre de médicament existe avec le req.body.name
        if(!data) { 
            console.log('searching the Web')
            const listOfMedicament =[]
                 const searchForMed =  await medFinder(req.body.name) // si pas de similitude, lance le scrapper pour aller chercher les médicaments 
                 
                if(searchForMed) {
                    for (let med of searchForMed){ // boucle pour sauvegarder la donnée en BDD 
                        const searchForSimilarities = await Medicament.findOne({name:{$regex:new RegExp(med.title, 'gi')}}) // Vérifie si une des données récupérées est similaire à une des données présentes en BDD
                        if(!searchForSimilarities){  // si non Save la donnée dans la BDD
                            let categorie = "Médicaments"
                    if(med.type !== "Médicaments") { // si le type est médicament, ajoute la catégorie Médicaments en BDD et sinon Parapharmacie
                        categorie = "Parapharmacie"
                    }
                    console.log(categorie)
                    if(req.body.categorie === categorie) { // si le type est médicament, ajoute la catégorie Médicaments en BDD et sinon Parapharmacie
                        const price = med.price
                        const numberPrice = Number(price.replace(',', '.').replace('€', '')) // reformatter le prix qui est récupérer du scrapper en string
    
                       const newMedicaments = new Medicament({
                            name: med.title,
                            description:med.description,
                            price: numberPrice,
                            type: med.type,
                            categorie: categorie,
                            need_prescription:med.need_prescription,
                            image:med.image,
                            product_id:uid2(10)
                        })
                        const savedMedicament = await newMedicaments.save()
                            console.log('Medicament saved')
                            listOfMedicament.push({medName:savedMedicament.name, medImage:savedMedicament.image, medPrice:savedMedicament.price, categorie:savedMedicament.categorie, product_id:savedMedicament.product_id})
                    }
                } else { // si oui push la donnée présente en BDD dans le res.json
                    listOfMedicament.push({medName:searchForSimilarities.name, medImage:searchForSimilarities.image, medPrice:searchForSimilarities.price, categorie:searchForSimilarities.categorie, product_id:searchForSimilarities.product_id})
                }}
                res.json({result:true, medicaments:listOfMedicament})
        } else {
            res.json({result:false })
        }
    } else {
        Medicament.find({name:{$regex: new RegExp(req.body.name,'gi')}, categorie:req.body.categorie}) // si similitude en BDD , renvoie directement les données en BDD
        .then(medicaments => {
            const listOfMedicament = []
            for (let med of medicaments) {
                listOfMedicament.push({medName:med.name, medImage:med.image, medPrice:med.price, categorie:med.categorie, product_id:med.product_id})
            }
            res.json({result:true, medicaments:listOfMedicament})
        })
        
    }
    }catch (error) { // affiche l'erreur si la requête n'a pas pu être réalisé
        console.error(error);
        res.json({ result: false, error: 'An internal error occurred' });
    }    
})



module.exports = router;