const Product = require('../models/Product');

module.exports = {
  addProduct: (product) => {
    return new Promise((resolve, reject) => {
      const newProduct = new Product(product);
      newProduct.save()
        .then((savedProduct) => resolve(savedProduct))
        .catch((err) => reject(err));
    });
  },
  getAllProducts:()=> {
    return new Promise(async (resolve,reject)=>{
        Product.find().then((products)=>{
            resolve(products)
        }).catch((err)=>{
            reject(err)
        })
    })
  }
};
