const { resolve } = require('path');
const User = require('../models/User');
const Cart = require('../models/Cart');
const bcrypt = require('bcrypt');
const { pipeline } = require('stream');
const mongoose = require('mongoose');


module.exports = {
    doSignup: async (userData) => {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('User already exists');
        };

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = new User({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: hashedPassword
        });

        await newUser.save();
        return newUser;

    },

    dologin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {};
            const user = await User.findOne({
                email: userData.email
            })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    } else {
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
    },

    addToCart: (productId, userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await Cart.findOne({ userId });
            if (cart) {
                let productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

                if (productIndex > -1) {
                    cart.products[productIndex].quantity += 1;
                } else {
                    cart.products.push({ productId });
                }

                await cart.save();
                resolve(cart);
            } else {
                const newCart = new Cart({
                    userId,
                    products: [{ productId }]
                });

                await newCart.save();
                resolve(newCart);
            }
        });
    },

    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await Cart.aggregate([
                {
                    $match: { userId: new mongoose.Types.ObjectId(userId) }

                },
                {
                    $unwind: "$products"
                },
                {
                    $lookup: {
                        from: "products", // name of the products collection
                        localField: "products.productId",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },
                {
                    $unwind: "$productDetails"
                },
                {
                    $project: {
                        _id: 0,
                        productId: "$products.productId",
                        quantity: "$products.quantity",
                        product: "$productDetails"
                    }
                }
            ]);

            resolve(cartItems);
        })
    },

    getCartCount: async (userId) => {
        const cart = await Cart.findOne({ userId });
        if (!cart || !cart.products) return 0;

        let count = 0;
        cart.products.forEach(p => {
            count += p.quantity;
        });
        return count;
    },

    changeProductQuantity: ({ productId, userId, count }) => {
        return new Promise(async (resolve, reject) => {
            let cart = await Cart.findOne({ userId });

            let productIndex = cart.products.findIndex(
                p => p.productId.toString() === productId
            );

            if (productIndex >= 0) {
                cart.products[productIndex].quantity += parseInt(count);

                if (cart.products[productIndex].quantity <= 0) {
                    cart.products.splice(productIndex, 1);
                    await cart.save();
                    resolve({ status: true, removeProduct: true });
                } else {
                    await cart.save();
                    resolve({ status: true });
                }
            } else {
                resolve({ status: false });
            }
        });
    }



}

