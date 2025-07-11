const { resolve } = require('path');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const bcrypt = require('bcrypt');
const { pipeline } = require('stream');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


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
                        product: "$productDetails",
                        subtotal: { $multiply: ["$products.quantity", "$productDetails.price"] }
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
    },

    getCartProductList: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await Cart.findOne({ userId });

            resolve(cart.products)
        })
    },

    placeOrder: (orderData, products, total) => {
        return new Promise(async (resolve, reject) => {
            let status = orderData.paymentMethod === 'Cash on Delivery' ? 'placed' : 'pending';
            let orderObj = {
                deliveryDetails: {
                    name: orderData.billingName,
                    address: orderData.billingAddress,
                    zipcode: orderData.zipCode,
                    phoneNumber: orderData.billingPhone
                },
                userId: orderData.userId,
                products: products,
                paymentMethod: orderData.paymentMethod,
                status: orderData.paymentMethod === 'Cash on Delivery' ? 'Placed' : 'Pending',
                totalAmount: total,
                date: new Date()
            };

            const order = new Order(orderObj);
            await order.save().then((response) => {
                // Clear the cart after placing the order
                Cart.deleteOne({ userId: orderData.userId }).then(() => {
                    resolve(response._id);
                })

            })


        });
    },

    getUserOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) })
                .populate('products.productId')
                .sort({ date: -1 });

            resolve(orders);
        });
    },

    generateRazorpay: (orderId, total) => {
        return new Promise((resolve, reject) => {
            instance.orders.create({
                amount: total*100,
                currency: "INR",
                receipt: orderId,
            }).then((order) => {
                console.log("New order: ", order);
                resolve(order);
            }).catch((err) => {
                reject(err);
            });
        })
    },

    verifypayment: (details) => {
        return new Promise((resolve, reject) => {
            const {
                createHmac,
            } = require('node:crypto');
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = details.payment;
            const hmac = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(razorpay_order_id + '|' + razorpay_payment_id)
                .digest('hex');

            if (hmac === razorpay_signature) {
                resolve();
            } else {
                reject();
            }

        })
    },
    changePaymentStatus: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await Order.updateOne({ _id: orderId }, { $set: { status: 'Placed' } })
                .then(() => {
                    resolve();
                })
        })
    }
}





