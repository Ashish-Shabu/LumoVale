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
    }).catch((err) => {
      console.log(err);
      res.render('user/user-signup', { errorMessage: err.message });
    });
  })

  router.post('/login', (req, res) => {
    userHelpers.dologin(req.body).then((response) => {
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect('/')
      }
      else {
        req.session.loginErr = "Invalid Email or Password";
        res.redirect('/login');
      }
    }).catch((err) => {
      console.log(err);
      req.session.loginErr = "Login failed. Please try again.";
      res.redirect('/login');
    });
  });

  router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });



  router.get('/cart', isLoggedIn, async (req, res) => {
    try {
      const products = await userHelpers.getCartProducts(req.session.user._id);
      const cartCount = await userHelpers.getCartCount(req.session.user._id);

      console.log(products);
      res.render('user/cart', { user: req.session.user, products, cartCount });
    } catch (err) {
      console.log(err);
      res.render('user/cart', { user: req.session.user, products: [], cartCount: 0 });
    }
  })

  router.get('/add-to-cart/:id', isLoggedIn, async (req, res) => {
    let productId = req.params.id;
    let userId = req.session.user._id;

    await userHelpers.addToCart(productId, userId);

    const cartCount = await userHelpers.getCartCount(userId);
    res.json({ status: true, cartCount });
  });

  router.post('/change-product-quantity', (req, res) => {
    userHelpers.changeProductQuantity(req.body).then((response) => {
      res.json(response);
    });
  });

  router.get('/place-order', isLoggedIn, async (req, res) => {
    let userId = req.session.user._id;
    const cartItems = await userHelpers.getCartProducts(userId);
    const cartCount = await userHelpers.getCartCount(userId);
    let total = 0;
    cartItems.forEach(item => {
      item.subtotal = item.quantity * item.product.price;
      total += item.subtotal;
    });
    res.render('user/place-order', { user: req.session.user, cart: cartItems, cartCount, total, razorpayKey: process.env.RAZORPAY_KEY_ID });
  })

  router.post('/place-order', isLoggedIn, async (req, res) => {
    try {
      let products = await userHelpers.getCartProductList(req.body.userId);

      const cartItems = await userHelpers.getCartProducts(req.body.userId);
      let total = 0;
      cartItems.forEach(item => {
        item.subtotal = item.quantity * item.product.price;
        total += item.subtotal;
      });

      userHelpers.placeOrder(req.body, products, total).then((orderId) => {
        if (req.body.paymentMethod === 'Cash on Delivery') {
          res.json({ codSuccess: true })
        } else {
          userHelpers.generateRazorpay(orderId, total).then((response) => {
            res.json(response)
          }).catch((err) => {
            console.log(err);
            res.json({ status: false, error: "Payment gateway error" });
          });
        }
      }).catch((err) => {
        console.log(err);
        res.json({ status: false, error: "Order placement failed" });
      });
    } catch (err) {
      console.log(err);
      res.json({ status: false, error: "Server error" });
    }
  })

  router.get('/order', isLoggedIn, async (req, res) => {
    try {
      const userId = req.session.user._id;
      const orders = await userHelpers.getUserOrders(userId);
      res.render('user/order', { user: req.session.user, orders });
    } catch (err) {
      console.log(err);
      res.render('user/order', { user: req.session.user, orders: [] });
    }
  });

  router.post('/verifyPayment', (req, res) => {
    console.log(req.body)
    userHelpers.verifypayment(req.body).then(() => {
      userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
        res.json({ status: true });
      }).catch((err) => {
        console.log(err);
        res.json({ status: false, error: "Payment verification failed" });
      });

    })
  })



  module.exports = router;
