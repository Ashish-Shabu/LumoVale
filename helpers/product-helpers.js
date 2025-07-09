const { get } = require('http');
const Product = require('../models/Product');
var ObjectId = require('mongodb').ObjectId;

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
    return new Promise((resolve, reject) => {
        Product.find().then((products)=>{
            resolve(products)
        }).catch((err)=>{
            reject(err)
        })
    })
  },
  deleteProduct: (productId) => Product.findByIdAndDelete(productId),

  getProductDetails: (productId) => {
    return new Promise((resolve, reject) => {
      Product.findById(productId).then((product) => {
        resolve(product);
      }).catch((err) => {
        reject(err);
      });
    });
  },
   updateProduct: (productId, productData) => {
    return new Promise((resolve, reject) => {
      Product.findByIdAndUpdate(productId, productData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      })
    })
   } 
  
}
