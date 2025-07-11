var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
const path = require('path');



/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products', { admin: true, products});
  })
  
});

router.get('/add-products', function (req, res) {
  const message = req.query.added ? "Product added successfully" : null;
  res.render('admin/add-products', { admin: true, successMessage: message });
  console.log(message);
});


router.post('/add-products', (req, res) => {
  const { name, price, category, description } = req.body;

  if (!name || !price || !category || !description || !req.files?.image) {
    return res.render('admin/add-products', {
      admin: true,
      errorMessage: "All fields and image are required"
    });
  }

  productHelpers.addProduct(req.body).then((product) => {
    let image = req.files.image;
    const id = product._id.toString();
    const imagePath = path.join(__dirname, '../public/product-images', id + '.jpg');

    image.mv(imagePath, (err) => {
      if (!err) {
        // 🔁 Redirect instead of render
        res.redirect('/admin/add-products?added=true');
      } else {
        console.log(err);
        res.render('admin/add-products', {
          admin: true,
          errorMessage: "Image upload failed"
        });
      }
    });
  }).catch((err) => {
    console.log(err);
    res.render('admin/add-products', {
      admin: true,
      errorMessage: "Failed to add product"
    });
  });
});

router.get('/delete-product/:id' , (req, res) => {
  let productId = req.params.id;
  productHelpers.deleteProduct(productId).then(() => {
    res.redirect('/admin');
  })
  .catch((err) => {
    console.log(err);
    res.render('admin/view-products', {
      admin: true,
      errorMessage: "Failed to delete product"
    });
  });
})

router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id);
  res.render('admin/edit-product', { admin: true, product });
});

router.post('/edit-products/:id', (req,res) => {
  productHelpers.updateProduct(req.params.id ,req.body).then(() => {
    let image = req.files?.image;
    if (image) {
      const id = req.params.id;
      const imagePath = path.join(__dirname, '../public/product-images', id + '.jpg');

      image.mv(imagePath)
    res.redirect('/admin');
    }
  })
})


module.exports = router;
