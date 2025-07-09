var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
var userHelpers = require('../helpers/user-helpers');
const path = require('path');

const isLoggedIn = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
};


/* GET home page. */

router.get('/', async function (req, res, next) {
  let user = req.session.user;
  let cartCount = 0;
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products', { products, user, cartCount });
  })

});


router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect('/');
  } else {
    res.render('user/user-login', { LoginErr: req.session.loginErr })
    req.session.loginErr = null;
  }
});

router.get('/signup', (req, res) => {
  res.render('user/user-signup')
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    req.session.loggedIn = true;
    req.session.user = response.user;
    res.redirect('/')
  })
})

router.post('/login', (req, res) => {
  userHelpers.dologin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect('/')
    }
    else {
      req.session.loginErr = "Envalid Email or Password";
      res.redirect('/login');
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});



router.get('/cart', isLoggedIn, async (req, res) => {
  let products = await userHelpers.getCartProducts(req.session.user._id)
  const cartCount = await userHelpers.getCartCount(req.session.user._id);


  console.log(products);
  res.render('user/cart', { user: req.session.user, products,cartCount });
})

router.get('/add-to-cart/:id', isLoggedIn, async (req, res) => {
  let productId = req.params.id;
  let userId = req.session.user._id;

  await userHelpers.addToCart(productId, userId);

  const cartCount = await userHelpers.getCartCount(userId); // NEW FUNCTION
  res.json({ status: true, cartCount });
});

router.post('/change-product-quantity', (req, res) => {
  userHelpers.changeProductQuantity(req.body).then((response) => {
    res.json(response);
  });
});






module.exports = router;
