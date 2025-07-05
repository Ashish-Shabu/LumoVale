var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products = [
    {
      name: "Nike Blazer Mid 77",
      category: "shoes",
      description: "The Nike Blazer Mid '77 Vintage—classic since the beginning",
      imageLink: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/fb7eda3c-5ac8-4d05-a18f-1c2c5e82e36e/BLAZER+MID+%2777+VNTG.png"
    },

    {
      name: "Nike Dunk Low Next Nature",
      category: "shoes",
      description: "The Dunk Low pair iconic colour-blocking with premium materials and plush padding for game-changing comfort that lasts.",
      imageLink: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/537a07d4-a2b7-471b-9506-cb9b50f1d8b8/W+NIKE+DUNK+LOW+NEXT+NATURE.png"
    },

    {
      name: "Nike Court Vision Low",
      category: "shoes",
      description: " It keeps the soul of the original with crisp synthetic leather and stitched overlays, while the plush collar keeps it sleek and comfortable for your world.",
      imageLink: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4853cb6b-0ff1-49c4-a961-d03e206baab7/NIKE+COURT+VISION+LO.png"
    },

    {
      name: "Nike Air Force 1 '07",
      category: "shoes",
      description: "The classic '80s construction pairs smooth leather with bold details for style that tracks whether you're on court or on the go.",
      imageLink: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fc4622c4-2769-4665-aa6e-42c974a7705e/AIR+FORCE+1+%2707.png"
    }
  ]
  res.render('admin/view-products', {admin:true,products});
});

module.exports = router;
