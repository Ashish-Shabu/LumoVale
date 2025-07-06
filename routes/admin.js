var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
const path = require('path');



/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products', { admin: true, products});
  })
  
});

router.get('/add-products', function (req, res) {
  res.render('admin/add-products')
})

router.post('/add-products', (req, res) => {
  console.log(req.body);
  productHelpers.addProduct(req.body).then((product) => {
    let image = req.files?.image;
    const id = product._id.toString();
    const imagePath = path.join(__dirname, '../public/product-images', id + '.jpg');
    image.mv(imagePath, (err) => {
      if (!err) {

        res.render('admin/add-products', { message: "Product added successfully"});
      } else {
        console.log(err)
      }
    })
  })
})

module.exports = router;
