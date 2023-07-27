var express = require('express');
var router = express.Router();
const {medFinder} = require('../modules/MedsFinder')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/medicament', (req,res) => {
  (async () => {
    let info = await medFinder(req.body.name)
    if(info) {
      res.json({info:info})
    }
  })();
})

module.exports = router;
