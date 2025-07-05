var db=require('../config/connection');
module.exports = {
    addProduct:(product) => {
        return new Promise((resolve, reject) => {
            db.get().collection('products').insertOne(product).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}